import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

export function formatDateShort(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(d);
}

// Currency formatting
export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(num);
}

export function formatPoints(points: number | string): string {
  const num = typeof points === 'string' ? parseFloat(points) : points;
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(num) + ' พ้อย';
}

// String utilities
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/[-\s]/g, ''));
}

// File utilities
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

export function isImageFile(filename: string): boolean {
  const ext = getFileExtension(filename).toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
}

// Array utilities
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = (groups[item[key] as string] || []);
    group.push(item);
    groups[item[key] as string] = group;
    return groups;
  }, {} as Record<string, T[]>);
}

export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

// URL utilities
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value.toString());
    }
  });
  return searchParams.toString();
}

// Random utilities
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function generateSlug(): string {
  const adjectives = ['swift', 'brave', 'clever', 'mighty', 'silent'];
  const nouns = ['warrior', 'hunter', 'guardian', 'legend', 'hero'];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);
  return `${adjective}-${noun}-${number}`;
}

// Gaming utilities
export function getGameIconUrl(gameSlug: string): string {
  const iconMap: Record<string, string> = {
    'rov': '/game-icons/rov.png',
    'free-fire': '/game-icons/free-fire.png',
    'valorant': '/game-icons/valorant.png',
    'pubg': '/game-icons/pubg.png',
    'lol': '/game-icons/lol.png',
  };
  return iconMap[gameSlug] || '/game-icons/default.png';
}

export function getRankColor(rank: string): string {
  const rankColors: Record<string, string> = {
    'bronze': 'text-amber-600',
    'silver': 'text-gray-400',
    'gold': 'text-yellow-400',
    'platinum': 'text-cyan-400',
    'diamond': 'text-blue-400',
    'master': 'text-purple-400',
    'grandmaster': 'text-red-400',
    'challenger': 'text-neon-green',
  };
  return rankColors[rank.toLowerCase()] || 'text-gray-400';
}

// Status utilities
export function getOrderStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'pending': 'รอดำเนินการ',
    'processing': 'กำลังดำเนินการ',
    'completed': 'สำเร็จ',
    'failed': 'ล้มเหลว',
    'cancelled': 'ยกเลิก',
  };
  return statusMap[status] || status;
}

export function getOrderStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    'pending': 'text-yellow-400 bg-yellow-400/10',
    'processing': 'text-blue-400 bg-blue-400/10',
    'completed': 'text-neon-green bg-neon-green/10',
    'failed': 'text-red-400 bg-red-400/10',
    'cancelled': 'text-gray-400 bg-gray-400/10',
  };
  return colorMap[status] || 'text-gray-400 bg-gray-400/10';
}

// Local storage utilities
export function setLocalStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
}

export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
} 