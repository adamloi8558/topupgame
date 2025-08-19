import { z } from 'zod';

// Schema สำหรับ environment variables
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  
  // JWT & Auth
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  
  // Cloudflare R2
  CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().min(1, 'CLOUDFLARE_R2_ACCESS_KEY_ID is required'),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().min(1, 'CLOUDFLARE_R2_SECRET_ACCESS_KEY is required'),
  CLOUDFLARE_R2_BUCKET_NAME: z.string().min(1, 'CLOUDFLARE_R2_BUCKET_NAME is required'),
  CLOUDFLARE_R2_ACCOUNT_ID: z.string().min(1, 'CLOUDFLARE_R2_ACCOUNT_ID is required'),
  CLOUDFLARE_R2_PUBLIC_URL: z.string().url('CLOUDFLARE_R2_PUBLIC_URL must be a valid URL'),
  
  // EasySlip API
  EASYSLIP_ACCESS_TOKEN: z.string().min(1, 'EASYSLIP_ACCESS_TOKEN is required'),
  
  // App Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

// ฟังก์ชันสำหรับตรวจสอบ environment variables
export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      
      console.error('❌ Environment validation failed:');
      missingVars.forEach(msg => console.error(`   - ${msg}`));
      
      throw new Error(`Missing or invalid environment variables:\n${missingVars.join('\n')}`);
    }
    throw error;
  }
}

// ตรวจสอบ environment variables ที่จำเป็นสำหรับ build time
export function validateBuildTimeEnv() {
  const buildTimeVars = {
    NODE_ENV: process.env.NODE_ENV,
  };
  
  const buildSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  });
  
  try {
    return buildSchema.parse(buildTimeVars);
  } catch (error) {
    console.warn('⚠️ Build time environment validation failed:', error);
    return { NODE_ENV: 'development' as const };
  }
}

// Export validated environment (เฉพาะใน runtime)
let _env: Env | null = null;

export function getEnv(): Env {
  if (!_env) {
    _env = validateEnv();
  }
  return _env;
}

// สำหรับใช้ใน build time
export const buildEnv = validateBuildTimeEnv();