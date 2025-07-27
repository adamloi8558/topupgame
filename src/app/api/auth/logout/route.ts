import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';
import { SUCCESS_MESSAGES } from '@/lib/constants';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Create response with cleared auth cookie
    const response: ApiResponse = {
      success: true,
      message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
    };

    const nextResponse = NextResponse.json(response);
    nextResponse.headers.set('Set-Cookie', clearAuthCookie());

    return nextResponse;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการออกจากระบบ' },
      { status: 500 }
    );
  }
} 