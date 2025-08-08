import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, games } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getAuthUser, requireAuth } from '@/lib/auth';
import { topupOrderSchema } from '@/lib/validations';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';
import { ApiResponse, OrderWithDetails } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthUser(request);
    const authenticatedUser = requireAuth(user);

    // Parse request body
    const body = await request.json();

    // Validate input
    const validation = topupOrderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.VALIDATION_ERROR, details: validation.error.errors },
        { status: 400 }
      );
    }

    const { gameId, gameUid, amount } = validation.data;

    // Verify game exists and is active
    const [game] = await db
      .select()
      .from(games)
      .where(eq(games.id, gameId))
      .limit(1);

    if (!game) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบเกมที่เลือก' },
        { status: 404 }
      );
    }

    if (!game.isActive) {
      return NextResponse.json(
        { success: false, error: 'เกมนี้ไม่เปิดให้บริการในขณะนี้' },
        { status: 400 }
      );
    }

    // Create new top-up order
    const orderId = uuidv4();
    const [newOrder] = await db
      .insert(orders)
      .values({
        id: orderId,
        userId: authenticatedUser.id,
        type: 'topup',
        status: 'pending',
        amount: amount.toString(),
        pointsEarned: amount.toString(), // 1:1 ratio
        gameUid,
        gameId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Get the order with game details
    const [orderWithDetails] = await db
      .select({
        id: orders.id,
        userId: orders.userId,
        type: orders.type,
        status: orders.status,
        amount: orders.amount,
        pointsEarned: orders.pointsEarned,
        gameUid: orders.gameUid,
        gameId: orders.gameId,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        game: {
          id: games.id,
          name: games.name,
          slug: games.slug,
          logoUrl: games.logoUrl,
          uidLabel: games.uidLabel,
          isActive: games.isActive,
          createdAt: games.createdAt,
        },
      })
      .from(orders)
      .leftJoin(games, eq(orders.gameId, games.id))
      .where(eq(orders.id, orderId))
      .limit(1);

    // Convert null to undefined for optional properties  
    const orderData: OrderWithDetails = {
      ...orderWithDetails,
      game: orderWithDetails.game?.id ? orderWithDetails.game : undefined,
    };

    const response: ApiResponse<OrderWithDetails> = {
      success: true,
      data: orderData,
      message: SUCCESS_MESSAGES.ORDER_CREATED,
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Create topup order error:', error);
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
} 