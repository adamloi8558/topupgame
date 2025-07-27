'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Package,
  CreditCard
} from 'lucide-react';

interface AdminStatsData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingSlips: number;
  monthlyGrowth: number;
}

export function AdminStats() {
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      
      // Mock data for now
      setTimeout(() => {
        setStats({
          totalUsers: 1248,
          totalOrders: 3567,
          totalRevenue: 89450,
          totalProducts: 156,
          pendingSlips: 23,
          monthlyGrowth: 12.5,
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('th-TH').format(num);
  };

  const statsCards = [
    {
      title: 'ผู้ใช้งานทั้งหมด',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'คำสั่งซื้อทั้งหมด',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'รายได้ (บาท)',
      value: stats?.totalRevenue || 0,
      icon: DollarSign,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      prefix: '฿',
    },
    {
      title: 'สินค้าทั้งหมด',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'สลิปรอตรวจ',
      value: stats?.pendingSlips || 0,
      icon: CreditCard,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'เติบโตรายเดือน',
      value: stats?.monthlyGrowth || 0,
      icon: TrendingUp,
      color: 'text-neon-green',
      bgColor: 'bg-neon-green/10',
      suffix: '%',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="text-2xl font-bold">
                {stat.prefix}{formatNumber(stat.value)}{stat.suffix}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                อัปเดตล่าสุด: ตอนนี้
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 