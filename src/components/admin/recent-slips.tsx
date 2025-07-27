'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CreditCard, Clock, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import Link from 'next/link';

interface RecentSlip {
  id: string;
  orderId: string;
  userName: string;
  amount: number;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
}

export function RecentSlips() {
  const [slips, setSlips] = useState<RecentSlip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentSlips();
  }, []);

  const fetchRecentSlips = async () => {
    try {
      setIsLoading(true);
      
      // Mock data for now
      setTimeout(() => {
        setSlips([
          {
            id: 'SLIP-001',
            orderId: 'ORD-001',
            userName: 'นายสมชาย ใจดี',
            amount: 500,
            status: 'verified',
            createdAt: '2024-01-26T10:30:00Z',
          },
          {
            id: 'SLIP-002',
            orderId: 'ORD-002',
            userName: 'นางสาวสมใส รักเกม',
            amount: 1200,
            status: 'pending',
            createdAt: '2024-01-26T09:15:00Z',
          },
          {
            id: 'SLIP-003',
            orderId: 'ORD-003',
            userName: 'นายเกมเมอร์ โปร',
            amount: 300,
            status: 'pending',
            createdAt: '2024-01-26T08:45:00Z',
          },
          {
            id: 'SLIP-004',
            orderId: 'ORD-004',
            userName: 'นางเล่นเกม มาก',
            amount: 800,
            status: 'rejected',
            createdAt: '2024-01-26T08:00:00Z',
          },
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch recent slips:', error);
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            ตรวจสอบแล้ว
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            รอตรวจสอบ
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            ปฏิเสธ
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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

  const pendingCount = slips.filter(slip => slip.status === 'pending').length;

  return (
    <Card gaming>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>สลิปการโอนล่าสุด</span>
          {pendingCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {pendingCount} รอตรวจ
            </Badge>
          )}
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/slips">
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
            {slips.map((slip) => (
              <div key={slip.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{slip.id}</span>
                    {getStatusBadge(slip.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {slip.userName} • {slip.orderId}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(slip.createdAt)}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="font-bold">฿{formatAmount(slip.amount)}</div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/slips/${slip.id}`}>
                      <Eye className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pendingCount > 0 && (
          <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <div className="flex items-center space-x-2 text-orange-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                มีสลิป {pendingCount} รายการรอการตรวจสอบ
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 