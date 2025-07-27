# Project Structure - เว็บเติมเกม/ขายไอดีเกม

## โครงสร้างโปรเจ็ค

```
topupgame/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth routes group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/              # Protected dashboard routes
│   │   │   ├── admin/
│   │   │   │   ├── orders/
│   │   │   │   ├── products/
│   │   │   │   ├── users/
│   │   │   │   └── analytics/
│   │   │   ├── profile/
│   │   │   └── history/
│   │   ├── topup/                    # Top-up pages
│   │   │   ├── [game]/
│   │   │   └── checkout/
│   │   ├── shop/                     # Shop pages
│   │   │   ├── [category]/
│   │   │   ├── product/[id]/
│   │   │   └── cart/
│   │   ├── api/                      # API routes
│   │   │   ├── auth/
│   │   │   ├── easyslip/
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   ├── upload/
│   │   │   └── users/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/                   # React components
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── auth/
│   │   ├── shop/
│   │   ├── dashboard/
│   │   └── forms/
│   ├── lib/                          # Utilities & config
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── utils.ts
│   │   ├── validations.ts
│   │   └── constants.ts
│   ├── hooks/                        # Custom React hooks
│   ├── types/                        # TypeScript definitions
│   └── styles/                       # Additional CSS files
├── drizzle/                          # Database migrations
├── public/                           # Static assets
├── .env.local                        # Environment variables
├── package.json
├── tailwind.config.js
├── drizzle.config.ts
└── next.config.js
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(100) NOT NULL,
  points DECIMAL(10,2) DEFAULT 0.00,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
);
```

### Games Table
```sql
CREATE TABLE games (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  logo_url VARCHAR(255),
  uid_label VARCHAR(50) DEFAULT 'UID',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Products Table (Game Accounts)
```sql
CREATE TABLE products (
  id VARCHAR(36) PRIMARY KEY,
  game_id VARCHAR(36) REFERENCES games(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  rank VARCHAR(100),
  skins_count INT DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  images JSON,                        -- Array of image URLs
  account_data JSON,                  -- Login credentials (encrypted)
  is_sold BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES users(id),
  type ENUM('topup', 'purchase') NOT NULL,
  status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  amount DECIMAL(10,2) NOT NULL,
  points_earned DECIMAL(10,2) DEFAULT 0,
  game_uid VARCHAR(100),              -- For topup orders
  game_id VARCHAR(36) REFERENCES games(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) REFERENCES orders(id),
  product_id VARCHAR(36) REFERENCES products(id),
  price DECIMAL(10,2) NOT NULL,
  delivered_data JSON,                -- Account credentials delivered
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Slips Table
```sql
CREATE TABLE slips (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) REFERENCES orders(id),
  file_url VARCHAR(255) NOT NULL,
  file_name VARCHAR(255),
  easyslip_data JSON,                 -- Response from EasySlip API
  status ENUM('pending', 'verified', 'rejected', 'duplicate') DEFAULT 'pending',
  error_message TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  verified_at TIMESTAMP NULL
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES users(id),
  type ENUM('topup', 'purchase', 'refund') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  points_before DECIMAL(10,2) NOT NULL,
  points_after DECIMAL(10,2) NOT NULL,
  reference_id VARCHAR(36),          -- order_id or slip_id
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Admin Settings Table
```sql
CREATE TABLE admin_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW() ON UPDATE NOW()
);
```

## API Endpoints

### Authentication APIs
```
POST /api/auth/register          # User registration
POST /api/auth/login            # User login
POST /api/auth/logout           # User logout
GET  /api/auth/me               # Get current user
```

### User Management APIs
```
GET  /api/users/profile         # Get user profile
PUT  /api/users/profile         # Update user profile
GET  /api/users/points          # Get user points balance
GET  /api/users/transactions    # Get transaction history
```

### Games APIs
```
GET  /api/games                 # Get all active games
GET  /api/games/[slug]          # Get game details
```

### Products APIs
```
GET  /api/products              # Get products (with filters)
GET  /api/products/[id]         # Get product details
GET  /api/products/categories   # Get product categories
```

### Orders APIs
```
POST /api/orders/topup          # Create top-up order
POST /api/orders/purchase       # Create purchase order
GET  /api/orders                # Get user orders
GET  /api/orders/[id]           # Get order details
PUT  /api/orders/[id]/cancel    # Cancel order
```

### Payment & Slip APIs
```
POST /api/slips/upload          # Upload payment slip
POST /api/slips/verify          # Verify slip with EasySlip API
GET  /api/slips/[id]            # Get slip details
```

### File Upload APIs
```
POST /api/upload/image          # Upload image to Cloudflare R2
DELETE /api/upload/[filename]   # Delete uploaded file
```

### Admin APIs
```
GET  /api/admin/orders          # Get all orders
PUT  /api/admin/orders/[id]     # Update order status
GET  /api/admin/users           # Get all users
PUT  /api/admin/users/[id]      # Update user details
GET  /api/admin/products        # Get all products
POST /api/admin/products        # Create new product
PUT  /api/admin/products/[id]   # Update product
DELETE /api/admin/products/[id] # Delete product
GET  /api/admin/analytics       # Get sales analytics
```

### EasySlip Integration APIs
```
POST /api/easyslip/verify       # Verify slip with EasySlip
GET  /api/easyslip/status/[id]  # Check verification status
```

## Component Structure

### Shared Components
```
components/
├── ui/                         # shadcn/ui base components
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── ...
├── layout/
│   ├── header.tsx
│   ├── footer.tsx
│   ├── navigation.tsx
│   └── sidebar.tsx
├── forms/
│   ├── login-form.tsx
│   ├── register-form.tsx
│   ├── topup-form.tsx
│   └── slip-upload-form.tsx
└── common/
    ├── loading-spinner.tsx
    ├── error-boundary.tsx
    └── toast-notifications.tsx
```

### Shop Components
```
components/shop/
├── product-card.tsx
├── product-grid.tsx
├── cart-item.tsx
├── checkout-form.tsx
└── filters/
    ├── game-filter.tsx
    ├── price-filter.tsx
    └── rank-filter.tsx
```

### Dashboard Components
```
components/dashboard/
├── admin/
│   ├── orders-table.tsx
│   ├── products-table.tsx
│   ├── users-table.tsx
│   └── analytics-charts.tsx
├── user/
│   ├── profile-form.tsx
│   ├── transaction-history.tsx
│   └── points-display.tsx
└── common/
    ├── stats-card.tsx
    └── data-table.tsx
```

## State Management

### Global State (Zustand)
```typescript
// stores/authStore.ts
interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updatePoints: (points: number) => void;
}

// stores/cartStore.ts
interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  total: number;
}
```

### Local State (React Query)
```typescript
// hooks/useOrders.ts
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders
  });
};

// hooks/useProducts.ts
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters)
  });
};
```

## Security Considerations

### Authentication Flow
1. JWT tokens stored in httpOnly cookies
2. Refresh token rotation
3. CSRF protection with Next.js built-in
4. Rate limiting on authentication endpoints

### File Upload Security
1. File type validation (whitelist)
2. File size limits (5MB max)
3. Virus scanning (optional)
4. Secure file naming (UUID)

### API Security
1. Input validation with Zod schemas
2. SQL injection prevention (ORM)
3. CORS configuration
4. Rate limiting per IP/user 