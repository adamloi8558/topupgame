# Tech Stack - เว็บเติมเกม/ขายไอดีเกม

## Frontend Technologies
- **Framework**: Next.js (React-based)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Responsive Design**: Mobile และ Desktop

## Backend Technologies
- **Runtime**: Node.js
- **Framework**: Express.js หรือ Next.js Server Actions
- **Database ORM**: 
  - Drizzle ORM (แนะนำ)
  - หรือ Prisma ORM

## Authentication & Security
- **Authentication System**: 
  - Auth.js (NextAuth.js)
  - หรือ Clerk
- **Session Management**: JWT/Cookie-based

## File Storage & Upload
- **File Storage**: Cloudflare R2
- **Upload Support**: 
  - File upload (drag & drop)
  - Base64 image paste
  - Image formats: JPG, PNG, WEBP

## External APIs
- **Payment Verification**: EasySlip API
  - ต้องใช้ Access Token ใน Header
  - ตรวจสอบสลิปโอนเงินอัตโนมัติ
  - รองรับการตรวจจับสลิปซ้ำ (duplicate_slip)

## Database Requirements
- **Database Type**: PostgreSQL
- **Tables หลัก**:
  - Users (ข้อมูลผู้ใช้และพ้อย)
  - Orders (คำสั่งซื้อ)
  - Products (สินค้าไอดีเกม)
  - Slips (ข้อมูลสลิปการโอนเงิน)
  - Transactions (บันทึกการเคลื่อนไหวพ้อย)

## Development Environment
- **Package Manager**: npm หรือ yarn
- **TypeScript**: แนะนำใช้เพื่อความปลอดภัยของ code
- **Environment Variables**:
  - DATABASE_URL
  - EASYSLIP_API_TOKEN
  - CLOUDFLARE_R2_CREDENTIALS
  - NEXTAUTH_SECRET

## Security Considerations
- **Input Validation**: zod schema validation
- **File Upload Security**: 
  - ตรวจสอบ file type และขนาด
  - Scan malware (ถ้าจำเป็น)
- **Rate Limiting**: ป้องกัน spam uploads
- **CORS**: กำหนด allowed origins

## Performance Optimization
- **Image Optimization**: Next.js Image component
- **Caching**: Redis (optional) สำหรับ session และ frequently accessed data
- **CDN**: Cloudflare สำหรับ static assets

## Error Handling
- **EasySlip API Error Codes**:
  - `duplicate_slip`: สลิปถูกใช้แล้ว
  - `invalid_image`: ไฟล์ภาพไม่ถูกต้อง
  - `unauthorized`: ปัญหา API token
- **Global Error Boundary**: จัดการ errors ใน React
- **Logging**: Winston หรือ similar สำหรับ server logs

## Deployment Options
- **Frontend**: Vercel, Netlify
- **Database**: Railway, PlanetScale, Supabase
- **File Storage**: Cloudflare R2
- **Monitoring**: Sentry สำหรับ error tracking 