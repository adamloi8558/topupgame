// App Configuration
export const APP_NAME = 'DumStore';
export const APP_DESCRIPTION = 'เว็บไซต์เติมเกมและขายไอดีเกมออนไลน์ - DumStore';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
export const API_TIMEOUT = 10000; // 10 seconds

// File Upload Configuration
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
};

// File Upload Legacy Constants (for backward compatibility)
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Bank Information
export const BANK_INFO = {
  bankName: 'กรุงไทย',
  accountName: 'ฐาปนพงษ์ เดชยศดี',
  accountNumber: '6645533950',
  branchName: 'สาขาท่าพระ',
};

// Rate Limiting Configuration
export const RATE_LIMITS = {
  REGISTER: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  LOGIN: {
    maxRequests: 10,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  UPLOAD: {
    maxRequests: 20,
    windowMs: 60 * 1000, // 1 minute
  },
  API: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
};

// JWT Configuration
export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'super-secret-jwt-key-for-development-only-minimum-32-chars',
  expiresIn: '7d',
};

// Cloudflare R2 Configuration
export const CLOUDFLARE_R2_CONFIG = {
  accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID || '',
  accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
  bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME || 'topupgame-files',
  publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL || 'https://your-bucket.r2.dev',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || '',
};

// EasySlip API Configuration
export const EASYSLIP_CONFIG = {
  apiUrl: process.env.EASYSLIP_API_URL || 'https://developer.easyslip.com/api/v1',
  accessToken: process.env.EASYSLIP_ACCESS_TOKEN || '',
};

// Navigation
export const NAVIGATION_ITEMS = [
  { label: 'หน้าแรก', href: '/', icon: 'Home' },
  { label: 'เติมพ้อย', href: '/topup', icon: 'Wallet' },
  { label: 'ร้านค้า', href: '/shop', icon: 'ShoppingBag' },
  { label: 'ประวัติ', href: '/history', icon: 'History' },
];

// Admin Navigation
export const ADMIN_NAVIGATION = [
  { 
    label: 'ภาพรวม', 
    href: '/admin', 
    icon: 'BarChart3',
    description: 'ดูสถิติและข้อมูลสำคัญ'
  },
  { 
    label: 'ผู้ใช้', 
    href: '/admin/users', 
    icon: 'Users',
    description: 'จัดการผู้ใช้และสิทธิ์'
  },
  { 
    label: 'คำสั่งซื้อ', 
    href: '/admin/orders', 
    icon: 'ShoppingCart',
    description: 'ดูและจัดการคำสั่งซื้อ'
  },
  { 
    label: 'สินค้า', 
    href: '/admin/products', 
    icon: 'Package',
    description: 'จัดการสินค้าและไอดีเกม'
  },
  { 
    label: 'สลิป', 
    href: '/admin/slips', 
    icon: 'FileText',
    description: 'ตรวจสอบสลิปการโอนเงิน'
  },
  { 
    label: 'รายงาน', 
    href: '/admin/analytics', 
    icon: 'TrendingUp',
    description: 'ดูรายงานและสถิติ'
  },
  { 
    label: 'ตั้งค่า', 
    href: '/admin/settings', 
    icon: 'Settings',
    description: 'ตั้งค่าระบบและการกำหนดค่า'
  },
];

// Footer Links
export const FOOTER_LINKS = {
  company: [
    { label: 'เกี่ยวกับเรา', href: '/about' },
    { label: 'ติดต่อเรา', href: '/contact' },
    { label: 'ร่วมงานกับเรา', href: '/careers' },
  ],
  support: [
    { label: 'วิธีการใช้งาน', href: '/help' },
    { label: 'คำถามที่พบบ่อย', href: '/faq' },
    { label: 'แจ้งปัญหา', href: '/support' },
  ],
  legal: [
    { label: 'นโยบายความเป็นส่วนตัว', href: '/privacy' },
    { label: 'ข้อกำหนดการใช้งาน', href: '/terms' },
    { label: 'คำแถลงความรับผิดชอบ', href: '/disclaimer' },
  ],
};

// Social Media Links
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/dumstore',
  twitter: 'https://twitter.com/dumstore',
  instagram: 'https://instagram.com/dumstore',
  discord: 'https://discord.gg/dumstore',
  line: 'https://line.me/ti/p/@dumstore',
};

// Supported Games
export const SUPPORTED_GAMES = [
  {
    id: 'valorant',
    name: 'VALORANT',
    shortName: 'VAL',
    description: 'เกม FPS ยุทธวิธีจาก Riot Games',
    logo: 'https://logos-download.com/wp-content/uploads/2021/01/Valorant_Logo_Riot_Games.png',
    uidLabel: 'Riot ID',
    topupEnabled: true,
    accountSaleEnabled: true,
    minTopup: 50,
    maxTopup: 10000,
  },
  {
    id: 'rov',
    name: 'RoV',
    shortName: 'ROV',
    description: 'เกม MOBA ยอดนิยมในไทย',
    logo: 'https://bacidea.com/wp-content/uploads/2019/07/RoV-New-Era-9_Logo.jpg',
    uidLabel: 'Player ID',
    topupEnabled: true,
    accountSaleEnabled: true,
    minTopup: 20,
    maxTopup: 5000,
  },
];

