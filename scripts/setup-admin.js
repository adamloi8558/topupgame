#!/usr/bin/env node

// Setup Admin Script
// Usage: node scripts/setup-admin.js <email>
// Example: node scripts/setup-admin.js admin@dumstore.com

const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { users } = require('../src/lib/db/schema');
const { eq } = require('drizzle-orm');

async function setupAdmin() {
  const email = process.argv[2];
  
  if (!email) {
    console.error('❌ กรุณาระบุอีเมล');
    console.log('📝 วิธีใช้: node scripts/setup-admin.js <email>');
    console.log('📝 ตัวอย่าง: node scripts/setup-admin.js admin@dumstore.com');
    process.exit(1);
  }

  try {
    // Connect to database
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.error('❌ ไม่พบ DATABASE_URL ใน environment variables');
      process.exit(1);
    }

    const sql = postgres(connectionString);
    const db = drizzle(sql);

    console.log('🔍 กำลังค้นหาผู้ใช้...');

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      console.error(`❌ ไม่พบผู้ใช้ที่มีอีเมล: ${email}`);
      console.log('💡 กรุณาสมัครสมาชิกก่อนแล้วค่อยรันคำสั่งนี้');
      process.exit(1);
    }

    if (user.role === 'admin') {
      console.log(`✅ ผู้ใช้ ${email} เป็น admin อยู่แล้ว`);
      process.exit(0);
    }

    console.log('🔄 กำลังอัปเดต role เป็น admin...');

    // Update user role to admin
    const [updatedUser] = await db
      .update(users)
      .set({ role: 'admin' })
      .where(eq(users.email, email))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      });

    console.log('🎉 สำเร็จ! อัปเดต admin แล้ว');
    console.log('👤 ข้อมูลผู้ใช้:');
    console.log(`   📧 อีเมล: ${updatedUser.email}`);
    console.log(`   👤 ชื่อ: ${updatedUser.name}`);
    console.log(`   👑 บทบาท: ${updatedUser.role}`);

    await sql.end();

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
    process.exit(1);
  }
}

setupAdmin(); 