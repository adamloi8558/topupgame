import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slips, orders, users, transactions, adminSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { easySlipAPI } from '@/lib/easyslip';
import { getAuthUser, requireAuth } from '@/lib/auth';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';
import { ApiResponse } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Function to get bank settings from admin_settings
async function getBankSettings() {
  const bankSettings = await db
    .select()
    .from(adminSettings)
    .where(eq(adminSettings.key, 'bank_info'))
    .limit(1);

  if (!bankSettings.length) {
    return null;
  }

  try {
    return JSON.parse(bankSettings[0].value);
  } catch (error) {
    console.error('Error parsing bank settings:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthUser(request);
    const authenticatedUser = requireAuth(user);

    // Parse request body
    const body = await request.json();
    const { slipId } = body;

    if (!slipId) {
      return NextResponse.json(
        { success: false, error: 'กรุณาระบุหมายเลขสลิป' },
        { status: 400 }
      );
    }

    // Find slip and verify ownership
    const [slip] = await db
      .select({
        id: slips.id,
        orderId: slips.orderId,
        fileUrl: slips.fileUrl,
        fileName: slips.fileName,
        status: slips.status,
        easyslipData: slips.easyslipData,
        uploadedAt: slips.uploadedAt,
        order: {
          id: orders.id,
          userId: orders.userId,
          type: orders.type,
          status: orders.status,
          amount: orders.amount,
          pointsEarned: orders.pointsEarned,
          gameUid: orders.gameUid,
          gameId: orders.gameId,
        },
      })
      .from(slips)
      .leftJoin(orders, eq(slips.orderId, orders.id))
      .where(eq(slips.id, slipId))
      .limit(1);

    if (!slip) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบสลิป' },
        { status: 404 }
      );
    }

    if (!slip.order) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบคำสั่งซื้อที่เกี่ยวข้อง' },
        { status: 404 }
      );
    }

    if (slip.order.userId !== authenticatedUser.id) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.FORBIDDEN },
        { status: 403 }
      );
    }

    if (slip.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'สลิปนี้ถูกตรวจสอบแล้ว' },
        { status: 400 }
      );
    }

    // Verify with EasySlip API
    const verificationResult = await easySlipAPI.verifySlip({
      url: slip.fileUrl,
      checkDuplicate: true,
    });

    // Update slip with EasySlip data
    await db
      .update(slips)
      .set({
        easyslipData: verificationResult,
        verifiedAt: new Date(),
      })
      .where(eq(slips.id, slipId));

    if (!verificationResult.success) {
      // Update slip status to rejected
      await db
        .update(slips)
        .set({
          status: 'rejected',
          errorMessage: verificationResult.message,
        })
        .where(eq(slips.id, slipId));

      // Update order status to failed
      if (slip.orderId) {
        await db
          .update(orders)
          .set({
            status: 'failed',
            updatedAt: new Date(),
          })
          .where(eq(orders.id, slip.orderId));
      }

      return NextResponse.json({
        success: false,
        error: verificationResult.message || ERROR_MESSAGES.INVALID_SLIP,
      }, { status: 400 });
    }

    // Check for duplicate
    if (verificationResult.duplicate) {
      // Update slip status to duplicate
      await db
        .update(slips)
        .set({
          status: 'duplicate',
          errorMessage: ERROR_MESSAGES.DUPLICATE_SLIP,
        })
        .where(eq(slips.id, slipId));

      // Update order status to failed
      if (slip.orderId) {
        await db
          .update(orders)
          .set({
            status: 'failed',
            updatedAt: new Date(),
          })
          .where(eq(orders.id, slip.orderId));
      }

      return NextResponse.json({
        success: false,
        error: ERROR_MESSAGES.DUPLICATE_SLIP,
      }, { status: 400 });
    }

    if (!verificationResult.data) {
      return NextResponse.json({
        success: false,
        error: 'ไม่สามารถอ่านข้อมูลจากสลิปได้',
      }, { status: 400 });
    }

    // Get bank settings from admin_settings
    const bankSettings = await getBankSettings();
    if (!bankSettings) {
      return NextResponse.json({
        success: false,
        error: 'ไม่พบการตั้งค่าข้อมูลธนาคาร กรุณาติดต่อแอดมิน',
      }, { status: 500 });
    }

    // Validate slip details
    const slipValidation = easySlipAPI.processSlipResult(
      verificationResult,
      parseFloat(slip.order.amount),
      bankSettings.bankName || 'ไม่ระบุ',
      bankSettings.accountName || 'ไม่ระบุ'
    );

    if (!slipValidation.valid) {
      // Update slip status to rejected
      await db
        .update(slips)
        .set({
          status: 'rejected',
          errorMessage: slipValidation.errors.join(', '),
        })
        .where(eq(slips.id, slipId));

      // Update order status to failed
      if (slip.orderId) {
        await db
          .update(orders)
          .set({
            status: 'failed',
            updatedAt: new Date(),
          })
          .where(eq(orders.id, slip.orderId));
      }

      return NextResponse.json({
        success: false,
        error: slipValidation.errors.join(', '),
      }, { status: 400 });
    }

    // Begin transaction for points and status updates
    try {
      // Get current user points
      const [currentUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, authenticatedUser.id))
        .limit(1);

      if (!currentUser) {
        throw new Error('ไม่พบข้อมูลผู้ใช้');
      }

      const currentPoints = parseFloat(currentUser.points || '0');
      const pointsToAdd = parseFloat(slip.order.pointsEarned || '0');
      const newPoints = currentPoints + pointsToAdd;

      // Update user points
      await db
        .update(users)
        .set({
          points: newPoints.toString(),
          updatedAt: new Date(),
        })
        .where(eq(users.id, authenticatedUser.id));

      // Update slip status to verified
      await db
        .update(slips)
        .set({
          status: 'verified',
        })
        .where(eq(slips.id, slipId));

      // Update order status to completed
      if (slip.orderId) {
        await db
          .update(orders)
          .set({
            status: 'completed',
            updatedAt: new Date(),
          })
          .where(eq(orders.id, slip.orderId));
      }

      // Create transaction record
      const transactionId = uuidv4();
      await db
        .insert(transactions)
        .values({
          id: transactionId,
          userId: authenticatedUser.id,
          type: 'topup',
          amount: pointsToAdd.toString(),
          pointsBefore: currentPoints.toString(),
          pointsAfter: newPoints.toString(),
          referenceId: slip.orderId || slipId,
          description: `เติมพ้อยจากคำสั่งซื้อ ${slip.orderId || slipId}`,
          createdAt: new Date(),
        });

      const response: ApiResponse = {
        success: true,
        data: {
          slipId,
          orderId: slip.orderId,
          pointsAdded: pointsToAdd,
          newPointsBalance: newPoints,
          transactionId: slipValidation.transactionId,
        },
        message: `${SUCCESS_MESSAGES.TOPUP_SUCCESS} เติม ${pointsToAdd} พ้อย`,
      };

      return NextResponse.json(response);

    } catch (transactionError) {
      console.error('Transaction error:', transactionError);
      
      // Rollback: update slip status to pending for retry
      await db
        .update(slips)
        .set({
          status: 'pending',
          errorMessage: 'เกิดข้อผิดพลาดในการเติมพ้อย',
        })
        .where(eq(slips.id, slipId));

      return NextResponse.json({
        success: false,
        error: 'เกิดข้อผิดพลาดในการเติมพ้อย กรุณาติดต่อผู้ดูแลระบบ',
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Verify slip error:', error);
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
} 