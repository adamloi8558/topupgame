import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { games } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ERROR_MESSAGES } from '@/lib/constants';
import { ApiResponse, Game } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Find game by slug
    const [game] = await db
      .select()
      .from(games)
      .where(eq(games.slug, slug))
      .limit(1);

    if (!game) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.NOT_FOUND },
        { status: 404 }
      );
    }

    const response: ApiResponse<Game> = {
      success: true,
      data: game,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Get game detail error:', error);
    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
} 