'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  FileText,
  TrendingUp
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
      
      const response = await fetch('/api/admin/stats');
      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('th-TH').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} gaming>
            <CardContent className="flex items-center justify-center py-8">
              <LoadingSpinner size="sm" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} gaming>
            <CardContent className="flex items-center justify-center py-8 text-muted-foreground">
              ไม่สามารถโหลดข้อมูลได้
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsItems = [
    {
      title: 'ผู้ใช้ทั้งหมด',
      value: formatNumber(stats.totalUsers),
      icon: Users,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'คำสั่งซื้อ',
      value: formatNumber(stats.totalOrders),
      icon: ShoppingCart,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'รายได้',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'สินค้า',
      value: formatNumber(stats.totalProducts),
      icon: Package,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'สลิปรอตรวจ',
      value: formatNumber(stats.pendingSlips),
      icon: FileText,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'การเติบโต',
      value: `+${stats.monthlyGrowth.toFixed(1)}%`,
      icon: TrendingUp,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {statsItems.map((item, index) => (
        <Card key={index} gaming>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {item.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${item.bgColor}`}>
              <item.icon className={`h-4 w-4 ${item.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            {item.title === 'การเติบโต' && (
              <p className="text-xs text-muted-foreground">
                เทียบกับเดือนที่แล้ว
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 