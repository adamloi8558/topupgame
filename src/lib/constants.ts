// App Configuration
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'DumStore';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const APP_DESCRIPTION = 'เว็บไซต์เติมเกมและขายไอดีเกม อัตโนมัติ ปลอดภัย - DumStore';

// Database Configuration
export const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://localhost:5432/topupgame';

// JWT Configuration
export const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-at-least-32-characters-long';
export const JWT_EXPIRY = '7d';

// File Upload Configuration
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export const FILE_UPLOAD = {
  maxFileSize: MAX_FILE_SIZE,
  allowedTypes: ALLOWED_IMAGE_TYPES,
  allowedExtensions: ALLOWED_FILE_EXTENSIONS,
};

// Cloudflare R2 Configuration
export const CLOUDFLARE_R2_CONFIG = {
  accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID || '',
  accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
  bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME || 'topupgame-files',
  publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL || 'https://your-bucket.r2.dev',
};

// EasySlip API Configuration
export const EASYSLIP_CONFIG = {
  apiUrl: process.env.EASYSLIP_API_URL || 'https://developer.easyslip.com/api/v1',
  accessToken: process.env.EASYSLIP_ACCESS_TOKEN || '',
};

// Bank Information
export const BANK_INFO = {
  bankName: process.env.SHOP_BANK_NAME || 'ธนาคารกสิกรไทย',
  accountName: process.env.SHOP_BANK_ACCOUNT_NAME || 'ร้านเติมเกม',
  accountNumber: process.env.SHOP_BANK_ACCOUNT_NUMBER || '123-456-7890',
};

// Admin Configuration
export const ADMIN_CONFIG = {
  email: process.env.ADMIN_EMAIL || 'admin@topupgame.com',
  password: process.env.ADMIN_PASSWORD || 'admin123456',
};

// Game Configuration
export const SUPPORTED_GAMES = [
  {
    id: 'rov',
    name: 'RoV (Arena of Valor)',
    slug: 'rov',
    uidLabel: 'UID',
    logo: '/game-icons/rov.png',
    isActive: true,
  },
  {
    id: 'free-fire',
    name: 'Free Fire',
    slug: 'free-fire',
    uidLabel: 'Player ID',
    logo: '/game-icons/free-fire.png',
    isActive: true,
  },
  {
    id: 'valorant',
    name: 'VALORANT',
    slug: 'valorant',
    uidLabel: 'Riot ID',
    logo: '/game-icons/valorant.png',
    isActive: true,
  },
  {
    id: 'pubg',
    name: 'PUBG Mobile',
    slug: 'pubg',
    uidLabel: 'Character ID',
    logo: '/game-icons/pubg.png',
    isActive: true,
  },
  {
    id: 'lol',
    name: 'League of Legends',
    slug: 'lol',
    uidLabel: 'Summoner Name',
    logo: '/game-icons/lol.png',
    isActive: true,
  },
];

// Top-up Amounts
export const TOPUP_AMOUNTS = [
  { value: 50, label: '50 บาท', bonus: 0 },
  { value: 100, label: '100 บาท', bonus: 5 },
  { value: 300, label: '300 บาท', bonus: 20 },
  { value: 500, label: '500 บาท', bonus: 50 },
  { value: 1000, label: '1,000 บาท', bonus: 150 },
  { value: 2000, label: '2,000 บาท', bonus: 400 },
];

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'รอดำเนินการ',
  [ORDER_STATUS.PROCESSING]: 'กำลังดำเนินการ',
  [ORDER_STATUS.COMPLETED]: 'สำเร็จ',
  [ORDER_STATUS.FAILED]: 'ล้มเหลว',
  [ORDER_STATUS.CANCELLED]: 'ยกเลิก',
};

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'text-yellow-400 bg-yellow-400/10',
  [ORDER_STATUS.PROCESSING]: 'text-blue-400 bg-blue-400/10',
  [ORDER_STATUS.COMPLETED]: 'text-neon-green bg-neon-green/10',
  [ORDER_STATUS.FAILED]: 'text-red-400 bg-red-400/10',
  [ORDER_STATUS.CANCELLED]: 'text-gray-400 bg-gray-400/10',
};

