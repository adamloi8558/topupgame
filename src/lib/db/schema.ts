import { pgTable, varchar, decimal, timestamp, boolean, text, integer, json, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const orderTypeEnum = pgEnum('order_type', ['topup', 'purchase']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'processing', 'completed', 'failed', 'cancelled']);
export const slipStatusEnum = pgEnum('slip_status', ['pending', 'verified', 'rejected', 'duplicate']);
export const transactionTypeEnum = pgEnum('transaction_type', ['topup', 'purchase', 'refund']);

// Users Table
export const users = pgTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }),
  name: varchar('name', { length: 100 }).notNull(),
  points: decimal('points', { precision: 10, scale: 2 }).default('0.00'),
  role: userRoleEnum('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Games Table
export const games = pgTable('games', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 50 }).unique().notNull(),
  logoUrl: varchar('logo_url', { length: 255 }),
  uidLabel: varchar('uid_label', { length: 50 }).default('UID'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Products Table (Game Accounts)
export const products = pgTable('products', {
  id: varchar('id', { length: 36 }).primaryKey(),
  gameId: varchar('game_id', { length: 36 }).references(() => games.id),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  rank: varchar('rank', { length: 100 }),
  skinsCount: integer('skins_count').default(0),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  images: json('images').$type<string[]>(),
  accountData: json('account_data').$type<{
    username?: string;
    password?: string;
    email?: string;
    additionalInfo?: string;
  }>(),
  isSold: boolean('is_sold').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Orders Table
export const orders = pgTable('orders', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).references(() => users.id),
  type: orderTypeEnum('type').notNull(),
  status: orderStatusEnum('status').default('pending'),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  pointsEarned: decimal('points_earned', { precision: 10, scale: 2 }).default('0'),
  gameUid: varchar('game_uid', { length: 100 }),
  gameId: varchar('game_id', { length: 36 }).references(() => games.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Order Items Table
export const orderItems = pgTable('order_items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('order_id', { length: 36 }).references(() => orders.id),
  productId: varchar('product_id', { length: 36 }).references(() => products.id),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  deliveredData: json('delivered_data').$type<{
    username?: string;
    password?: string;
    email?: string;
    additionalInfo?: string;
  }>(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Slips Table
export const slips = pgTable('slips', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('order_id', { length: 36 }).references(() => orders.id),
  fileUrl: varchar('file_url', { length: 255 }).notNull(),
  fileName: varchar('file_name', { length: 255 }),
  easyslipData: json('easyslip_data').$type<{
    success?: boolean;
    data?: {
      amount?: {
        amount?: number;
        currency?: string;
      };
      sender?: {
        account?: {
          name?: string;
          bank?: string;
        };
      };
      receiver?: {
        account?: {
          name?: string;
          bank?: string;
        };
      };
      transactionDate?: string;
      transactionId?: string;
    };
    message?: string;
    duplicate?: boolean;
  }>(),
  status: slipStatusEnum('status').default('pending'),
  errorMessage: text('error_message'),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
  verifiedAt: timestamp('verified_at'),
});

// Transactions Table
export const transactions = pgTable('transactions', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).references(() => users.id),
  type: transactionTypeEnum('type').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  pointsBefore: decimal('points_before', { precision: 10, scale: 2 }).notNull(),
  pointsAfter: decimal('points_after', { precision: 10, scale: 2 }).notNull(),
  referenceId: varchar('reference_id', { length: 36 }),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Admin Settings Table
export const adminSettings = pgTable('admin_settings', {
  key: varchar('key', { length: 100 }).primaryKey(),
  value: text('value').notNull(),
  description: text('description'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  transactions: many(transactions),
}));

export const gamesRelations = relations(games, ({ many }) => ({
  products: many(products),
  orders: many(orders),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  game: one(games, {
    fields: [products.gameId],
    references: [games.id],
  }),
  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  game: one(games, {
    fields: [orders.gameId],
    references: [games.id],
  }),
  orderItems: many(orderItems),
  slips: many(slips),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const slipsRelations = relations(slips, ({ one }) => ({
  order: one(orders, {
    fields: [slips.orderId],
    references: [orders.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type Slip = typeof slips.$inferSelect;
export type NewSlip = typeof slips.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type AdminSetting = typeof adminSettings.$inferSelect;
export type NewAdminSetting = typeof adminSettings.$inferInsert; 