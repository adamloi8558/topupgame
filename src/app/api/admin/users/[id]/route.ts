import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getAuthUser, requireAuth } from '@/lib/auth';
import { adminUserUpdateSchema } from '@/lib/validations';
import { ERROR_MESSAGES } from '@/lib/constants';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and admin role
    const user = await getAuthUser(request);
    const authenticatedUser = requireAuth(user);
    
    if (authenticatedUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'ไม่มีสิทธิ์เข้าถึง' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = adminUserUpdateSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'ข้อมูลไม่ถูกต้อง', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { name, email, points, role } = validation.data;

    // Update user
    const [updatedUser] = await db
      .update(users)
      .set({
        name,
        email,
        points: points.toString(),
        role,
      })
      .where(eq(users.id, params.id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        points: users.points,
        role: users.role,
        createdAt: users.createdAt,
      });

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบผู้ใช้' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'อัปเดตข้อมูลผู้ใช้สำเร็จ',
      data: updatedUser,
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
} 