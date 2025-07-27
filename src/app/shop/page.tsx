'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { ProductGrid } from '@/components/shop/product-grid';
import { ShopFilters } from '@/components/shop/shop-filters';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useCartStore } from '@/stores/cart-store';
import { ProductFilters } from '@/types';
import { ShoppingCart, Filter } from 'lucide-react';

export default function ShopPage() {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount, toggleCart } = useCartStore();

  return (
    <div className="min-h-screen bg-gradient-gaming">
      <Header user={user} onLogout={logout} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">ร้านไอดีเกม</h1>
            <p className="text-muted-foreground">
              ไอดีเกมคุณภาพดี พร้อมใช้งาน ราคาถูก
            </p>
          </div>
          
          {/* Cart Button */}
          <Button
            onClick={toggleCart}
            variant="gaming"
            className="relative"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            ตะกร้า
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-neon-green text-gaming-dark text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ShopFilters
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductGrid filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
} 