'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Users, UserPlus, Crown, DollarSign } from 'lucide-react';

interface UserStats {
  total: number;
  newThisMonth: number;
  admins: number;
  totalPoints: number;
}

export function UsersStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setIsLoading(true);
      
      // Mock data
      setTimeout(() => {
        setStats({
          total: 1248,
          newThisMonth: 89,
          admins: 3,
          totalPoints: 2845600,
        });
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('th-TH').format(num);
  };

  const statsCards = [
    {
      title: 'ผู้ใช้งานทั้งหมด',
      value: stats?.total || 0,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'สมาชิกใหม่เดือนนี้',
      value: stats?.newThisMonth || 0,
      icon: UserPlus,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'ผู้ดูแลระบบ',
      value: stats?.admins || 0,
      icon: Crown,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'พ้อยทั้งหมดในระบบ',
      value: stats?.totalPoints || 0,
      icon: DollarSign,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
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