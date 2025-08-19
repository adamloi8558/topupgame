import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { validateAuth } from '@/lib/auth';
import { logger, handleApiError, ValidationError } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    logger.info('Creating topup order...');

    // ตรวจสอบ JWT token
    const authResult = await validateAuth(request);
    if (!authResult.success) {
      throw new ValidationError(authResult.error || 'Authentication failed');
    }
    
    const userId = authResult.userId!;

    // รับข้อมูลจาก request body
    const body = await request.json();
    const { amount, type } = body;

    // ตรวจสอบข้อมูล
    if (!amount || typeof amount !== 'number' || amount < 100 || amount > 50000) {
      throw new ValidationError('จำนวนเงินต้องอยู่ระหว่าง 100-50,000 บาท');
    }

    if (type !== 'wallet_topup') {
      throw new ValidationError('ประเภทคำสั่งซื้อไม่ถูกต้อง');
    }

    // สร้าง order ใหม่
    const orderId = crypto.randomUUID();
    logger.debug('Creating order', { orderId, userId, amount });
    
    const [newOrder] = await db.insert(orders).values({
      id: orderId,
      userId,
      type: 'topup',
      status: 'pending',
      amount: amount.toString(),
      pointsEarned: amount.toString(), // 1:1 ratio
    }).returning({ id: orders.id });

    logger.info('Topup order created successfully', { orderId: newOrder.id });

    return NextResponse.json({
      success: true,
      message: 'สร้างคำสั่งซื้อสำเร็จ',
      orderId: newOrder.id,
    });

  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}