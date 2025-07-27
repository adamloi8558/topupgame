'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Activity, Plus, ShoppingCart, CreditCard } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'topup' | 'purchase' | 'slip_upload';
  user: string;
  description: string;
  amount?: number;
  timestamp: string;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      setIsLoading(true);
      
      // Mock data
      setTimeout(() => {
        setActivities([
          {
            id: '1',
            type: 'purchase',
            user: 'นายสมชาย ใจดี',
            description: 'ซื้อ RoV Diamond Account',
            amount: 2500,
            timestamp: '2024-01-26T11:30:00Z',
          },
          {
            id: '2',
            type: 'topup',
            user: 'นางสาวสมใส รักเกม',
            description: 'เติมพ้อย 500 บาท',
            amount: 500,
            timestamp: '2024-01-26T11:15:00Z',
          },
          {
            id: '3',
            type: 'slip_upload',
            user: 'นายเกมเมอร์ โปร',
            description: 'อัปโหลดสลิปการโอน',
            timestamp: '2024-01-26T11:00:00Z',
          },
          {
            id: '4',
            type: 'purchase',
            user: 'นางเล่นเกม มาก',
            description: 'ซื้อ VALORANT Immortal Account',
            amount: 3500,
            timestamp: '2024-01-26T10:45:00Z',
          },
          {
            id: '5',
            type: 'topup',
            user: 'นายใหม่ มาเติม',
            description: 'เติมพ้อย 1000 บาท',
            amount: 1000,
            timestamp: '2024-01-26T10:30:00Z',
          },
        ]);
        setIsLoading(false);
      }, 700);
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'topup':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'purchase':
        return <ShoppingCart className="h-4 w-4 text-blue-500" />;
      case 'slip_upload':
        return <CreditCard className="h-4 w-4 text-orange-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'topup':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">เติมพ้อย</Badge>;
      case 'purchase':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">ซื้อสินค้า</Badge>;
      case 'slip_upload':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700">อัปโหลดสลิป</Badge>;
      default:
        return <Badge variant="outline">กิจกรรม</Badge>;
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'เพิ่งเกิดขึ้น';
    if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} วันที่แล้ว`;
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(num);
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
          <Activity className="h-5 w-5" />
          <span>กิจกรรมล่าสุด</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-background/50">
              <div className="mt-0.5">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  {getActivityBadge(activity.type)}
                  <span className="text-xs text-muted-foreground">
                    {formatTime(activity.timestamp)}
                  </span>
                </div>
                
                <div className="font-medium text-sm">{activity.user}</div>
                <div className="text-sm text-muted-foreground">
                  {activity.description}
                </div>
                
                {activity.amount && (
                  <div className="text-sm font-medium text-neon-green mt-1">
                    {formatCurrency(activity.amount)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 