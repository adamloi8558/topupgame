import { NextRequest, NextResponse } from 'next/server';
import { ProductWithGame } from '@/types';

// Mock data for products - only Valorant and ROV
const MOCK_PRODUCTS: ProductWithGame[] = [
  // Valorant Products
  {
    id: 'val-1',
    title: '[บัญชีมือ 1] 16 สกิน 2 FULL SET',
    description: 'เปลี่ยนเมล/เปลี่ยนรหัสได้ มีประกันคืนเงินเต็มจำนวน',
    price: '1990',
    gameId: 'valorant',
    images: ['https://s.imgz.io/2025/08/08/vol-199038263e8ee5b0e0f7.jpg'],
    rank: 'Sliver',
    skinsCount: 16,
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
      logoUrl: 'https://s.imgz.io/2025/08/08/vol-199038263e8ee5b0e0f7.jpg',
      uidLabel: 'Riot ID',
      isActive: true,
      createdAt: new Date('2024-08-08'),
    },
  },
  {
    id: 'val-2',
    title: '[บัญชีมือ 1] 32 สกิน 4 FULL SET',
    description: 'เปลี่ยนเมล/เปลี่ยนรหัสได้ มีประกันคืนเงินเต็มจำนวน',
    price: '3190',
    gameId: 'valorant',
    images: ['https://s.imgz.io/2025/08/08/vol-3190899f8ade5a8970d9.jpg'],
    rank: 'Bronze',
    skinsCount: 32,
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
      logoUrl: 'https://s.imgz.io/2025/08/08/vol-3190899f8ade5a8970d9.jpg',
      uidLabel: 'Riot ID',
      isActive: true,
      createdAt: new Date('2024-08-08'),
    },
  },
  {
    id: 'val-3',
    title: '[บัญชีมือ 1] 21 สกิน 3 FULL SET',
    description: 'เปลี่ยนเมล/เปลี่ยนรหัสได้ มีประกันคืนเงินเต็มจำนวน',
    price: '2590',
    gameId: 'valorant',
    images: ['https://s.imgz.io/2025/08/08/vol-25904d76098a576aef1f.jpg'],
    rank: 'Platinum',
    skinsCount: 21,
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
      logoUrl: 'https://s.imgz.io/2025/08/08/vol-25904d76098a576aef1f.jpg',
      uidLabel: 'Riot ID',
      isActive: true,
      createdAt: new Date('2024-08-08'),
    },
  },
  {
    id: 'val-4',
    title: '[บัญชีมือ 1] 41 สกิน 3 FULL SET',
    description: 'เปลี่ยนเมล/เปลี่ยนรหัสได้ มีประกันคืนเงินเต็มจำนวน',
    price: '3150',
    gameId: 'valorant',
    images: ['https://s.imgz.io/2025/08/08/vol-3150fe0c10fc220232ff.jpg'],
    rank: 'Sliver',
    skinsCount: 41,
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
      logoUrl: 'https://s.imgz.io/2025/08/08/vol-3150fe0c10fc220232ff.jpg',
      uidLabel: 'Riot ID',
      isActive: true,
      createdAt: new Date('2024-08-08'),
    },
  },
  {
    id: 'val-5',
    title: '[บัญชีมือ 1] 14 สกิน 1 FULL SET',
    description: 'เปลี่ยนเมล/เปลี่ยนรหัสได้ มีประกันคืนเงินเต็มจำนวน',
    price: '1090',
    gameId: 'valorant',
    images: ['https://s.imgz.io/2025/08/08/vol-199038263e8ee5b0e0f7.jpg'],
    rank: 'Sliver',
    skinsCount: 14,
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
      logoUrl: 'https://s.imgz.io/2025/08/08/vol-199038263e8ee5b0e0f7.jpg',
      uidLabel: 'Riot ID',
      isActive: true,
      createdAt: new Date('2024-08-08'),
    },
  },
  {
    id: 'val-6',
    title: '[บัญชีมือ 1] 17 สกิน 2 FULL SET',
    description: 'เปลี่ยนเมล/เปลี่ยนรหัสได้ มีประกันคืนเงินเต็มจำนวน',
    price: '990',
    gameId: 'valorant',
    images: ['https://s.imgz.io/2025/08/08/vol-9903f8ea33a8adeb712.jpg'],
    rank: 'Sliver',
    skinsCount: 17,
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
      logoUrl: 'https://s.imgz.io/2025/08/08/vol-9903f8ea33a8adeb712.jpg',
      uidLabel: 'Riot ID',
      isActive: true,
      createdAt: new Date('2024-08-08'),
    },
  },
  {
    id: 'val-7',
    title: '[บัญชีมือ 1] 16 สกิน 1 FULL SET',
    description: 'เปลี่ยนเมล/เปลี่ยนรหัสได้ มีประกันคืนเงินเต็มจำนวน',
    price: '950',
    gameId: 'valorant',
    images: ['https://s.imgz.io/2025/08/08/vol-95046dab04d39a03a14.jpg'],
    rank: 'Gold',
    skinsCount: 16,
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
      logoUrl: 'https://s.imgz.io/2025/08/08/vol-95046dab04d39a03a14.jpg',
      uidLabel: 'Riot ID',
      isActive: true,
      createdAt: new Date('2024-08-08'),
    },
  },

  // Freefire Products
  {
    id: 'freefire-1',
    title: '[DM-5371] รหัสมือ 1 เปลี่ยนได้ทุกอย่าง',
    description: 'รหัสไม่เคยโดนแบน ไอดีสะอาด มือ 1 ไม่ผูกเบอร์',
    price: '2100',
    gameId: 'freefire',
    images: ['https://s.imgz.io/2025/08/08/150018878e2a2d928d76.jpg'],
    rank: '',
    skinsCount: 154,
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
      id: 'freefire',
      name: 'Free Fire',
      slug: 'freefire',
      logoUrl: 'https://s.imgz.io/2025/08/08/150018878e2a2d928d76.jpg',
      uidLabel: 'Player ID',
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
  },
  {
    id: 'freefire-2',
    title: '[DM-8043] รหัสมือ 1 เปลี่ยนได้ทุกอย่าง',
    description: 'รหัสไม่เคยโดนแบน ไอดีสะอาด มือ 1 ไม่ผูกเบอร์',
    price: '3900',
    gameId: 'freefire',
    skinsCount: 242,
    images: ['https://s.imgz.io/2025/08/08/1600ddd0b3433dbac660.jpg'],
    rank: '',
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
      id: 'freefire',
      name: 'Free Fire',
      slug: 'freefire',
      logoUrl: 'https://s.imgz.io/2025/08/08/1600ddd0b3433dbac660.jpg',
      uidLabel: 'Player ID',
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
  },
  {
    id: 'freefire-3',
    title: '[DM-9217] รหัสมือ 1 เปลี่ยนได้ทุกอย่าง',
    description: 'รหัสไม่เคยโดนแบน ไอดีสะอาด มือ 1 ไม่ผูกเบอร์',
    price: '3300',
    gameId: 'freefire',
    skinsCount: 119,
    images: ['https://s.imgz.io/2025/08/08/17003a52c832b6f28d25.jpg'],
    rank: '',
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
      id: 'freefire',
      name: 'Free Fire',
      slug: 'freefire',
      logoUrl: 'https://s.imgz.io/2025/08/08/17003a52c832b6f28d25.jpg',
      uidLabel: 'Player ID',
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
  },
  {
    id: 'freefire-4',
    title: '[DM-6829] รหัสมือ 1 เปลี่ยนได้ทุกอย่าง',
    description: 'รหัสไม่เคยโดนแบน ไอดีสะอาด มือ 1 ไม่ผูกเบอร์',
    price: '2700',
    gameId: 'freefire',
    skinsCount: 201,
    images: ['https://s.imgz.io/2025/08/08/2200b268011af72c9d22.jpg'],
    rank: '',
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
      id: 'freefire',
      name: 'Free Fire',
      slug: 'freefire',
      logoUrl: 'https://s.imgz.io/2025/08/08/2200b268011af72c9d22.jpg',
      uidLabel: 'Player ID',
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
  },
  {
    id: 'freefire-5',
    title: '[DM-1104] รหัสมือ 1 เปลี่ยนได้ทุกอย่าง',
    description: 'รหัสไม่เคยโดนแบน ไอดีสะอาด มือ 1 ไม่ผูกเบอร์',
    price: '4800',
    gameId: 'freefire',
    skinsCount: 292,
    images: ['https://s.imgz.io/2025/08/08/23002964d4f4973c0419.jpg'],
    rank: '',
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
      id: 'freefire',
      name: 'Free Fire',
      slug: 'freefire',
      logoUrl: 'https://s.imgz.io/2025/08/08/23002964d4f4973c0419.jpg',
      uidLabel: 'Player ID',
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
  },
  {
    id: 'freefire-6',
    title: '[DM-7326] รหัสมือ 1 เปลี่ยนได้ทุกอย่าง',
    description: 'รหัสไม่เคยโดนแบน ไอดีสะอาด มือ 1 ไม่ผูกเบอร์',
    price: '4500',
    gameId: 'freefire',
    skinsCount: 205,
    images: ['https://s.imgz.io/2025/08/08/2600412575aa136b5200.jpg'],
    rank: '',
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
      id: 'freefire',
      name: 'Free Fire',
      slug: 'freefire',
      logoUrl: 'https://s.imgz.io/2025/08/08/2600412575aa136b5200.jpg',
      uidLabel: 'Player ID',
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
  },
  {
    id: 'freefire-7',
    title: '[DM-8410] รหัสมือ 1 เปลี่ยนได้ทุกอย่าง',
    description: 'รหัสไม่เคยโดนแบน ไอดีสะอาด มือ 1 ไม่ผูกเบอร์',
    price: '3000',
    gameId: 'freefire',
    skinsCount: 143,
    images: ['https://s.imgz.io/2025/08/08/2600z9e30813ade66eda6.jpg'],
    rank: '',
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
      id: 'freefire',
      name: 'Free Fire',
      slug: 'freefire',
      logoUrl: 'https://s.imgz.io/2025/08/08/2600z9e30813ade66eda6.jpg',
      uidLabel: 'Player ID',
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
  },
  {
    id: 'freefire-8',
    title: '[DM-2903] รหัสมือ 1 เปลี่ยนได้ทุกอย่าง',
    description: 'รหัสไม่เคยโดนแบน ไอดีสะอาด มือ 1 ไม่ผูกเบอร์',
    price: '1500',
    gameId: 'freefire',
    skinsCount: 165,
    images: ['https://s.imgz.io/2025/08/08/3700f6b71d483ed0a160.jpg'],
    rank: '',
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
      id: 'freefire',
      name: 'Free Fire',
      slug: 'freefire',
      logoUrl: 'https://s.imgz.io/2025/08/08/3700f6b71d483ed0a160.jpg',
      uidLabel: 'Player ID',
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
  },
  {
    id: 'freefire-9',
    title: '[DM-5112] รหัสมือ 1 เปลี่ยนได้ทุกอย่าง',
    description: 'รหัสไม่เคยโดนแบน ไอดีสะอาด มือ 1 ไม่ผูกเบอร์',
    price: '3900',
    gameId: 'freefire',
    skinsCount: 298,
    images: ['https://s.imgz.io/2025/08/08/38006f5d4f764f3dafc7.jpg'],
    rank: '',
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
      id: 'freefire',
      name: 'Free Fire',
      slug: 'freefire',
      logoUrl: 'https://s.imgz.io/2025/08/08/38006f5d4f764f3dafc7.jpg',
      uidLabel: 'Player ID',
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
  },
  {
    id: 'freefire-10',
    title: '[DM-9377] รหัสมือ 1 เปลี่ยนได้ทุกอย่าง',
    description: 'รหัสไม่เคยโดนแบน ไอดีสะอาด มือ 1 ไม่ผูกเบอร์',
    price: '2400',
    gameId: 'freefire',
    skinsCount: 214,
    images: ['https://s.imgz.io/2025/08/08/5500c7e404fbecb489c0.jpg'],
    rank: '',
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
      id: 'freefire',
      name: 'Free Fire',
      slug: 'freefire',
      logoUrl: 'https://s.imgz.io/2025/08/08/5500c7e404fbecb489c0.jpg',
      uidLabel: 'Player ID',
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
  },
  {
    id: 'freefire-11',
    title: '[DM-6684] รหัสมือ 1 เปลี่ยนได้ทุกอย่าง',
    description: 'รหัสไม่เคยโดนแบน ไอดีสะอาด มือ 1 ไม่ผูกเบอร์',
    price: '4500',
    gameId: 'freefire',
    skinsCount: 172,
    images: ['https://s.imgz.io/2025/08/08/60007e29aec35348f228.jpg'],
    rank: '',
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
      id: 'freefire',
      name: 'Free Fire',
      slug: 'freefire',
      logoUrl: 'https://s.imgz.io/2025/08/08/60007e29aec35348f228.jpg',
      uidLabel: 'Player ID',
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
  },
  {
    id: 'freefire-12',
    title: '[DM-1240] รหัสมือ 1 เปลี่ยนได้ทุกอย่าง',
    description: 'รหัสไม่เคยโดนแบน ไอดีสะอาด มือ 1 ไม่ผูกเบอร์',
    price: '1800',
    gameId: 'freefire',
    skinsCount: 104,
    images: ['https://s.imgz.io/2025/08/08/7000494491a59d7d9b7b.jpg'],
    rank: '',
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
      id: 'freefire',
      name: 'Free Fire',
      slug: 'freefire',
      logoUrl: 'https://s.imgz.io/2025/08/08/7000494491a59d7d9b7b.jpg',
      uidLabel: 'Player ID',
      isActive: true,
      createdAt: new Date('2024-01-01'),
    },
  },
  {
    id: 'freefire-13',
    title: '[DM-5598] รหัสมือ 1 เปลี่ยนได้ทุกอย่าง',
    description: 'รหัสไม่เคยโดนแบน ไอดีสะอาด มือ 1 ไม่ผูกเบอร์',
    price: '3600',
    gameId: 'freefire',
    skinsCount: 198,
    images: ['https://s.imgz.io/2025/08/08/95000a5c495e1f50b0fcf.jpg'],
    rank: '',
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
      id: 'freefire',
      name: 'Free Fire',
      slug: 'freefire',
      logoUrl: 'https://s.imgz.io/2025/08/08/95000a5c495e1f50b0fcf.jpg',
      uidLabel: 'Player ID',
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
    images: ['https://s.imgz.io/2025/08/08/ff-5905329d859d6449b1b.jpg'],
    rank: '',
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
      logoUrl: 'https://s.imgz.io/2025/08/08/ff-5905329d859d6449b1b.jpg',
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
    images: ['https://s.imgz.io/2025/08/08/ff-5905329d859d6449b1b.jpg'],
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
      logoUrl: 'https://s.imgz.io/2025/08/08/ff-5905329d859d6449b1b.jpg',
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
    images: ['https://s.imgz.io/2025/08/08/ff-5905329d859d6449b1b.jpg'],
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
      logoUrl: 'https://s.imgz.io/2025/08/08/ff-5905329d859d6449b1b.jpg',
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
    images: ['https://s.imgz.io/2025/08/08/ff-5905329d859d6449b1b.jpg'],
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
      logoUrl: 'https://s.imgz.io/2025/08/08/ff-5905329d859d6449b1b.jpg',
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
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        products: paginatedProducts,
        count: total,
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
      {
        success: false,
        error: 'ไม่สามารถโหลดข้อมูลสินค้าได้',
        data: {
          products: [],
          count: 0,
          pagination: {
            page: 1,
            limit: 12,
            total: 0,
            totalPages: 0,
          },
        },
      },
      { status: 500 }
    );
  }
} 