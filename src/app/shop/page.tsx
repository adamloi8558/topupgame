'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { ProductGrid } from '@/components/shop/product-grid';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { ProductFilters } from '@/types';

export default function ShopPage() {
  const [filters, setFilters] = useState<ProductFilters>({});

  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-gaming">
      <Header user={user} onLogout={logout} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">สินค้าแนะนำ</h1>
            <p className="text-muted-foreground">
              ไอดีเกมคุณภาพดี พร้อมเล่น ไอดีมีประกัน มือ 1 มือ 2 ครบจบที่เดียว!
            </p>
          </div>
          

        </div>

        <div className="w-full">
          <ProductGrid filters={filters} />
        </div>
      </div>
    </div>
  );
} 