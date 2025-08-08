import { User, Game, Product, Order, OrderItem, Slip, Transaction } from '@/lib/db/schema';
import { ProfileUpdateData, ChangePasswordData } from '@/lib/validations';

// Re-export database types
export type { User, Game, Product, Order, OrderItem, Slip, Transaction };

// Re-export validation types
export type { ProfileUpdateData, ChangePasswordData };

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  points: string;
  role: 'user' | 'admin';
}

// Order Types
export interface TopupOrderData {
  gameId: string;
  gameUid: string;
  amount: number;
}

export interface PurchaseOrderData {
  productIds: string[];
}

export interface OrderWithDetails extends Order {
  user?: User;
  game?: Game;
  orderItems?: (OrderItem & {
    product?: Product;
  })[];
  slips?: Slip[];
}

// Product Types
export interface ProductWithGame extends Product {
  game?: Game;
}

export interface ProductFilters {
  gameId?: string;
  minPrice?: number;
  maxPrice?: number;
  rank?: string;
  available?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Cart Types
export interface CartItem {
  id: string;
  title: string;
  price: string;
  image: string;
  gameId: string | null;
  gameName: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

// Slip Types
export interface SlipUploadData {
  file: File;
  orderId: string;
}

export interface EasySlipResponse {
  success: boolean;
  data?: {
    amount: {
      amount: number;
      currency: string;
    };
    sender: {
      account: {
        name: string;
        bank: string;
      };
    };
    receiver: {
      account: {
        name: string;
        bank: string;
      };
    };
    transactionDate: string;
    transactionId: string;
  };
  message?: string;
  duplicate?: boolean;
}

// Analytics Types
export interface SalesAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  revenueByDay: {
    date: string;
    revenue: number;
  }[];
  topGames: {
    gameId: string;
    gameName: string;
    revenue: number;
    orders: number;
  }[];
  ordersByStatus: {
    status: string;
    count: number;
  }[];
}

// Bank Info Types
export interface BankInfo {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

// Notification Types
export interface NotificationData {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// File Upload Types
export interface FileUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

// Form States
export interface FormState {
  loading: boolean;
  error?: string;
  success?: boolean;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Search Types
export interface SearchParams {
  query?: string;
  category?: string;
  filters?: Record<string, any>;
} 