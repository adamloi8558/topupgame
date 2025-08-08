'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ShoppingCart, TrendingUp } from 'lucide-react';

interface OrderData {
  date: string;
  topup: number;
  purchase: number;
  total: number;
}

export function OrdersChart() {
  const [data, setData] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    fetchOrdersData();
  }, [timeRange]);

  const fetchOrdersData = async () => {
    try {
      setIsLoading(true);
      
      // Mock data
      setTimeout(() => {
        const mockData: OrderData[] = [];
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          
          const topup = Math.floor(Math.random() * 30) + 5;
          const purchase = Math.floor(Math.random() * 20) + 3;
          
          mockData.push({
            date: date.toISOString().split('T')[0],
            topup,
            purchase,
            total: topup + purchase,
          });
        }
        
        setData(mockData);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch orders data:', error);
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('th-TH', {
      month: 'short',
      day: 'numeric',
    });
  };

  const totalOrders = data.reduce((sum, item) => sum + item.total, 0);
  const totalTopup = data.reduce((sum, item) => sum + item.topup, 0);
  const totalPurchase = data.reduce((sum, item) => sum + item.purchase, 0);

  const maxOrders = Math.max(...data.map(d => d.total));

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
          <ShoppingCart className="h-5 w-5" />
          <span>คำสั่งซื้อตามช่วงเวลา</span>
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
            <div className="text-sm text-muted-foreground">คำสั่งซื้อรวม</div>
            <div className="text-lg font-bold text-neon-blue">
              {totalOrders} รายการ
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">เติมพ้อย</div>
            <div className="text-lg font-bold text-green-500">
              {totalTopup} รายการ
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">ซื้อสินค้า</div>
            <div className="text-lg font-bold text-purple-500">
              {totalPurchase} รายการ
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
                <div className="flex items-center space-x-2 mb-1">
                  <div 
                    className="bg-gradient-to-r from-neon-blue to-purple-500 h-2 rounded-full"
                    style={{ 
                      width: `${(item.total / maxOrders) * 100}%`,
                      minWidth: '2px'
                    }}
                  />
                  <div className="text-sm font-semibold">
                    {item.total} รายการ
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                    เติมพ้อย: {item.topup}
                  </span>
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-1" />
                    ซื้อสินค้า: {item.purchase}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 