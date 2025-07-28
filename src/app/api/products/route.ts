import { NextRequest, NextResponse } from 'next/server';
import { ProductWithGame } from '@/types';

// Mock data for products - only Valorant and ROV
const MOCK_PRODUCTS: ProductWithGame[] = [
  // Valorant Products
  {
    id: 'val-1',
    title: 'Valorant Immortal Account - Premium Skins',
    description: 'บัญชี Valorant แรงค์ Immortal มีสกิน Premium และของหายาก',
    price: '3500',
    gameId: 'valorant',
    images: ['https://logoeps.com/wp-content/uploads/2013/03/valorant-vector-logo.png'],
    rank: 'Immortal',
    skinsCount: 15,
    isSold: false,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-26'),
    accountData: {
      username: 'ValPro001',
      password: 'SecurePass123',
      email: 'valpro001@gmail.com',
      additionalInfo: 'มีสกิน Premium และของหายาก',
    },
    game: {
      id: 'valorant',
      name: 'VALORANT',
      slug: 'valorant',
      logoUrl: 'https://logoeps.com/wp-content/uploads/2013/03/valorant-vector-logo.png',
      uidLabel: 'Riot ID',
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
  },
  {
    id: 'val-2',
    title: 'Valorant Platinum Account - Collection',
    description: 'บัญชี Valorant แรงค์ Platinum มีสกินหลากหลาย',
    price: '2800',
    gameId: 'valorant',
    images: ['https://logoeps.com/wp-content/uploads/2013/03/valorant-vector-logo.png'],
    rank: 'Platinum',
    skinsCount: 12,
    isSold: false,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-25'),
    accountData: {
      username: 'PlatinumGamer',
      password: 'GamePass456',
      email: 'platinum@gmail.com',
      additionalInfo: 'สกินหลากหลาย',
    },
    game: {
      id: 'valorant',
      name: 'VALORANT',
      slug: 'valorant',
      logoUrl: 'https://logoeps.com/wp-content/uploads/2013/03/valorant-vector-logo.png',
      uidLabel: 'Riot ID',
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
  },
  {
    id: 'val-3',
    title: 'Valorant Gold Account - Good Skins',
    description: 'บัญชี Valorant แรงค์ Gold มีสกินดีๆ',
    price: '1800',
    gameId: 'valorant',
    images: ['https://logoeps.com/wp-content/uploads/2013/03/valorant-vector-logo.png'],
    rank: 'Gold',
    skinsCount: 8,
    isSold: false,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-26'),
    accountData: {
      username: 'GoldPlayer',
      password: 'GoldPass789',
      email: 'goldplayer@gmail.com',
      additionalInfo: 'สกินดีๆ',
    },
    game: {
      id: 'valorant',
      name: 'VALORANT',
      slug: 'valorant',
      logoUrl: 'https://logoeps.com/wp-content/uploads/2013/03/valorant-vector-logo.png',
      uidLabel: 'Riot ID',
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
  },
  {
    id: 'val-4',
    title: 'Valorant Bronze Account - Starter Pack',
    description: 'บัญชี Valorant แรงค์ Bronze เหมาะสำหรับเริ่มต้น',
    price: '1200',
    gameId: 'valorant',
    images: ['https://logoeps.com/wp-content/uploads/2013/03/valorant-vector-logo.png'],
    rank: 'Bronze',
    skinsCount: 5,
    isSold: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-24'),
    accountData: {
      username: 'BronzeStarter',
      password: 'BronzePass123',
      email: 'bronze@gmail.com',
      additionalInfo: 'เหมาะสำหรับเริ่มต้น',
    },
    game: {
      id: 'valorant',
      name: 'VALORANT',
      slug: 'valorant',
      logoUrl: 'https://logoeps.com/wp-content/uploads/2013/03/valorant-vector-logo.png',
      uidLabel: 'Riot ID',
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
  },

  // ROV Products
  {
    id: 'rov-1',
    title: 'RoV Conqueror Account - Ultimate Collection',
    description: 'บัญชี RoV แรงค์ Conqueror มีสกินและฮีโร่ครบทุกตัว',
    price: '4200',
    gameId: 'rov',
    images: ['https://bacidea.com/wp-content/uploads/2019/07/RoV-New-Era-9_Logo.jpg'],
    rank: 'Conqueror',
    skinsCount: 50,
    isSold: false,
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-26'),
    accountData: {
      username: 'ConquerorKing',
      password: 'ConquerorPass789',
      email: 'conqueror@gmail.com',
      additionalInfo: 'สกินและฮีโร่ครบทุกตัว',
    },
    game: {
      id: 'rov',
      name: 'RoV',
      slug: 'rov',
      logoUrl: 'https://bacidea.com/wp-content/uploads/2019/07/RoV-New-Era-9_Logo.jpg',
      uidLabel: 'Player ID',
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
  },
  {
    id: 'rov-2',
    title: 'RoV Diamond Account - Premium Skins',
    description: 'บัญชี RoV แรงค์ Diamond มีสกิน Premium และฮีโร่หายาก',
    price: '2800',
    gameId: 'rov',
    images: ['https://bacidea.com/wp-content/uploads/2019/07/RoV-New-Era-9_Logo.jpg'],
    rank: 'Diamond',
    skinsCount: 25,
    isSold: false,
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-26'),
    accountData: {
      username: 'DiamondHero',
      password: 'DiamondPass123',
      email: 'diamond@gmail.com',
      additionalInfo: 'สกิน Premium และฮีโร่หายาก',
    },
    game: {
      id: 'rov',
      name: 'RoV',
      slug: 'rov',
      logoUrl: 'https://bacidea.com/wp-content/uploads/2019/07/RoV-New-Era-9_Logo.jpg',
      uidLabel: 'Player ID',
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
  },
  {
    id: 'rov-3',
    title: 'RoV Gold Account - Good Collection',
    description: 'บัญชี RoV แรงค์ Gold มีสกินดีๆ และฮีโร่หลากหลาย',
    price: '1800',
    gameId: 'rov',
    images: ['https://bacidea.com/wp-content/uploads/2019/07/RoV-New-Era-9_Logo.jpg'],
    rank: 'Gold',
    skinsCount: 15,
    isSold: false,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-24'),
    accountData: {
      username: 'GoldWarrior',
      password: 'GoldPass456',
      email: 'goldwarrior@gmail.com',
      additionalInfo: 'สกินดีๆ และฮีโร่หลากหลาย',
    },
    game: {
      id: 'rov',
      name: 'RoV',
      slug: 'rov',
      logoUrl: 'https://bacidea.com/wp-content/uploads/2019/07/RoV-New-Era-9_Logo.jpg',
      uidLabel: 'Player ID',
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
  },
  {
    id: 'rov-4',
    title: 'RoV Silver Account - Starter Pack',
    description: 'บัญชี RoV แรงค์ Silver เหมาะสำหรับเริ่มต้น',
    price: '1200',
    gameId: 'rov',
    images: ['https://bacidea.com/wp-content/uploads/2019/07/RoV-New-Era-9_Logo.jpg'],
    rank: 'Silver',
    skinsCount: 8,
    isSold: false,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-23'),
    accountData: {
      username: 'SilverPlayer',
      password: 'SilverPass123',
      email: 'silver@gmail.com',
      additionalInfo: 'เหมาะสำหรับเริ่มต้น',
    },
    game: {
      id: 'rov',
      name: 'RoV',
      slug: 'rov',
      logoUrl: 'https://bacidea.com/wp-content/uploads/2019/07/RoV-New-Era-9_Logo.jpg',
      uidLabel: 'Player ID',
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
  },
];

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

    let filteredProducts = [...MOCK_PRODUCTS];

    // Apply filters
    if (gameId && gameId !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.gameId === gameId);
    }

    if (search) {
      filteredProducts = filteredProducts.filter(product =>
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (rank && rank !== 'all') {
      filteredProducts = filteredProducts.filter(product =>
        product.rank?.toLowerCase().includes(rank.toLowerCase())
      );
    }

    if (minPrice) {
      filteredProducts = filteredProducts.filter(product =>
        parseFloat(product.price) >= parseFloat(minPrice)
      );
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter(product =>
        parseFloat(product.price) <= parseFloat(maxPrice)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'name':
        filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
      default:
        filteredProducts.sort((a, b) => {
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bDate - aDate;
        });
        break;
    }

    // Apply pagination
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const products = filteredProducts.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        products,
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