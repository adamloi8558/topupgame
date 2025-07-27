import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง'),
  password: z.string().min(1, 'กรุณากรอกรหัสผ่าน'),
});

export const registerSchema = z.object({
  name: z.string()
    .min(3, 'Username ต้องมีอย่างน้อย 3 ตัวอักษร')
    .max(20, 'Username ต้องไม่เกิน 20 ตัวอักษร')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username ใช้ได้เฉพาะ a-z, A-Z, 0-9 และ _ เท่านั้น'),
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง'),
  password: z.string()
    .min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
    .regex(/[a-z]/, 'รหัสผ่านต้องมีตัวอักษรพิมพ์เล็ก')
    .regex(/[A-Z]/, 'รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่')
    .regex(/[0-9]/, 'รหัสผ่านต้องมีตัวเลข')
    .regex(/[!@#$%^&*(),.?":{}|<>_+=\-\[\]\\\/~`]/, 'รหัสผ่านต้องมีอักขระพิเศษ'),
  confirmPassword: z.string().optional()
}).refine((data) => {
  // check confirmPassword na i sud
  if (data.confirmPassword) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: 'รหัสผ่านไม่ตรงกัน',
  path: ['confirmPassword'],
});

// User Profile Schema
export const profileUpdateSchema = z.object({
  name: z.string()
    .min(3, 'Username ต้องมีอย่างน้อย 3 ตัวอักษร')
    .max(20, 'Username ต้องไม่เกิน 20 ตัวอักษร')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username ใช้ได้เฉพาะ a-z, A-Z, 0-9 และ _ เท่านั้น'),
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'กรุณากรอกรหัสผ่านปัจจุบัน'),
  newPassword: z.string()
    .min(8, 'รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร')
    .regex(/[a-z]/, 'รหัสผ่านต้องมีตัวอักษรพิมพ์เล็ก')
    .regex(/[A-Z]/, 'รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่')
    .regex(/[0-9]/, 'รหัสผ่านต้องมีตัวเลข')
    .regex(/[!@#$%^&*(),.?":{}|<>_+=\-\[\]\\\/~`]/, 'รหัสผ่านต้องมีอักขระพิเศษ'),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'รหัสผ่านใหม่ไม่ตรงกัน',
  path: ['confirmNewPassword'],
});

// Game Schema
export const gameSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อเกม').max(100, 'ชื่อเกมต้องไม่เกิน 100 ตัวอักษร'),
  slug: z.string().min(1, 'กรุณากรอก slug').max(50, 'slug ต้องไม่เกิน 50 ตัวอักษร'),
  logoUrl: z.string().url('กรุณากรอก URL ที่ถูกต้อง').optional().or(z.literal('')),
  uidLabel: z.string().max(50, 'ป้ายกำกับ UID ต้องไม่เกิน 50 ตัวอักษร').default('UID'),
  isActive: z.boolean().default(true),
});

// Product Schema
export const productSchema = z.object({
  gameId: z.string().min(1, 'กรุณาเลือกเกม'),
  title: z.string().min(1, 'กรุณากรอกชื่อสินค้า').max(200, 'ชื่อสินค้าต้องไม่เกิน 200 ตัวอักษร'),
  description: z.string().optional(),
  rank: z.string().max(100, 'แรงค์ต้องไม่เกิน 100 ตัวอักษร').optional(),
  skinsCount: z.number().int().min(0, 'จำนวนสกินต้องเป็นจำนวนเต็มบวก').default(0),
  price: z.number().min(0.01, 'ราคาต้องมากกว่า 0'),
  images: z.array(z.string().url('กรุณากรอก URL รูปภาพที่ถูกต้อง')).optional(),
  accountData: z.object({
    username: z.string().optional(),
    password: z.string().optional(),
    email: z.string().email().optional(),
    additionalInfo: z.string().optional(),
  }).optional(),
});

// Order Schemas
export const topupOrderSchema = z.object({
  gameId: z.string().min(1, 'กรุณาเลือกเกม'),
  gameUid: z.string().min(1, 'กรุณากรอก UID เกม').max(100, 'UID เกมต้องไม่เกิน 100 ตัวอักษร'),
  amount: z.number().min(1, 'จำนวนเงินต้องมากกว่า 0'),
});

export const purchaseOrderSchema = z.object({
  productIds: z.array(z.string().min(1, 'Product ID ไม่ถูกต้อง')).min(1, 'กรุณาเลือกสินค้า'),
});

// Slip Upload Schema
export const slipUploadSchema = z.object({
  orderId: z.string().min(1, 'Order ID ไม่ถูกต้อง'),
  file: z.any().refine((file) => {
    if (typeof window === 'undefined') return true; // Skip validation on server
    return file instanceof File;
  }, 'กรุณาเลือกไฟล์'),
});

// Admin Schemas
export const adminUserUpdateSchema = z.object({
  name: z.string()
    .min(3, 'Username ต้องมีอย่างน้อย 3 ตัวอักษร')
    .max(20, 'Username ต้องไม่เกิน 20 ตัวอักษร')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username ใช้ได้เฉพาะ a-z, A-Z, 0-9 และ _ เท่านั้น'),
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง'),
  points: z.number().min(0, 'จำนวนพ้อยต้องไม่ติดลบ'),
  role: z.enum(['user', 'admin'], {
    errorMap: () => ({ message: 'บทบาทต้องเป็น user หรือ admin' }),
  }),
});

export const orderStatusUpdateSchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled'], {
    errorMap: () => ({ message: 'สถานะคำสั่งซื้อไม่ถูกต้อง' }),
  }),
});

