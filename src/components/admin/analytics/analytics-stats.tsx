'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Calendar,
  ArrowUpIcon,
  ArrowDownIcon
} from 'lucide-react';

interface AnalyticsData {
  todayRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  todayOrders: number;
  monthlyOrders: number;
  ordersGrowth: number;
  activeUsers: number;
  userGrowth: number;
  averageOrderValue: number;
  avgOrderGrowth: number;
}

export function AnalyticsStats() {
  const [stats, setStats] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsStats();
  }, []);

  const fetchAnalyticsStats = async () => {
    try {
      setIsLoading(true);
      
      // Mock data
      setTimeout(() => {
        setStats({
          todayRevenue: 45650,
          monthlyRevenue: 1284500,
          revenueGrowth: 12.5,
          todayOrders: 23,
          monthlyOrders: 567,
          ordersGrowth: 8.3,
          activeUsers: 1248,
          userGrowth: 15.2,
          averageOrderValue: 850,
          avgOrderGrowth: -2.1,
        });
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch analytics stats:', error);
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('th-TH').format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const getGrowthIndicator = (growth: number) => {
    if (growth > 0) {
      return (
        <div className="flex items-center text-green-600">
          <ArrowUpIcon className="h-3 w-3 mr-1" />
          <span className="text-xs">+{growth.toFixed(1)}%</span>
        </div>
      );
    } else if (growth < 0) {
      return (
        <div className="flex items-center text-red-600">
          <ArrowDownIcon className="h-3 w-3 mr-1" />
          <span className="text-xs">{growth.toFixed(1)}%</span>
        </div>
      );
    }
    return <span className="text-xs text-muted-foreground">0%</span>;
  };

  const statsCards = [
    {
      title: 'รายได้วันนี้',
      value: stats?.todayRevenue || 0,
      growth: stats?.revenueGrowth || 0,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      format: 'currency',
      subtitle: `เดือนนี้: ${formatCurrency(stats?.monthlyRevenue || 0)}`,
    },
    {
      title: 'คำสั่งซื้อวันนี้',
      value: stats?.todayOrders || 0,
      growth: stats?.ordersGrowth || 0,
      icon: ShoppingCart,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      format: 'number',
      subtitle: `เดือนนี้: ${formatNumber(stats?.monthlyOrders || 0)} คำสั่ง`,
    },
    {
      title: 'ผู้ใช้งานที่ยังใช้งาน',
      value: stats?.activeUsers || 0,
      growth: stats?.userGrowth || 0,
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      format: 'number',
      subtitle: 'ผู้ใช้ที่เข้าใช้ 7 วันที่แล้ว',
    },
    {
      title: 'มูลค่าเฉลี่ยต่อคำสั่งซื้อ',
      value: stats?.averageOrderValue || 0,
      growth: stats?.avgOrderGrowth || 0,
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      format: 'currency',
      subtitle: 'เฉลี่ยรายการซื้อ',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {stat.format === 'currency' 
                      ? formatCurrency(stat.value)
                      : formatNumber(stat.value)
                    }
                  </div>
                  {getGrowthIndicator(stat.growth)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.subtitle}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 