// Game Ranks
export const GAME_RANKS = [
  // Valorant Ranks
  { game: 'valorant', rank: 'Bronze', order: 1 },
  { game: 'valorant', rank: 'Gold', order: 2 },
  { game: 'valorant', rank: 'Platinum', order: 3 },
  { game: 'valorant', rank: 'Immortal', order: 4 },
  
  // ROV Ranks
  { game: 'rov', rank: 'Gold', order: 1 },
  { game: 'rov', rank: 'Silver', order: 2 },
  { game: 'rov', rank: 'Diamond', order: 3 },
  { game: 'rov', rank: 'Conqueror', order: 4 },
];

// Top-up Packages
export const TOPUP_AMOUNTS = [
  { value: 50, label: '50 บาท', bonus: 0 },
  { value: 100, label: '100 บาท', bonus: 5 },
  { value: 200, label: '200 บาท', bonus: 15 },
  { value: 500, label: '500 บาท', bonus: 50 },
  { value: 1000, label: '1,000 บาท', bonus: 120 },
  { value: 2000, label: '2,000 บาท', bonus: 300 },
];

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

// Order Status Labels
export const ORDER_STATUS_LABELS = {
  pending: 'รอดำเนินการ',
  processing: 'กำลังดำเนินการ', 
  completed: 'สำเร็จ',
  failed: 'ล้มเหลว',
  cancelled: 'ยกเลิก',
};

// Transaction Types
export const TRANSACTION_TYPES = {
  TOPUP: 'topup',
  PURCHASE: 'purchase',
  REFUND: 'refund',
  ADJUSTMENT: 'adjustment',
} as const;

// Transaction Type Labels
export const TRANSACTION_TYPE_LABELS = {
  topup: 'เติมพ้อย',
  purchase: 'ซื้อสินค้า',
  refund: 'คืนเงิน',
  adjustment: 'ปรับปรุง',
};

// Slip Status
export const SLIP_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;

// Slip Status Labels
export const SLIP_STATUS_LABELS = {
  pending: 'รอตรวจสอบ',
  processing: 'กำลังตรวจสอบ',
  verified: 'ตรวจสอบแล้ว',
  rejected: 'ถูกปฏิเสธ',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
};

// Currency
export const CURRENCY = {
  SYMBOL: '฿',
  CODE: 'THB',
  NAME: 'บาท',
};

// Time Format
export const TIME_FORMAT = {
  DATE: 'dd/MM/yyyy',
  TIME: 'HH:mm',
  DATETIME: 'dd/MM/yyyy HH:mm',
  FULL: 'dd/MM/yyyy HH:mm:ss',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง',
  SERVER_ERROR: 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่ภายหลัง',
  UNAUTHORIZED: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้',
  FORBIDDEN: 'การเข้าถึงถูกปฏิเสธ',
  NOT_FOUND: 'ไม่พบข้อมูลที่ต้องการ',
  VALIDATION_ERROR: 'ข้อมูลที่กรอกไม่ถูกต้อง',
  DUPLICATE_ERROR: 'ข้อมูลนี้มีอยู่ในระบบแล้ว',
  RATE_LIMIT: 'คำขอมากเกินไป กรุณารอสักครู่แล้วลองใหม่',
  INVALID_SLIP: 'สลิปไม่ถูกต้องหรือไม่สามารถอ่านได้',
  DUPLICATE_SLIP: 'สลิปนี้ถูกใช้งานแล้ว',
  INVALID_FILE_TYPE: 'ประเภทไฟล์ไม่ถูกต้อง รองรับเฉพาะ JPG, PNG, WEBP',
  FILE_TOO_LARGE: 'ไฟล์มีขนาดใหญ่เกินไป',
  BANK_ACCOUNT_MISMATCH: 'บัญชีปลายทางไม่ตรงกับบัญชีของร้าน',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'เข้าสู่ระบบสำเร็จ',
  LOGOUT: 'ออกจากระบบสำเร็จ',
  REGISTER: 'สมัครสมาชิกสำเร็จ',
  REGISTER_SUCCESS: 'สมัครสมาชิกสำเร็จ',
  UPDATE_PROFILE: 'อัปเดตโปรไฟล์สำเร็จ',
  CHANGE_PASSWORD: 'เปลี่ยนรหัสผ่านสำเร็จ',
  ORDER_CREATED: 'สร้างคำสั่งซื้อสำเร็จ',
  PAYMENT_SUCCESS: 'ชำระเงินสำเร็จ',
  SLIP_UPLOADED: 'อัปโหลดสลิปสำเร็จ',
  TOPUP_SUCCESS: 'เติมพ้อยสำเร็จ',
};

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  GAME_UID: /^[a-zA-Z0-9_#-]{3,30}$/,
}; 