'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Trophy, TrendingUp } from 'lucide-react';

interface TopProduct {
  id: string;
  title: string;
  game: string;
  rank: string;
  sales: number;
  revenue: number;
}

export function TopProducts() {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/analytics');
      const json = await res.json();
      if (json.success && json.data?.topProducts) {
        setProducts(json.data.topProducts);
      } else {
        setProducts([]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch top products:', error);
      setIsLoading(false);
    }
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return 'text-yellow-500'; // Gold
      case 1: return 'text-gray-400';   // Silver
      case 2: return 'text-amber-600';  // Bronze
      default: return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card gaming>
        <CardContent className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card gaming>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5" />
          <span>สินค้าขายดี</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={product.id} className="flex items-center space-x-3 p-3 rounded-lg bg-background/50">
              <div className={`text-xl font-bold ${getRankColor(index)}`}>
                #{index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{product.title}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {product.game}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {product.rank}
                  </Badge>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-neon-green">
                  {formatCurrency(product.revenue)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {product.sales} ขาย
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 