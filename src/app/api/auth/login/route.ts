import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword, signToken, createAuthCookie, checkRateLimit } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, RATE_LIMITS } from '@/lib/constants';
import { AuthUser, ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`login:${clientIp}`, RATE_LIMITS.LOGIN.maxRequests, RATE_LIMITS.LOGIN.windowMs)) {
      return NextResponse.json(
        { success: false, error: 'คำขอเข้าสู่ระบบเกินกำหนด กรุณารอสักครู่' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.VALIDATION_ERROR, details: validation.error.errors },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { success: false, error: 'บัญชีนี้ยังไม่ได้ตั้งรหัสผ่าน' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // Create auth user object
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      points: user.points || '0.00',
      role: user.role || 'user',
    };

    // Sign JWT token
    const token = await signToken(authUser);

    // Create response with auth cookie
    const response: ApiResponse<AuthUser> = {
      success: true,
      data: authUser,
      message: SUCCESS_MESSAGES.LOGIN,
    };

    const nextResponse = NextResponse.json(response);
    nextResponse.headers.set('Set-Cookie', createAuthCookie(token));

    return nextResponse;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
} 