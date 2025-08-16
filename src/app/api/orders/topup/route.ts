import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { validateAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // ตรวจสอบ JWT token
    const authResult = await validateAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }
    
    const userId = authResult.userId;

    // รับข้อมูลจาก request body
    const { amount, type } = await request.json();

    // ตรวจสอบข้อมูล
    if (!amount || typeof amount !== 'number' || amount < 100 || amount > 50000) {
      return NextResponse.json(
        { success: false, error: 'จำนวนเงินต้องอยู่ระหว่าง 100-50,000 บาท' },
        { status: 400 }
      );
    }

    if (type !== 'wallet_topup') {
      return NextResponse.json(
        { success: false, error: 'ประเภทคำสั่งซื้อไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    // สร้าง order ใหม่
    const orderId = crypto.randomUUID();
    const [newOrder] = await db.insert(orders).values({
      id: orderId,
      userId: userId!,
      type: 'topup',
      status: 'pending',
      amount: amount.toString(),
      pointsEarned: amount.toString(), // 1:1 ratio
    }).returning({ id: orders.id });

    return NextResponse.json({
      success: true,
      message: 'สร้างคำสั่งซื้อสำเร็จ',
      orderId: newOrder.id,
    });

  } catch (error) {
    console.error('Error creating topup order:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในระบบ' },
      { status: 500 }
    );
  }
}