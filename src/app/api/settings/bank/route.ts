import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminSettings } from '@/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';

export async function GET() {
  try {
    const keys = ['bank_name', 'bank_account_name', 'bank_account_number'] as const;
    const rows = await db.select().from(adminSettings).where(inArray(adminSettings.key, keys as unknown as string[]));
    const map = Object.fromEntries(rows.map(r => [r.key, r.value]));
    return NextResponse.json({
      success: true,
      data: {
        bankName: map['bank_name'] || '',
        accountName: map['bank_account_name'] || '',
        accountNumber: map['bank_account_number'] || '',
      },
    });
  } catch (error) {
    console.error('Fetch bank settings error:', error);
    return NextResponse.json({ success: false, error: 'ไม่สามารถดึงข้อมูลบัญชีได้' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { bankName, accountName, accountNumber } = body as {
      bankName: string;
      accountName: string;
      accountNumber: string;
    };

    if (!bankName || !accountName || !accountNumber) {
      return NextResponse.json({ success: false, error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    const entries = [
      { key: 'bank_name', value: bankName },
      { key: 'bank_account_name', value: accountName },
      { key: 'bank_account_number', value: accountNumber },
    ];

    for (const entry of entries) {
      await db
        .insert(adminSettings)
        .values({ key: entry.key, value: entry.value })
        .onConflictDoUpdate({
          target: adminSettings.key,
          set: { value: entry.value, updatedAt: new Date() },
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update bank settings error:', error);
    return NextResponse.json({ success: false, error: 'อัปเดตข้อมูลไม่สำเร็จ' }, { status: 500 });
  }
}

