import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slips, orders } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getAuthUser, requireAuth, checkRateLimit } from '@/lib/auth';
import { cloudflareR2 } from '@/lib/cloudflare-r2';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, RATE_LIMITS } from '@/lib/constants';
import { ApiResponse } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthUser(request);
    const authenticatedUser = requireAuth(user);

    // Rate limiting
    const userId = authenticatedUser.id;
    if (!checkRateLimit(`upload:${userId}`, RATE_LIMITS.UPLOAD.maxRequests, RATE_LIMITS.UPLOAD.windowMs)) {
      return NextResponse.json(
        { success: false, error: 'การอัปโหลดเกินกำหนด กรุณารอสักครู่' },
        { status: 429 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const orderId = formData.get('orderId') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'กรุณาเลือกไฟล์สลิป' },
        { status: 400 }
      );
    }

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'กรุณาระบุหมายเลขคำสั่งซื้อ' },
        { status: 400 }
      );
    }

    // Verify order exists and belongs to user
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบคำสั่งซื้อ' },
        { status: 404 }
      );
    }

    if (order.userId !== authenticatedUser.id) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.FORBIDDEN },
        { status: 403 }
      );
    }

    if (order.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'คำสั่งซื้อนี้ไม่สามารถอัปโหลดสลิปได้' },
        { status: 400 }
      );
    }

    // Check if slip already exists for this order
    const [existingSlip] = await db
      .select()
      .from(slips)
      .where(eq(slips.orderId, orderId))
      .limit(1);

    if (existingSlip) {
      return NextResponse.json(
        { success: false, error: 'คำสั่งซื้อนี้มีสลิปแล้ว' },
        { status: 400 }
      );
    }

    // Upload file to Cloudflare R2
    const uploadResult = await cloudflareR2.uploadSlip(file, orderId);

    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, error: uploadResult.error || 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์' },
        { status: 500 }
      );
    }

    // Create slip record
    const slipId = uuidv4();
    const [newSlip] = await db
      .insert(slips)
      .values({
        id: slipId,
        orderId,
        fileUrl: uploadResult.url!,
        fileName: file.name,
        status: 'pending',
        uploadedAt: new Date(),
      })
      .returning();

    // Update order status to processing
    await db
      .update(orders)
      .set({
        status: 'processing',
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    const response: ApiResponse = {
      success: true,
      data: {
        slipId: newSlip.id,
        orderId,
        fileUrl: newSlip.fileUrl,
        status: newSlip.status,
      },
      message: SUCCESS_MESSAGES.SLIP_UPLOADED,
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Upload slip error:', error);
    
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

// Handle base64 upload as well
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthUser(request);
    const authenticatedUser = requireAuth(user);

    // Rate limiting
    const userId = authenticatedUser.id;
    if (!checkRateLimit(`upload:${userId}`, RATE_LIMITS.UPLOAD.maxRequests, RATE_LIMITS.UPLOAD.windowMs)) {
      return NextResponse.json(
        { success: false, error: 'การอัปโหลดเกินกำหนด กรุณารอสักครู่' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { base64Data, fileName, orderId } = body;

    if (!base64Data || !fileName || !orderId) {
      return NextResponse.json(
        { success: false, error: 'ข้อมูลไม่ครบถ้วน' },
        { status: 400 }
      );
    }

    // Verify order exists and belongs to user
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบคำสั่งซื้อ' },
        { status: 404 }
      );
    }

    if (order.userId !== authenticatedUser.id) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.FORBIDDEN },
        { status: 403 }
      );
    }

    if (order.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'คำสั่งซื้อนี้ไม่สามารถอัปโหลดสลิปได้' },
        { status: 400 }
      );
    }

    // Upload base64 image to Cloudflare R2
    const uploadResult = await cloudflareR2.uploadBase64Image(
      base64Data,
      fileName,
      `slips/${orderId}`
    );

    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, error: uploadResult.error || 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์' },
        { status: 500 }
      );
    }

    // Create slip record
    const slipId = uuidv4();
    const [newSlip] = await db
      .insert(slips)
      .values({
        id: slipId,
        orderId,
        fileUrl: uploadResult.url!,
        fileName,
        status: 'pending',
        uploadedAt: new Date(),
      })
      .returning();

    // Update order status to processing
    await db
      .update(orders)
      .set({
        status: 'processing',
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    const response: ApiResponse = {
      success: true,
      data: {
        slipId: newSlip.id,
        orderId,
        fileUrl: newSlip.fileUrl,
        status: newSlip.status,
      },
      message: SUCCESS_MESSAGES.SLIP_UPLOADED,
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Upload base64 slip error:', error);
    
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