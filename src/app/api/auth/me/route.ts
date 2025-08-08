import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { ERROR_MESSAGES } from '@/lib/constants';
import { ApiResponse, AuthUser } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    const response: ApiResponse<AuthUser> = {
      success: true,
      data: user,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
} 