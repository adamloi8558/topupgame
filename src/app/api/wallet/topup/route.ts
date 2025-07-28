import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, slips, transactions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getAuthUser, requireAuth } from '@/lib/auth';
import { cloudflareR2 } from '@/lib/cloudflare-r2';
import { easySlipAPI } from '@/lib/easyslip';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';
import { ApiResponse } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthUser(request);
    const authenticatedUser = requireAuth(user);

    // Parse form data
    const formData = await request.formData();
    const amount = formData.get('amount') as string;
    const slipFile = formData.get('slip') as File;

    // Validate input
    if (!amount || !slipFile) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 10 || amountNum > 100000) {
      return NextResponse.json(
        { success: false, error: 'จำนวนเงินไม่ถูกต้อง (10 - 100,000 บาท)' },
        { status: 400 }
      );
    }

    // Validate file
    if (!slipFile.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'กรุณาอัพโหลดไฟล์รูปภาพเท่านั้น' },
        { status: 400 }
      );
    }

    if (slipFile.size > 5 * 1024 * 1024) { // 5MB
      return NextResponse.json(
        { success: false, error: 'ไฟล์มีขนาดใหญ่เกิน 5MB' },
        { status: 400 }
      );
    }

    // Upload slip to Cloudflare R2
    const slipId = uuidv4();
    const fileName = `slips/${slipId}_${Date.now()}.${slipFile.name.split('.').pop()}`;
    
    let slipUrl: string;
    try {
      const uploadResult = await cloudflareR2.uploadFile(slipFile, fileName, {
        userId: authenticatedUser.id,
        type: 'wallet-topup-slip',
      });
      slipUrl = uploadResult.url;
    } catch (error) {
      console.error('Slip upload failed:', error);
      return NextResponse.json(
        { success: false, error: 'ไม่สามารถอัพโหลดสลิปได้' },
        { status: 500 }
      );
    }

    // Save slip record to database
    const [slipRecord] = await db
      .insert(slips)
      .values({
        id: slipId,
        userId: authenticatedUser.id,
        orderId: null, // For wallet topup, no specific order
        amount: amountNum.toString(),
        imageUrl: slipUrl,
        status: 'pending',
        createdAt: new Date(),
      })
      .returning();

    // Verify slip with EasySlip API
    try {
      const verifyResult = await easySlipAPI.verifySlip(slipUrl);
      
      if (verifyResult.success && verifyResult.data) {
        const slipData = verifyResult.data;
        
        // Check if slip amount matches
        const slipAmount = parseFloat(slipData.amount?.amount || '0');
        if (Math.abs(slipAmount - amountNum) > 0.01) {
          await db
            .update(slips)
            .set({ 
              status: 'rejected',
              verificationData: verifyResult,
              updatedAt: new Date(),
            })
            .where(eq(slips.id, slipId));

          return NextResponse.json({
            success: false,
            error: `จำนวนเงินในสลิปไม่ตรงกับที่ระบุ (สลิป: ${slipAmount} บาท, ระบุ: ${amountNum} บาท)`,
          }, { status: 400 });
        }

        // Check bank account (optional - you can customize this)
        const receiverBank = slipData.receiver?.bank?.name;
        if (receiverBank && !receiverBank.includes('กรุงไทย')) {
          await db
            .update(slips)
            .set({ 
              status: 'rejected',
              verificationData: verifyResult,
              updatedAt: new Date(),
            })
            .where(eq(slips.id, slipId));

          return NextResponse.json({
            success: false,
            error: 'ธนาคารปลายทางไม่ถูกต้อง กรุณาโอนเข้าบัญชีกรุงไทยที่ระบุ',
          }, { status: 400 });
        }

        // Update slip status to verified
        await db
          .update(slips)
          .set({ 
            status: 'verified',
            verificationData: verifyResult,
            updatedAt: new Date(),
          })
          .where(eq(slips.id, slipId));

        // Add points to user wallet
        const [updatedUser] = await db
          .update(users)
          .set({ 
            points: (parseFloat(authenticatedUser.points) + amountNum).toString(),
            updatedAt: new Date(),
          })
          .where(eq(users.id, authenticatedUser.id))
          .returning();

        // Create transaction record
        await db
          .insert(transactions)
          .values({
            id: uuidv4(),
            userId: authenticatedUser.id,
            type: 'topup',
            status: 'completed',
            amount: amountNum.toString(),
            pointsEarned: amountNum.toString(),
            referenceId: slipId,
            description: `เติมพ้อยผ่านการโอนเงิน ${amountNum} บาท`,
            createdAt: new Date(),
          });

        return NextResponse.json({
          success: true,
          message: 'เติมพ้อยสำเร็จ',
          data: {
            slipId,
            amount: amountNum,
            newBalance: updatedUser.points,
          },
        });

      } else {
        // EasySlip verification failed
        await db
          .update(slips)
          .set({ 
            status: 'rejected',
            verificationData: verifyResult,
            updatedAt: new Date(),
          })
          .where(eq(slips.id, slipId));

        return NextResponse.json({
          success: false,
          error: verifyResult.error || 'ไม่สามารถตรวจสอบสลิปได้',
        }, { status: 400 });
      }

    } catch (easySlipError) {
      console.error('EasySlip API error:', easySlipError);
      
      // Keep slip as pending for manual review
      await db
        .update(slips)
        .set({ 
          status: 'pending',
          updatedAt: new Date(),
        })
        .where(eq(slips.id, slipId));

      return NextResponse.json({
        success: true,
        message: 'ได้รับสลิปแล้ว กำลังตรวจสอบ กรุณารอการยืนยันจากเจ้าหน้าที่',
        data: {
          slipId,
          amount: amountNum,
          status: 'pending',
        },
      });
    }

  } catch (error) {
    console.error('Wallet topup error:', error);
    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
} 