// Slip Status
export const SLIP_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  DUPLICATE: 'duplicate',
} as const;

export const SLIP_STATUS_LABELS = {
  [SLIP_STATUS.PENDING]: 'รอตรวจสอบ',
  [SLIP_STATUS.VERIFIED]: 'ตรวจสอบแล้ว',
  [SLIP_STATUS.REJECTED]: 'ถูกปฏิเสธ',
  [SLIP_STATUS.DUPLICATE]: 'สลิปซ้ำ',
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export const USER_ROLE_LABELS = {
  [USER_ROLES.USER]: 'ผู้ใช้',
  [USER_ROLES.ADMIN]: 'แอดมิน',
};

// Transaction Types
export const TRANSACTION_TYPES = {
  TOPUP: 'topup',
  PURCHASE: 'purchase',
  REFUND: 'refund',
} as const;

export const TRANSACTION_TYPE_LABELS = {
  [TRANSACTION_TYPES.TOPUP]: 'เติมพ้อย',
  [TRANSACTION_TYPES.PURCHASE]: 'ซื้อสินค้า',
  [TRANSACTION_TYPES.REFUND]: 'คืนเงิน',
};

// Rate Limiting
export const RATE_LIMITS = {
  LOGIN: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  REGISTER: {
    maxRequests: 10,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  UPLOAD: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  API: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Game Ranks (for different games)
export const GAME_RANKS_BY_GAME = {
  rov: [
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Master',
    'Grandmaster',
    'Challenger',
  ],
  valorant: [
    'Iron',
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Ascendant',
    'Immortal',
    'Radiant',
  ],
  lol: [
    'Iron',
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Master',
    'Grandmaster',
    'Challenger',
  ],
};

// All available ranks (unique)
export const GAME_RANKS = [
  'Iron',
  'Bronze',
  'Silver', 
  'Gold',
  'Platinum',
  'Diamond',
  'Master',
  'Grandmaster',
  'Challenger',
  'Ascendant',
  'Immortal',
  'Radiant',
];

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่',
  UNAUTHORIZED: 'กรุณาเข้าสู่ระบบก่อนใช้งาน',
  FORBIDDEN: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้',
  NOT_FOUND: 'ไม่พบข้อมูลที่ต้องการ',
  VALIDATION_ERROR: 'ข้อมูลที่กรอกไม่ถูกต้อง',
  SERVER_ERROR: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์ กรุณาลองใหม่ภายหลัง',
  FILE_TOO_LARGE: 'ไฟล์มีขนาดใหญ่เกินไป',
  INVALID_FILE_TYPE: 'ประเภทไฟล์ไม่ถูกต้อง',
  DUPLICATE_SLIP: 'สลิปนี้ถูกใช้งานแล้ว กรุณาตรวจสอบ',
  INVALID_SLIP: 'ไฟล์สลิปไม่ถูกต้อง กรุณาอัปโหลดใหม่',
  INSUFFICIENT_POINTS: 'พ้อยไม่เพียงพอ กรุณาเติมพ้อยก่อน',
  PRODUCT_OUT_OF_STOCK: 'สินค้าหมด กรุณาเลือกสินค้าอื่น',
  BANK_ACCOUNT_MISMATCH: 'บัญชีปลายทางในสลิปไม่ตรงกับบัญชีร้าน',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'เข้าสู่ระบบสำเร็จ',
  REGISTER_SUCCESS: 'สมัครสมาชิกสำเร็จ',
  LOGOUT_SUCCESS: 'ออกจากระบบสำเร็จ',
  PROFILE_UPDATED: 'อัปเดตโปรไฟล์สำเร็จ',
  PASSWORD_CHANGED: 'เปลี่ยนรหัสผ่านสำเร็จ',
  ORDER_CREATED: 'สร้างคำสั่งซื้อสำเร็จ',
  PAYMENT_SUCCESS: 'ชำระเงินสำเร็จ',
  SLIP_UPLOADED: 'อัปโหลดสลิปสำเร็จ รอการตรวจสอบ',
  TOPUP_SUCCESS: 'เติมพ้อยสำเร็จ',
  PURCHASE_SUCCESS: 'ซื้อสินค้าสำเร็จ',
  PRODUCT_ADDED: 'เพิ่มสินค้าสำเร็จ',
  PRODUCT_UPDATED: 'อัปเดตสินค้าสำเร็จ',
  PRODUCT_DELETED: 'ลบสินค้าสำเร็จ',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  ME: '/api/auth/me',
  
  // Users
  PROFILE: '/api/users/profile',
  POINTS: '/api/users/points',
  TRANSACTIONS: '/api/users/transactions',
  
  // Games
  GAMES: '/api/games',
  GAME_DETAIL: '/api/games',
  
  // Products
  PRODUCTS: '/api/products',
  PRODUCT_DETAIL: '/api/products',
  PRODUCT_CATEGORIES: '/api/products/categories',
  
  // Orders
  ORDERS: '/api/orders',
  ORDER_DETAIL: '/api/orders',
  TOPUP_ORDER: '/api/orders/topup',
  PURCHASE_ORDER: '/api/orders/purchase',
  CANCEL_ORDER: '/api/orders',
  
  // Slips
  UPLOAD_SLIP: '/api/slips/upload',
  VERIFY_SLIP: '/api/slips/verify',
  SLIP_DETAIL: '/api/slips',
  
  // File Upload
  UPLOAD_IMAGE: '/api/upload/image',
  DELETE_FILE: '/api/upload',
  
  // Admin
  ADMIN_ORDERS: '/api/admin/orders',
  ADMIN_USERS: '/api/admin/users',
  ADMIN_PRODUCTS: '/api/admin/products',
  ADMIN_ANALYTICS: '/api/admin/analytics',
  
  // EasySlip
  EASYSLIP_VERIFY: '/api/easyslip/verify',
  EASYSLIP_STATUS: '/api/easyslip/status',
};

// Navigation Menu
export const NAVIGATION_ITEMS = [
  { label: 'หน้าแรก', href: '/', icon: 'Home' },
  { label: 'เติมพ้อย', href: '/topup', icon: 'Wallet' },
  { label: 'ร้านค้า', href: '/shop', icon: 'ShoppingBag' },
  { label: 'ประวัติ', href: '/history', icon: 'History' },
];

export const ADMIN_NAVIGATION_ITEMS = [
  { label: 'แดชบอร์ด', href: '/admin', icon: 'BarChart3' },
  { label: 'คำสั่งซื้อ', href: '/admin/orders', icon: 'ShoppingCart' },
  { label: 'สินค้า', href: '/admin/products', icon: 'Package' },
  { label: 'ผู้ใช้', href: '/admin/users', icon: 'Users' },
  { label: 'วิเคราะห์', href: '/admin/analytics', icon: 'TrendingUp' },
];

// Social Links
export const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#', icon: 'Facebook' },
  { label: 'Line', href: '#', icon: 'MessageCircle' },
  { label: 'Discord', href: '#', icon: 'Hash' },
];

// Footer Links
export const FOOTER_LINKS = [
  {
    title: 'บริการ',
    links: [
      { label: 'เติมพ้อยเกม', href: '/topup' },
      { label: 'ขายไอดีเกม', href: '/shop' },
      { label: 'วิธีการใช้งาน', href: '/guide' },
    ],
  },
  {
    title: 'ช่วยเหลือ',
    links: [
      { label: 'คำถามที่พบบ่อย', href: '/faq' },
      { label: 'ติดต่อเรา', href: '/contact' },
      { label: 'แจ้งปัญหา', href: '/support' },
    ],
  },
  {
    title: 'นโยบาย',
    links: [
      { label: 'เงื่อนไขการใช้งาน', href: '/terms' },
      { label: 'นโยบายความเป็นส่วนตัว', href: '/privacy' },
      { label: 'นโยบายการคืนเงิน', href: '/refund' },
    ],
  },
]; 