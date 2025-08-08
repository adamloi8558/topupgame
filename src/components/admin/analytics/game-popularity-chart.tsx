'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Gamepad2 } from 'lucide-react';

interface GamePopularity {
  game: string;
  orders: number;
  revenue: number;
  percentage: number;
}

export function GamePopularityChart() {
  const [data, setData] = useState<GamePopularity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGameData();
  }, []);

  const fetchGameData = async () => {
    try {
      setIsLoading(true);
      
      // Mock data
      setTimeout(() => {
        setData([
          { game: 'RoV', orders: 145, revenue: 125000, percentage: 45 },
          { game: 'VALORANT', orders: 89, revenue: 89500, percentage: 28 },
          { game: 'Free Fire', orders: 67, revenue: 56700, percentage: 18 },
          { game: 'PUBG Mobile', orders: 34, revenue: 28900, percentage: 9 },
        ]);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to fetch game data:', error);
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

  const getGameColor = (index: number) => {
    const colors = [
      'bg-neon-green',
      'bg-neon-blue', 
      'bg-purple-500',
      'bg-orange-500'
    ];
    return colors[index] || 'bg-gray-500';
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
          <Gamepad2 className="h-5 w-5" />
          <span>ความนิยมของเกม</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={item.game} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">{item.game}</div>
                <div className="text-sm text-muted-foreground">
                  {item.percentage}%
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getGameColor(index)}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{item.orders} คำสั่งซื้อ</span>
                <span>{formatCurrency(item.revenue)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 