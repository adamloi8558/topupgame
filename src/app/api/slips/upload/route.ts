import { NextRequest, NextResponse } from 'next/server';
import { cloudflareR2 } from '@/lib/cloudflare-r2';
import { ERROR_MESSAGES } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
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
        { success: false, error: 'ไม่พบข้อมูลคำสั่งซื้อ' },
        { status: 400 }
      );
    }

    // Upload file to Cloudflare R2
    const uploadResult = await cloudflareR2.uploadFile(file, `slips/${orderId}`, {
      metadata: {
        orderId,
        type: 'payment-slip',
      },
    });

    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, error: uploadResult.error || ERROR_MESSAGES.INVALID_SLIP },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        url: uploadResult.url,
        key: uploadResult.key,
      },
    });

  } catch (error) {
    console.error('Slip upload error:', error);
    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
}

// Handle base64 upload as well
export async function PUT(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { base64Data, fileName, orderId } = body;

    if (!base64Data || !fileName || !orderId) {
      return NextResponse.json(
        { success: false, error: 'ข้อมูลไม่ครบถ้วน' },
        { status: 400 }
      );
    }

    // Convert base64 to File
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json(
        { success: false, error: 'รูปแบบ Base64 ไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    const contentType = matches[1];
    const base64Content = matches[2];
    const buffer = Buffer.from(base64Content, 'base64');
    const file = new File([buffer], fileName, { type: contentType });

    // Upload file to Cloudflare R2
    const uploadResult = await cloudflareR2.uploadFile(file, `slips/${orderId}`, {
      metadata: {
        orderId,
        type: 'payment-slip',
        source: 'base64',
      },
    });

    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, error: uploadResult.error || ERROR_MESSAGES.INVALID_SLIP },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        url: uploadResult.url,
        key: uploadResult.key,
      },
    });

  } catch (error) {
    console.error('Upload base64 slip error:', error);
    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
} 