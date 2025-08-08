import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { AuthUser } from '@/types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-at-least-32-characters-long'
);

const TOKEN_EXPIRY = '7d';

// JWT Token Functions
export async function signToken(payload: AuthUser): Promise<string> {
  return await new SignJWT({
    id: payload.id,
    email: payload.email,
    name: payload.name,
    points: payload.points,
    role: payload.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(TOKEN_EXPIRY)
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      points: payload.points as string,
      role: payload.role as 'user' | 'admin',
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Password Functions
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Cookie Functions
export function getTokenFromCookies(cookies: string): string | null {
  const cookieArray = cookies.split(';');
  for (const cookie of cookieArray) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth-token') {
      return value;
    }
  }
  return null;
}

export function createAuthCookie(token: string): string {
  const isProduction = process.env.NODE_ENV === 'production';
  return `auth-token=${token}; HttpOnly; Secure=${isProduction}; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`;
}

export function clearAuthCookie(): string {
  return 'auth-token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/';
}

// Auth Middleware
export async function getAuthUser(request: Request): Promise<AuthUser | null> {
  try {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) return null;

    const token = getTokenFromCookies(cookieHeader);
    if (!token) return null;

    return await verifyToken(token);
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
}

export function requireAuth(user: AuthUser | null): AuthUser {
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export function requireAdmin(user: AuthUser | null): AuthUser {
  const authenticatedUser = requireAuth(user);
  if (authenticatedUser.role !== 'admin') {
    throw new Error('Admin access required');
  }
  return authenticatedUser;
}

// Session Management
export interface SessionData {
  user: AuthUser;
  expiresAt: number;
}

const sessions = new Map<string, SessionData>();

export function createSession(user: AuthUser): string {
  const sessionId = generateSessionId();
  const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
  
  sessions.set(sessionId, {
    user,
    expiresAt,
  });

  return sessionId;
}

export function getSession(sessionId: string): AuthUser | null {
  const session = sessions.get(sessionId);
  if (!session) return null;
  
  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId);
    return null;
  }
  
  return session.user;
}

export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId);
}

export function cleanupExpiredSessions(): void {
  const now = Date.now();
  for (const [sessionId, session] of Array.from(sessions.entries())) {
    if (now > session.expiresAt) {
      sessions.delete(sessionId);
    }
  }
}

function generateSessionId(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Rate Limiting
interface RateLimitData {
  count: number;
  resetTime: number;
}

const rateLimits = new Map<string, RateLimitData>();

export function checkRateLimit(
  identifier: string, 
  maxRequests: number = 10, 
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean {
  const now = Date.now();
  const limit = rateLimits.get(identifier);

  if (!limit || now > limit.resetTime) {
    rateLimits.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  if (limit.count >= maxRequests) {
    return false;
  }

  limit.count++;
  return true;
}

export function clearRateLimit(identifier: string): void {
  rateLimits.delete(identifier);
}

// Security Utilities
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('รหัสผ่านต้องมีตัวอักษรภาษาอังกฤษพิมพ์เล็ก');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('รหัสผ่านต้องมีตัวอักษรภาษาอังกฤษพิมพ์ใหญ่');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('รหัสผ่านต้องมีตัวเลข');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function generateSecureToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
} 