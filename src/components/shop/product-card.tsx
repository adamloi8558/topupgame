'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { ProductWithGame } from '@/types';
import { formatCurrency, getRankColor } from '@/lib/utils';
import { ShoppingCart, Eye, Star, Crown, Gamepad2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: ProductWithGame;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useUIStore();
 
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      addToast({
        type: 'warning',
        title: 'กรุณาเข้าสู่ระบบ',
        message: 'คุณต้องเข้าสู่ระบบก่อนเพิ่มสินค้าในตะกร้า',
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

    addItem(product);
    addToast({
      type: 'success',
      title: 'เพิ่มในตะกร้าแล้ว',
      message: `${product.title} ถูกเพิ่มในตะกร้าสินค้า`,
    });
  };

  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/placeholder-game-account.jpg';

  return (
    <Link href={`/shop/product/${product.id}`}>
      <Card className={cn('card-gaming group cursor-pointer h-full', className)}>
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

          {/* Quick Actions */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-2">
              <Button size="sm" variant="secondary" className="bg-white/90 text-gaming-dark hover:bg-white">
                <Eye className="h-4 w-4" />
              </Button>
              {!product.isSold && (
                <Button 
                  size="sm" 
                  variant="gaming"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-center space-x-2 mb-2">
            <Gamepad2 className="h-4 w-4 text-neon-blue" />
            <span className="text-sm text-neon-blue">{product.game?.name}</span>
          </div>
          
          <CardTitle className="line-clamp-2 text-lg">{product.title}</CardTitle>
          
          {product.rank && (
            <div className="flex items-center space-x-1">
              <Crown className={cn('h-4 w-4', getRankColor(product.rank))} />
              <span className={cn('text-sm font-semibold', getRankColor(product.rank))}>
                {product.rank}
              </span>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          {/* Description */}
          <CardDescription className="line-clamp-2 mb-3">
            {product.description || 'ไอดีเกมคุณภาพดี พร้อมใช้งาน'}
          </CardDescription>

          {/* Features */}
          <div className="space-y-2 mb-4">
            {product.skinsCount && product.skinsCount > 0 && (
              <div className="flex items-center space-x-2 text-sm">
                <Star className="h-3 w-3 text-yellow-500" />
                <span className="text-muted-foreground">
                  สกิน {product.skinsCount} ตัว
                </span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-neon-green">
                {formatCurrency(parseFloat(product.price))} พ้อย
              </div>
              <div className="text-xs text-muted-foreground">
                ≈ ฿{formatCurrency(parseFloat(product.price))}
              </div>
            </div>
            
            {!product.isSold && (
              <Button
                variant="gaming"
                size="sm"
                onClick={handleAddToCart}
                className="shrink-0"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                เพิ่ม
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 