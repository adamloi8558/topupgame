'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { ProductWithGame } from '@/types';
import { formatCurrency, getRankColor } from '@/lib/utils';
import { Star, Crown, Gamepad2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: ProductWithGame;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [imageLoading, setImageLoading] = useState(true);

  const { isAuthenticated } = useAuthStore();
  const { addToast } = useUIStore();

  const handleProductClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      addToast({
        type: 'warning',
        title: 'กรุณาเข้าสู่ระบบ',
        message: 'คุณต้องเข้าสู่ระบบก่อนดูรายละเอียดสินค้า',
      });
      return;
    }

    if (product.isSold) {
      addToast({
        type: 'error',
        title: 'สินค้าหมด',
        message: 'สินค้านี้ถูกขายแล้ว',
      });
      return;
    }

    // Redirect to product page
    window.location.href = `/shop/product/${product.id}`;
  };

  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/placeholder-game-account.jpg';

  return (
    <div onClick={handleProductClick} className="cursor-pointer">
      <Card className={cn('card-gaming group h-full', className)}>
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          <Image
            src={mainImage}
            alt={product.title}
            fill
            className={cn(
              'object-cover transition-all duration-300 group-hover:scale-105',
              imageLoading ? 'blur-sm' : 'blur-0'
            )}
            onLoad={() => setImageLoading(false)}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Status Badge */}
          {product.isSold ? (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              ขายแล้ว
            </div>
          ) : (
            <div className="absolute top-2 right-2 bg-neon-green text-gaming-dark px-2 py-1 rounded text-xs font-semibold">
              พร้อมขาย
            </div>
          )}


        </div>

        <CardHeader className="p-0 px-3 pt-3 pb-2">
          <div className="flex items-center space-x-2 mb-2 bg-gaming-dark/30 w-fit px-2 py-1 rounded">
            <Gamepad2 className="h-4 w-4 text-neon-blue" />
            <span className="text-sm text-neon-blue font-medium">{product.game?.name}</span>
          </div>
          
          <CardTitle className="line-clamp-2 text-base mb-2 font-bold">{product.title}</CardTitle>
        </CardHeader>

        <CardContent className="p-0 px-3 pb-3">
          {/* Description */}
          <CardDescription className="line-clamp-2 mb-3 text-sm">
            {product.description || 'ไอดีเกมคุณภาพดี พร้อมใช้งาน'}
          </CardDescription>

          {/* Price */}
          <div className="space-y-2">
            <div>
              <div className="text-2xl font-bold text-neon-green">
                {formatCurrency(parseFloat(product.price))}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {product.skinsCount && product.skinsCount > 0 && (
                  <span className="inline-flex items-center">
                    <Star className="h-3 w-3 text-yellow-500 mr-1" />
                    สกิน {product.skinsCount}+ ชิ้น
                  </span>
                )}
                {product.rank && (
                  <span className="inline-flex items-center">
                    <Crown className={cn('h-3 w-3 mr-1', getRankColor(product.rank))} />
                    <span className={cn('text-xs', getRankColor(product.rank))}>
                      {product.rank}
                    </span>
                  </span>
                )}
              </div>
            </div>
            
            {!product.isSold && (
              <Button
                variant="gaming"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleProductClick(e);
                }}
                className="hover:scale-[1.02] transition-transform"
              >
                ซื้อสินค้า
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 