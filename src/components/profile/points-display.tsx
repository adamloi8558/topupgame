'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Plus, History, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function PointsDisplay() {
  const { user } = useAuth();

  const formatPoints = (points: string | number) => {
    return new Intl.NumberFormat('th-TH').format(Number(points));
  };

  return (
    <Card gaming className="bg-gradient-to-r from-neon-green/10 to-neon-blue/10 border-neon-green/50">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Coins className="h-6 w-6 text-neon-green" />
          <span>ยอดพ้อยปัจจุบัน</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="space-y-2">
          <div className="text-4xl font-bold text-neon-green">
            {user ? formatPoints(user.points) : '0'}
          </div>
          <div className="text-lg text-muted-foreground">พ้อย</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="gaming" 
            size="lg" 
            className="flex items-center space-x-2"
            asChild
          >
            <Link href="/topup">
              <Plus className="h-4 w-4" />
              <span>เติมพ้อย</span>
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="flex items-center space-x-2"
            asChild
          >
            <Link href="/history">
              <History className="h-4 w-4" />
              <span>ประวัติ</span>
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="flex items-center space-x-2"
            asChild
          >
            <Link href="/shop">
              <TrendingUp className="h-4 w-4" />
              <span>ซื้อสินค้า</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 