// File Upload Schema
export const fileUploadSchema = z.object({
  file: z.any().refine((file) => {
    if (typeof window === 'undefined') return true; // Skip validation on server
    return file instanceof File;
  }, 'กรุณาเลือกไฟล์'),
  type: z.enum(['slip', 'product-image', 'game-logo']).optional(),
});

// Search and Filter Schemas
export const productFilterSchema = z.object({
  gameId: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  rank: z.string().optional(),
  available: z.boolean().optional(),
  search: z.string().optional(),
});

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Bank Info Schema
export const bankInfoSchema = z.object({
  bankName: z.string().min(1, 'กรุณากรอกชื่อธนาคาร'),
  accountName: z.string().min(1, 'กรุณากรอกชื่อบัญชี'),
  accountNumber: z.string().min(1, 'กรุณากรอกเลขบัญชี'),
});

// Contact Form Schema
export const contactFormSchema = z.object({
  name: z.string().min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร'),
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง'),
  subject: z.string().min(1, 'กรุณากรอกหัวข้อ'),
  message: z.string().min(10, 'ข้อความต้องมีอย่างน้อย 10 ตัวอักษร'),
});

// Analytics Schema
export const analyticsFilterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  gameId: z.string().optional(),
  type: z.enum(['revenue', 'orders', 'users']).optional(),
});

// Validation Error Helper
export function getValidationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  return errors;
}

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
export type GameFormData = z.infer<typeof gameSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type TopupOrderData = z.infer<typeof topupOrderSchema>;
export type PurchaseOrderData = z.infer<typeof purchaseOrderSchema>;
export type SlipUploadData = z.infer<typeof slipUploadSchema>;
export type AdminUserUpdateData = z.infer<typeof adminUserUpdateSchema>;
export type OrderStatusUpdateData = z.infer<typeof orderStatusUpdateSchema>;
export type ProductFilterData = z.infer<typeof productFilterSchema>;
export type PaginationData = z.infer<typeof paginationSchema>;
export type BankInfoData = z.infer<typeof bankInfoSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type AnalyticsFilterData = z.infer<typeof analyticsFilterSchema>; 