'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

interface SlipsStatsData {
  totalSlips: number;
  pendingSlips: number;
  verifiedSlips: number;
  rejectedSlips: number;
  totalAmount: number;
  todaySlips: number;
}

export function SlipsStats() {
  const [stats, setStats] = useState<SlipsStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/admin/slips/stats');
      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch slips stats:', error);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
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
      title: 'สลิปทั้งหมด',
      value: formatNumber(stats.totalSlips),
      icon: FileText,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'รอตรวจสอบ',
      value: formatNumber(stats.pendingSlips),
      icon: Clock,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'อนุมัติแล้ว',
      value: formatNumber(stats.verifiedSlips),
      icon: CheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'ปฏิเสธแล้ว',
      value: formatNumber(stats.rejectedSlips),
      icon: XCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card gaming>
          <CardHeader>
            <CardTitle className="text-lg">ยอดเงินรวม</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-neon-green">
              {formatCurrency(stats.totalAmount)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              จากสลิปที่อนุมัติแล้ว
            </p>
          </CardContent>
        </Card>

        <Card gaming>
          <CardHeader>
            <CardTitle className="text-lg">สลิปวันนี้</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-neon-blue">
              {formatNumber(stats.todaySlips)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              สลิปที่อัพโหลดวันนี้
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 