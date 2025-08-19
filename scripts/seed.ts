#!/usr/bin/env tsx

import { db } from '../src/lib/db';
import { 
  users, 
  games, 
  products, 
  adminSettings,
  orders,
  transactions 
} from '../src/lib/db/schema';
import { hashPassword } from '../src/lib/auth';
import * as dotenv from 'dotenv';

// โหลด environment variables
dotenv.config();

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // ลบข้อมูลเดิม (ถ้ามี)
    console.log('🧹 Cleaning existing data...');
    await db.delete(transactions);
    await db.delete(orders);
    await db.delete(products);
    await db.delete(games);
    await db.delete(users);
    await db.delete(adminSettings);

    // สร้าง Admin User
    console.log('👤 Creating admin user...');
    const adminId = crypto.randomUUID();
    await db.insert(users).values({
      id: adminId,
      email: 'admin@dumstore.com',
      passwordHash: await hashPassword('admin123456'),
      name: 'ผู้ดูแลระบบ',
      points: '10000.00',
      role: 'admin',
    });

    // สร้าง Test User
    console.log('👥 Creating test users...');
    const userId = crypto.randomUUID();
    await db.insert(users).values({
      id: userId,
      email: 'user@test.com',
      passwordHash: await hashPassword('user123456'),
      name: 'ผู้ใช้ทดสอบ',
      points: '500.00',
      role: 'user',
    });

    // สร้าง Games
    console.log('🎮 Creating games...');
    const games_data = [
      {
        id: crypto.randomUUID(),
        name: 'Valorant',
        slug: 'valorant',
        logoUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop',
        uidLabel: 'Riot ID',
        isActive: true,
      },
      {
        id: crypto.randomUUID(),
        name: 'League of Legends',
        slug: 'lol',
        logoUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop',
        uidLabel: 'Summoner Name',
        isActive: true,
      },
      {
        id: crypto.randomUUID(),
        name: 'Genshin Impact',
        slug: 'genshin',
        logoUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
        uidLabel: 'UID',
        isActive: true,
      },
    ];

    await db.insert(games).values(games_data);

    // สร้าง Products (Game Accounts)
    console.log('🛍️ Creating products...');
    const products_data = [
      {
        id: crypto.randomUUID(),
        gameId: games_data[0].id, // Valorant
        title: 'บัญชี Valorant Immortal Rank',
        description: 'บัญชี Valorant แรงค์ Immortal พร้อมสกิน Vandal Prime และ Phantom Elderflame',
        rank: 'Immortal 2',
        skinsCount: 15,
        price: '2500.00',
        images: [
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop'
        ],
        accountData: {
          username: 'ProPlayer#TH1',
          password: 'SecurePass123!',
          email: 'account1@temp-mail.com',
          additionalInfo: 'มีสกิน Prime, Elderflame, Reaver collection'
        },
        isSold: false,
      },
      {
        id: crypto.randomUUID(),
        gameId: games_data[1].id, // League of Legends
        title: 'บัญชี LoL Diamond Rank',
        description: 'บัญชี League of Legends แรงค์ Diamond พร้อมแชมเปี้ยนครบ และสกินหายาก',
        rank: 'Diamond 3',
        skinsCount: 45,
        price: '1800.00',
        images: [
          'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop'
        ],
        accountData: {
          username: 'DiamondPlayer',
          password: 'SecurePass456!',
          email: 'account2@temp-mail.com',
          additionalInfo: 'มีแชมเปี้ยนครบทุกตัว สกิน Prestige และ Ultimate'
        },
        isSold: false,
      },
      {
        id: crypto.randomUUID(),
        gameId: games_data[2].id, // Genshin Impact
        title: 'บัญชี Genshin Impact AR 58',
        description: 'บัญชี Genshin Impact Adventure Rank 58 พร้อมตัวละคร 5 ดาวหลายตัว',
        rank: 'AR 58',
        skinsCount: 0,
        price: '3200.00',
        images: [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        ],
        accountData: {
          username: 'GenshinMaster',
          password: 'SecurePass789!',
          email: 'account3@temp-mail.com',
          additionalInfo: 'มี Zhongli, Raiden, Kazuha, Ayaka และตัวละคร 5 ดาวอื่นๆ'
        },
        isSold: false,
      },
    ];

    await db.insert(products).values(products_data);

    // สร้าง Admin Settings
    console.log('⚙️ Creating admin settings...');
    await db.insert(adminSettings).values([
      {
        key: 'bank_info',
        value: JSON.stringify({
          bankName: 'ธนาคารกสิกรไทย',
          accountName: 'บริษัท ดัมสโตร์ จำกัด',
          accountNumber: '123-4-56789-0'
        }),
        description: 'ข้อมูลบัญชีธนาคารสำหรับรับชำระเงิน',
      },
      {
        key: 'site_settings',
        value: JSON.stringify({
          siteName: 'DumStore',
          siteDescription: 'ร้านขายไอดีเกมและเติมพ้อยออนไลน์',
          contactEmail: 'support@dumstore.com',
          contactLine: '@dumstore'
        }),
        description: 'การตั้งค่าทั่วไปของเว็บไซต์',
      },
      {
        key: 'payment_settings',
        value: JSON.stringify({
          minTopupAmount: 100,
          maxTopupAmount: 50000,
          pointsRatio: 1, // 1 บาท = 1 พ้อย
          autoVerifySlips: true
        }),
        description: 'การตั้งค่าระบบชำระเงิน',
      }
    ]);

    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Created data:');
    console.log('   - Admin user: admin@dumstore.com / admin123456');
    console.log('   - Test user: user@test.com / user123456');
    console.log(`   - ${games_data.length} games`);
    console.log(`   - ${products_data.length} products`);
    console.log('   - Admin settings configured');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// รัน seeding
seed().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});