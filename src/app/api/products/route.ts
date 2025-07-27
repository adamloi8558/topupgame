import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, games } from '@/lib/db/schema';
import { eq, and, gte, lte, like, desc, asc } from 'drizzle-orm';
import { ERROR_MESSAGES, PAGINATION } from '@/lib/constants';
import { ApiResponse, PaginatedResponse, ProductWithGame } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const gameId = searchParams.get('gameId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const rank = searchParams.get('rank');
    const available = searchParams.get('available');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || PAGINATION.DEFAULT_PAGE.toString());
    const limit = Math.min(
      parseInt(searchParams.get('limit') || PAGINATION.DEFAULT_LIMIT.toString()),
      PAGINATION.MAX_LIMIT
    );
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where conditions
    const conditions = [];

    if (gameId) {
      conditions.push(eq(products.gameId, gameId));
    }

    if (minPrice) {
      conditions.push(gte(products.price, minPrice));
    }

    if (maxPrice) {
      conditions.push(lte(products.price, maxPrice));
    }

    if (rank) {
      conditions.push(eq(products.rank, rank));
    }

    if (available === 'true') {
      conditions.push(eq(products.isSold, false));
    }

    if (search) {
      conditions.push(like(products.title, `%${search}%`));
    }

    // Build order by
    const orderByColumn = sortBy === 'price' ? products.price :
                         sortBy === 'createdAt' ? products.createdAt :
                         products.title;
    
    const orderBy = sortOrder === 'asc' ? asc(orderByColumn) : desc(orderByColumn);

    // Count total products with conditional where
    const total = conditions.length > 0 
      ? await db
          .select({ count: products.id })
          .from(products)
          .where(and(...conditions))
          .then(([result]) => Number(result.count))
      : await db
          .select({ count: products.id })
          .from(products)
          .then(([result]) => Number(result.count));

    // Fetch products with pagination and conditional where
    const baseQuery = db
      .select({
        id: products.id,
        gameId: products.gameId,
        title: products.title,
        description: products.description,
        rank: products.rank,
        skinsCount: products.skinsCount,
        price: products.price,
        images: products.images,
        accountData: products.accountData,
        isSold: products.isSold,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
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
      .from(products)
      .leftJoin(games, eq(products.gameId, games.id))
      .orderBy(orderBy)
      .limit(limit)
      .offset((page - 1) * limit);

    const productsList = conditions.length > 0 
      ? await baseQuery.where(and(...conditions))
      : await baseQuery;

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);

    const response: ApiResponse<PaginatedResponse<ProductWithGame>> = {
      success: true,
      data: {
        data: productsList.map(product => ({
          ...product,
          // Remove sensitive account data from public API
          accountData: null,
          // Convert null to undefined for optional properties
          game: product.game?.id ? product.game : undefined,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { success: false, error: ERROR_MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
} 