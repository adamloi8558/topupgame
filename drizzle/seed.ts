import { db } from '../src/lib/db';
import { users, games, products, adminSettings } from '../src/lib/db/schema';
import { hashPassword } from '../src/lib/auth';
import { ADMIN_CONFIG, SUPPORTED_GAMES, BANK_INFO } from '../src/lib/constants';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create admin user
    console.log('👤 Creating admin user...');
    const adminId = uuidv4();
    const hashedPassword = await hashPassword(ADMIN_CONFIG.password);
    
    await db.insert(users).values({
      id: adminId,
      email: ADMIN_CONFIG.email,
      passwordHash: hashedPassword,
      name: 'Admin',
      points: '1000000.00', // Give admin lots of points for testing
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ Admin user created with email: ${ADMIN_CONFIG.email}`);

    // Create test user
    console.log('👤 Creating test user...');
    const testUserId = uuidv4();
    const testPassword = await hashPassword('password123');
    
    await db.insert(users).values({
      id: testUserId,
      email: 'user@test.com',
      passwordHash: testPassword,
      name: 'Test User',
      points: '500.00',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Test user created with email: user@test.com (password: password123)');

    // Create games
    console.log('🎮 Creating games...');
    const gameIds: Record<string, string> = {};
    
    for (const game of SUPPORTED_GAMES) {
      const gameId = uuidv4();
      gameIds[game.slug] = gameId;
      
      await db.insert(games).values({
        id: gameId,
        name: game.name,
        slug: game.slug,
        logoUrl: game.logo,
        uidLabel: game.uidLabel,
        isActive: game.isActive,
        createdAt: new Date(),
      });
      console.log(`✅ Game created: ${game.name}`);
    }

    // Create sample products
    console.log('📦 Creating sample products...');
    
    // ROV Products
    const rovProducts = [
      {
        title: 'บัญชี ROV แรงค์ Master ⭐',
        description: 'บัญชี ROV แรงค์ Master มีสกิน 50+ ตัว รวมสกิน Limited Edition หลายตัว เล่นได้ทันที',
        rank: 'Master',
        skinsCount: 52,
        price: 1500,
        images: ['/products/rov-master-1.jpg', '/products/rov-master-2.jpg'],
        accountData: {
          username: 'rov_master_001',
          password: 'secure123',
          email: 'rov1@gameacc.com',
          additionalInfo: 'มีสกิน Murad Dragon Hunter, Nakroth Dark Slayer',
        },
      },
      {
        title: 'บัญชี ROV แรงค์ Diamond 💎',
        description: 'บัญชี ROV แรงค์ Diamond มีสกิน 30+ ตัว เหมาะสำหรับการเริ่มต้น',
        rank: 'Diamond',
        skinsCount: 35,
        price: 800,
        images: ['/products/rov-diamond-1.jpg'],
        accountData: {
          username: 'rov_diamond_001',
          password: 'secure456',
          email: 'rov2@gameacc.com',
          additionalInfo: 'มีสกิน Violet Cyberpunk, Hayate Shogun',
        },
      },
    ];

    for (const product of rovProducts) {
      await db.insert(products).values({
        id: uuidv4(),
        gameId: gameIds['rov'],
        title: product.title,
        description: product.description,
        rank: product.rank,
        skinsCount: product.skinsCount,
        price: product.price.toString(),
        images: product.images,
        accountData: product.accountData,
        isSold: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Free Fire Products
    const freeFireProducts = [
      {
        title: 'บัญชี Free Fire แรงค์ Grandmaster 🔥',
        description: 'บัญชี Free Fire แรงค์ Grandmaster มีสกิน 40+ ตัว รวมสกิน Evo และ Bundle',
        rank: 'Grandmaster',
        skinsCount: 45,
        price: 2000,
        images: ['/products/ff-grandmaster-1.jpg'],
        accountData: {
          username: 'ff_grandmaster_001',
          password: 'secure789',
          email: 'ff1@gameacc.com',
          additionalInfo: 'มี Bundle Shirou, Dragon AK, Golden M1014',
        },
      },
      {
        title: 'บัญชี Free Fire แรงค์ Diamond 💎',
        description: 'บัญชี Free Fire แรงค์ Diamond มีสกิน 25+ ตัว เล่นได้ทันที',
        rank: 'Diamond',
        skinsCount: 28,
        price: 1200,
        images: ['/products/ff-diamond-1.jpg'],
        accountData: {
          username: 'ff_diamond_001',
          password: 'secure101',
          email: 'ff2@gameacc.com',
          additionalInfo: 'มี Bundle Kelly, AK47 Blue Flame',
        },
      },
    ];

    for (const product of freeFireProducts) {
      await db.insert(products).values({
        id: uuidv4(),
        gameId: gameIds['free-fire'],
        title: product.title,
        description: product.description,
        rank: product.rank,
        skinsCount: product.skinsCount,
        price: product.price.toString(),
        images: product.images,
        accountData: product.accountData,
        isSold: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // VALORANT Products
    const valorantProducts = [
      {
        title: 'บัญชี VALORANT แรงค์ Immortal ⚡',
        description: 'บัญชี VALORANT แรงค์ Immortal มีสกิน Phantom, Vandal และ Knife หลายตัว',
        rank: 'Immortal',
        skinsCount: 15,
        price: 3500,
        images: ['/products/val-immortal-1.jpg'],
        accountData: {
          username: 'val_immortal_001',
          password: 'secure202',
          email: 'val1@gameacc.com',
          additionalInfo: 'มี Prime Vandal, Reaver Phantom, Elderflame Knife',
        },
      },
      {
        title: 'บัญชี VALORANT แรงค์ Diamond 💎',
        description: 'บัญชี VALORANT แรงค์ Diamond มีสกิน Phantom และ Vandal เซต',
        rank: 'Diamond',
        skinsCount: 10,
        price: 2500,
        images: ['/products/val-diamond-1.jpg'],
        accountData: {
          username: 'val_diamond_001',
          password: 'secure303',
          email: 'val2@gameacc.com',
          additionalInfo: 'มี Prime Phantom, Glitchpop Vandal',
        },
      },
    ];

    for (const product of valorantProducts) {
      await db.insert(products).values({
        id: uuidv4(),
        gameId: gameIds['valorant'],
        title: product.title,
        description: product.description,
        rank: product.rank,
        skinsCount: product.skinsCount,
        price: product.price.toString(),
        images: product.images,
        accountData: product.accountData,
        isSold: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    console.log('✅ Sample products created');

    // Create admin settings
    console.log('⚙️ Creating admin settings...');
    const settings = [
      {
        key: 'bank_name',
        value: BANK_INFO.bankName,
        description: 'ชื่อธนาคารของร้าน',
      },
      {
        key: 'bank_account_name',
        value: BANK_INFO.accountName,
        description: 'ชื่อบัญชีธนาคารของร้าน',
      },
      {
        key: 'bank_account_number',
        value: BANK_INFO.accountNumber,
        description: 'เลขบัญชีธนาคารของร้าน',
      },
      {
        key: 'site_name',
        value: 'TopUp Game Store',
        description: 'ชื่อเว็บไซต์',
      },
      {
        key: 'site_description',
        value: 'เว็บไซต์เติมเกมและขายไอดีเกม อัตโนมัติ ปลอดภัย',
        description: 'คำอธิบายเว็บไซต์',
      },
      {
        key: 'maintenance_mode',
        value: 'false',
        description: 'โหมดปิดปรับปรุงระบบ',
      },
      {
        key: 'auto_verify_slips',
        value: 'true',
        description: 'เปิดใช้งานการตรวจสอบสลิปอัตโนมัติ',
      },
    ];

    for (const setting of settings) {
      await db.insert(adminSettings).values({
        key: setting.key,
        value: setting.value,
        description: setting.description,
        updatedAt: new Date(),
      });
    }

    console.log('✅ Admin settings created');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📝 Login Credentials:');
    console.log(`Admin: ${ADMIN_CONFIG.email} / ${ADMIN_CONFIG.password}`);
    console.log('User: user@test.com / password123');
    console.log('\n🎮 Games created:', SUPPORTED_GAMES.length);
    console.log('📦 Products created:', rovProducts.length + freeFireProducts.length + valorantProducts.length);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seed if called directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('✅ Seeding finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seed }; 