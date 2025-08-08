'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Package, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

interface ProductStats {
  total: number;
  available: number;
  sold: number;
  bestSeller: string;
}

export function ProductsStats() {
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProductStats();
  }, []);

  const fetchProductStats = async () => {
    try {
      setIsLoading(true);
      
      // Mock data
      setTimeout(() => {
        setStats({
          total: 156,
          available: 89,
          sold: 67,
          bestSeller: 'RoV Diamond Rank',
        });
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch product stats:', error);
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('th-TH').format(num);
  };

  const statsCards = [
    {
      title: 'สินค้าทั้งหมด',
      value: stats?.total || 0,
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'พร้อมขาย',
      value: stats?.available || 0,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'ขายแล้ว',
      value: stats?.sold || 0,
      icon: XCircle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'ขายดีที่สุด',
      value: stats?.bestSeller || 'ไม่มีข้อมูล',
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      isText: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} gaming>
            <CardContent className="flex items-center justify-center p-6">
              <LoadingSpinner size="sm" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <Card key={index} gaming>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`${stat.isText ? 'text-lg' : 'text-2xl'} font-bold`}>
                {stat.isText ? stat.value : formatNumber(stat.value as number)}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 