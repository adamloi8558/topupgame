'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export function RevenueChart() {
  const [data, setData] = useState<RevenueData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    fetchRevenueData();
  }, [timeRange]);

  const fetchRevenueData = async () => {
    try {
      setIsLoading(true);
      
      // Mock data
      setTimeout(() => {
        const mockData: RevenueData[] = [];
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          
          mockData.push({
            date: date.toISOString().split('T')[0],
            revenue: Math.floor(Math.random() * 50000) + 10000,
            orders: Math.floor(Math.random() * 50) + 5,
          });
        }
        
        setData(mockData);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch revenue data:', error);
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('th-TH', {
      month: 'short',
      day: 'numeric',
    });
  };

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);
  const averageRevenue = data.length > 0 ? totalRevenue / data.length : 0;

  const maxRevenue = Math.max(...data.map(d => d.revenue));

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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>รายได้ตามช่วงเวลา</span>
        </CardTitle>
        <div className="flex space-x-2">
          <Button
            variant={timeRange === '7d' ? 'gaming' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('7d')}
          >
            7 วัน
          </Button>
          <Button
            variant={timeRange === '30d' ? 'gaming' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('30d')}
          >
            30 วัน
          </Button>
          <Button
            variant={timeRange === '90d' ? 'gaming' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('90d')}
          >
            90 วัน
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">รายได้รวม</div>
            <div className="text-lg font-bold text-neon-green">
              {formatCurrency(totalRevenue)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">คำสั่งซื้อรวม</div>
            <div className="text-lg font-bold">
              {totalOrders} รายการ
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">เฉลี่ยต่อวัน</div>
            <div className="text-lg font-bold">
              {formatCurrency(averageRevenue)}
            </div>
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-16 text-xs text-muted-foreground">
                {formatDate(item.date)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <div 
                    className="bg-gradient-to-r from-neon-green to-neon-blue h-3 rounded-full"
                    style={{ 
                      width: `${(item.revenue / maxRevenue) * 100}%`,
                      minWidth: '2px'
                    }}
                  />
                  <div className="text-sm font-mono">
                    {formatCurrency(item.revenue)}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {item.orders} คำสั่งซื้อ
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 