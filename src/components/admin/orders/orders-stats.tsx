'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';

interface OrderStats {
  total: number;
  pending: number;
  completed: number;
  failed: number;
  todayRevenue: number;
}

export function OrdersStats() {
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrderStats();
  }, []);

  const fetchOrderStats = async () => {
    try {
      setIsLoading(true);
      
      // Mock data
      setTimeout(() => {
        setStats({
          total: 3567,
          pending: 23,
          completed: 3489,
          failed: 55,
          todayRevenue: 45650,
        });
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch order stats:', error);
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('th-TH').format(num);
  };

  const statsCards = [
    {
      title: 'คำสั่งซื้อทั้งหมด',
      value: stats?.total || 0,
      icon: DollarSign,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'รอดำเนินการ',
      value: stats?.pending || 0,
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'สำเร็จแล้ว',
      value: stats?.completed || 0,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'ล้มเหลว',
      value: stats?.failed || 0,
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
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
              <div className="text-2xl font-bold">
                {formatNumber(stat.value)}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 