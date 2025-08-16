import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, games } from '@/lib/db/schema';
import { and, desc, eq, ilike, asc, sql, gte, lte, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const gameId = searchParams.get('gameId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const rank = searchParams.get('rank');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const sortOrder = (searchParams.get('sortOrder') || 'desc').toLowerCase();

    const whereClauses: any[] = [];

    if (gameId && gameId !== 'all') {
      whereClauses.push(eq(products.gameId, gameId));
    }

    if (search) {
      const q = `%${search}%`;
      whereClauses.push(
        or(
          ilike(products.title, q),
          ilike(products.description, q)
        )
      );
    }

    if (rank && rank !== 'all') {
      const q = `%${rank}%`;
      whereClauses.push(ilike(products.rank, q));
    }

    if (minPrice) {
      whereClauses.push(gte(products.price, sql`${minPrice}`));
    }

    if (maxPrice) {
      whereClauses.push(lte(products.price, sql`${maxPrice}`));
    }

    // Available products only when requested
    const available = searchParams.get('available');
    if (available && available === 'true') {
      whereClauses.push(eq(products.isSold, false));
    }

    const whereExpr = whereClauses.length ? and(...whereClauses) : undefined;

    // Count total
    const totalResult = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(products)
      .where(whereExpr as any);
    const total = totalResult[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;

    // Sorting
    let orderBy;
    switch (sortBy) {
      case 'price-low':
        orderBy = asc(products.price);
        break;
      case 'price-high':
        orderBy = desc(products.price);
        break;
      case 'name':
        orderBy = sortOrder === 'asc' ? asc(products.title) : desc(products.title);
        break;
      case 'newest':
      default:
        orderBy = desc(products.createdAt);
        break;
    }

    const rows = await db
      .select({
        id: products.id,
        title: products.title,
        description: products.description,
        rank: products.rank,
        skinsCount: products.skinsCount,
        price: products.price,
        images: products.images,
        isSold: products.isSold,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        gameId: products.gameId,
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
      .where(whereExpr as any)
      .orderBy(orderBy as any)
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      success: true,
      data: {
        products: rows,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { success: false, error: 'ไม่สามารถโหลดข้อมูลสินค้าได้' },
      { status: 500 }
    );
  }
} 