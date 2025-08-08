import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, signToken, createAuthCookie, checkRateLimit } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, RATE_LIMITS } from '@/lib/constants';
import { AuthUser, ApiResponse } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`register:${clientIp}`, RATE_LIMITS.REGISTER.maxRequests, RATE_LIMITS.REGISTER.windowMs)) {
      return NextResponse.json(
        { success: false, error: 'คำขอสมัครสมาชิกเกินกำหนด กรุณารอสักครู่' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.VALIDATION_ERROR, details: validation.error.errors },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'อีเมลนี้ถูกใช้งานแล้ว' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create new user
    const userId = uuidv4();
    const [newUser] = await db
      .insert(users)
      .values({
        id: userId,
        email: email.toLowerCase(),
        name,
        passwordHash,
        points: '0.00',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Create auth user object
    const authUser: AuthUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      points: newUser.points || '0.00',
      role: newUser.role || 'user',
    };

    // Sign JWT token
    const token = await signToken(authUser);

    // Create response with auth cookie
    const response: ApiResponse<AuthUser> = {
      success: true,
      data: authUser,
      message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
    };

    const nextResponse = NextResponse.json(response);
    nextResponse.headers.set('Set-Cookie', createAuthCookie(token));

    return nextResponse;

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
} 