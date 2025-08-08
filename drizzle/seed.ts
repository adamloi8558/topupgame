import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { 
  users, games, products, orders, orderItems, slips, transactions, adminSettings 
} from '../src/lib/db/schema';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

// Database connection
const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);
const db = drizzle(sql);

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await db.delete(adminSettings);
    await db.delete(transactions);
    await db.delete(slips);
    await db.delete(orderItems);
    await db.delete(orders);
    await db.delete(products);
    await db.delete(games);
    await db.delete(users);

    // Create admin user
    const adminId = uuidv4();
    const hashedAdminPassword = await bcrypt.hash('admin123', 12);

    await db.insert(users).values({
      id: adminId,
      email: 'admin@dumstore.com',
      name: 'Admin',
      passwordHash: hashedAdminPassword,
      points: '10000',
      role: 'admin',
    });

    // Create test users
    const userId1 = uuidv4();
    const userId2 = uuidv4();
    const hashedUserPassword = await bcrypt.hash('user123', 12);

    await db.insert(users).values([
      {
        id: userId1,
        email: 'user1@gmail.com',
        name: 'TestUser1',
        passwordHash: hashedUserPassword,
        points: '500',
        role: 'user',
      },
      {
        id: userId2,
        email: 'user2@gmail.com',
        name: 'TestUser2',
        passwordHash: hashedUserPassword,
        points: '1000',
        role: 'user',
      },
    ]);

    // Create games
    await db.insert(games).values([
      {
        id: 'valorant',
        name: 'VALORANT',
        slug: 'valorant',
        logoUrl: 'https://logos-download.com/wp-content/uploads/2021/01/Valorant_Logo_Riot_Games.png',
        uidLabel: 'Riot ID',
        isActive: true,
      },
      {
        id: 'rov',
        name: 'RoV',
        slug: 'rov',
        logoUrl: 'https://bacidea.com/wp-content/uploads/2019/07/RoV-New-Era-9_Logo.jpg',
        uidLabel: 'Player ID',
        isActive: true,
      },
    ]);

    // Create products
    const productIds = {
      val1: uuidv4(),
      val2: uuidv4(),
      rov1: uuidv4(),
      rov2: uuidv4(),
    };

    await db.insert(products).values([
      {
        id: productIds.val1,
        gameId: 'valorant',
        title: 'Valorant Immortal Account - Premium Skins',
        description: 'บัญชี Valorant แรงค์ Immortal มีสกินหายากและแพง',
        rank: 'Immortal',
        skinsCount: 15,
        price: '3500',
        images: ['https://logos-download.com/wp-content/uploads/2021/01/Valorant_Logo_Riot_Games.png'],
        accountData: {
          username: 'ValPro001',
          password: 'SecurePass123',
          email: 'valpro001@gmail.com',
          additionalInfo: 'มีสกิน Phantom Elderflame และ Vandal Prime',
        },
        isSold: false,
      },
      {
        id: productIds.val2,
        gameId: 'valorant',
        title: 'Valorant Platinum Account - Reaver Collection',
        description: 'บัญชี Valorant แรงค์ Platinum มีสกิน Reaver Collection',
        rank: 'Platinum',
        skinsCount: 10,
        price: '2500',
        images: ['https://logos-download.com/wp-content/uploads/2021/01/Valorant_Logo_Riot_Games.png'],
        accountData: {
          username: 'PlatPlayer',
          password: 'PlatPass456',
          email: 'platplayer@gmail.com',
          additionalInfo: 'Reaver Collection ครบชุด',
        },
        isSold: false,
      },
      {
        id: productIds.rov1,
        gameId: 'rov',
        title: 'RoV Conqueror Account - Full Collection',
        description: 'บัญชี RoV แรงค์ Conqueror มีสกินและฮีโร่ครบ',
        rank: 'Conqueror',
        skinsCount: 50,
        price: '4200',
        images: ['https://bacidea.com/wp-content/uploads/2019/07/RoV-New-Era-9_Logo.jpg'],
        accountData: {
          username: 'ConquerorKing',
          password: 'ConquerorPass789',
          email: 'conqueror@gmail.com',
          additionalInfo: 'สกินและฮีโร่ครบทุกตัว',
        },
        isSold: false,
      },
      {
        id: productIds.rov2,
        gameId: 'rov',
        title: 'RoV Diamond Account - Legendary Skins',
        description: 'บัญชี RoV แรงค์ Diamond มีสกิน Legendary หลายตัว',
        rank: 'Diamond',
        skinsCount: 25,
        price: '2800',
        images: ['https://bacidea.com/wp-content/uploads/2019/07/RoV-New-Era-9_Logo.jpg'],
        accountData: {
          username: 'DiamondHero',
          password: 'DiamondPass456',
          email: 'diamond@gmail.com',
          additionalInfo: 'Legendary Skins หลายตัว',
        },
        isSold: false,
      },
    ]);

    // Create orders
    const orderId1 = uuidv4();
    const orderId2 = uuidv4();

    await db.insert(orders).values([
      {
        id: orderId1,
        userId: userId1,
        type: 'topup',
        status: 'completed',
        amount: '500',
        pointsEarned: '500',
        gameUid: 'TestUser#1234',
        gameId: 'valorant',
      },
      {
        id: orderId2,
        userId: userId2,
        type: 'purchase',
        status: 'pending',
        amount: '2500',
        pointsEarned: '0',
        gameId: 'valorant',
      },
    ]);

    // Create order items
    await db.insert(orderItems).values([
      {
        id: uuidv4(),
        orderId: orderId2,
        productId: productIds.val2,
        price: '2500',
      },
    ]);

    // Create slips
    const slipId1 = uuidv4();
    const slipId2 = uuidv4();

    await db.insert(slips).values([
      {
        id: slipId1,
        orderId: orderId1,
        fileUrl: 'https://example.com/slip1.jpg',
        fileName: 'slip_20240126_001.jpg',
        status: 'verified',
        verifiedAt: new Date(),
      },
      {
        id: slipId2,
        orderId: orderId2,
        fileUrl: 'https://example.com/slip2.jpg',
        fileName: 'slip_20240126_002.jpg',
        status: 'pending',
      },
    ]);

    // Create transactions
    await db.insert(transactions).values([
      {
        id: uuidv4(),
        userId: userId1,
        type: 'topup',
        amount: '500',
        pointsBefore: '0',
        pointsAfter: '500',
        referenceId: orderId1,
        description: 'เติมพ้อย 500 บาท',
      },
      {
        id: uuidv4(),
        userId: userId2,
        type: 'topup',
        amount: '1000',
        pointsBefore: '0',
        pointsAfter: '1000',
        description: 'เติมพ้อย 1000 บาท',
      },
    ]);

    // Create admin settings
    await db.insert(adminSettings).values([
      {
        key: 'site_name',
        value: 'DumStore',
        description: 'ชื่อเว็บไซต์',
      },
      {
        key: 'site_description',
        value: 'เว็บไซต์เติมเกมและขายไอดีเกมออนไลน์',
        description: 'คำอธิบายเว็บไซต์',
      },
      {
        key: 'contact_email',
        value: 'support@dumstore.com',
        description: 'อีเมลติดต่อ',
      },
      {
        key: 'bank_name',
        value: 'กสิกรไทย',
        description: 'ชื่อธนาคาร',
      },
      {
        key: 'bank_account_number',
        value: '2111381316',
        description: 'เลขที่บัญชี',
      },
      {
        key: 'bank_account_name',
        value: 'พีรพงษ์ ดีเขื่อนเพชร์',
        description: 'ชื่อบัญชี',
      },
      {
        key: 'easyslip_access_token',
        value: 'your-easyslip-token',
        description: 'EasySlip API Token',
      },
    ]);

    console.log('✅ Database seeding completed successfully!');
    console.log('📧 Admin login: admin@dumstore.com / admin123');
    console.log('👤 Test users: user1@gmail.com, user2@gmail.com / user123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

// Run the seed function
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase; 