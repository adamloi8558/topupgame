import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { games } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ERROR_MESSAGES } from '@/lib/constants';
import { ApiResponse, Game } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    // Build query conditionally
    const gamesList = activeOnly 
      ? await db.select().from(games).where(eq(games.isActive, true)).orderBy(games.name)
      : await db.select().from(games).orderBy(games.name);

    const response: ApiResponse<Game[]> = {
      success: true,
      data: gamesList,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Get games error:', error);
    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
} 