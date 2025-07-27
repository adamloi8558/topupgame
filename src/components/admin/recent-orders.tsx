'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Receipt, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import Link from 'next/link';

interface RecentOrder {
  id: string;
  userId: string;
  userName: string;
  type: 'topup' | 'purchase';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export function RecentOrders() {
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      setIsLoading(true);
      
      // Mock data for now
      setTimeout(() => {
        setOrders([
          {
            id: 'ORD-001',
            userId: 'user-1',
            userName: 'นายสมชาย ใจดี',
            type: 'topup',
            amount: 500,
            status: 'completed',
            createdAt: '2024-01-26T10:30:00Z',
          },
          {
            id: 'ORD-002',
            userId: 'user-2',
            userName: 'นางสาวสมใส รักเกม',
            type: 'purchase',
            amount: 1200,
            status: 'pending',
            createdAt: '2024-01-26T09:15:00Z',
          },
          {
            id: 'ORD-003',
            userId: 'user-3',
            userName: 'นายเกมเมอร์ โปร',
            type: 'topup',
            amount: 300,
            status: 'completed',
            createdAt: '2024-01-26T08:45:00Z',
          },
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch recent orders:', error);
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            สำเร็จ
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            รอดำเนินการ
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            ไม่สำเร็จ
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeText = (type: string) => {
    return type === 'topup' ? 'เติมพ้อย' : 'ซื้อสินค้า';
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('th-TH').format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card gaming>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Receipt className="h-5 w-5" />
          <span>คำสั่งซื้อล่าสุด</span>
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/orders">
            ดูทั้งหมด
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="sm" />
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{order.id}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.userName} • {getTypeText(order.type)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="font-bold">฿{formatAmount(order.amount)}</div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/orders/${order.id}`}>
                      <Eye className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 