'use client';

import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useUIStore } from '@/stores/ui-store';
import { CheckCircle, Clock, XCircle, ArrowLeft } from 'lucide-react';

const BankInfo = dynamic(() => import('@/components/topup/bank-info').then(mod => mod.BankInfo), { ssr: false });
const SlipUpload = dynamic(() => import('@/components/topup/slip-upload').then(mod => mod.SlipUpload), { ssr: false });

interface Order {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  type: 'topup' | 'purchase';
  pointsEarned: number;
  createdAt: string;
}

export default function CheckoutPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId') || '';
  const { user, logout } = useAuth();
  const { addToast } = useUIStore();

  useEffect(() => {
    if (!orderId) {
      addToast({
        type: 'error',
        title: 'ไม่พบข้อมูลคำสั่งซื้อ',
        message: 'กรุณาเริ่มต้นใหม่',
      });
      router.push('/topup');
      return;
    }

    fetchOrder();
  }, [orderId, addToast, router]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth');
        return;
      }

      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setOrder(result.order);
      } else {
        addToast({
          type: 'error',
          title: 'ไม่พบคำสั่งซื้อ',
          message: result.error || 'คำสั่งซื้อไม่ถูกต้อง',
        });
        router.push('/topup');
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="h-4 w-4" />,
          label: 'รอชำระเงิน',
          variant: 'default' as const,
          color: 'text-yellow-500'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          label: 'ชำระเงินแล้ว',
          variant: 'default' as const,
          color: 'text-green-500'
        };
      case 'failed':
        return {
          icon: <XCircle className="h-4 w-4" />,
          label: 'ชำระเงินไม่สำเร็จ',
          variant: 'destructive' as const,
          color: 'text-red-500'
        };
      case 'cancelled':
        return {
          icon: <XCircle className="h-4 w-4" />,
          label: 'ยกเลิกแล้ว',
          variant: 'secondary' as const,
          color: 'text-gray-500'
        };
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          label: 'ไม่ทราบสถานะ',
          variant: 'secondary' as const,
          color: 'text-gray-500'
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-gaming">
        <Header user={user} onLogout={logout} />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card gaming>
              <CardContent className="flex items-center justify-center py-12">
                <LoadingSpinner />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-gaming">
        <Header user={user} onLogout={logout} />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card gaming>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">ไม่พบข้อมูลคำสั่งซื้อ</p>
                <Button
                  variant="gaming"
                  onClick={() => router.push('/topup')}
                  className="mt-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  กลับหน้าเติมพ้อย
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="min-h-screen bg-gradient-gaming">
      <Header user={user} onLogout={logout} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Order Info */}
          <Card gaming>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>ข้อมูลคำสั่งซื้อ</CardTitle>
                  <CardDescription>หมายเลขคำสั่งซื้อ: {order.id}</CardDescription>
                </div>
                <Badge variant={statusInfo.variant} className="flex items-center gap-1">
                  <span className={statusInfo.color}>{statusInfo.icon}</span>
                  {statusInfo.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gaming-darker p-4 rounded-lg border border-neon-green/20">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">จำนวนเงิน:</span>
                  <span className="font-bold text-neon-green text-lg">
                    ฿{order.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-muted-foreground">พ้อยที่จะได้รับ:</span>
                  <span className="font-medium text-blue-300">
                    {order.pointsEarned.toLocaleString()} พ้อย
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Section */}
          {order.status === 'pending' && (
            <Card gaming>
              <CardHeader>
                <CardTitle>ชำระเงิน</CardTitle>
                <CardDescription>
                  โอนเงินและอัพโหลดสลิปเพื่อยืนยันการชำระเงิน
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<LoadingSpinner />}>
                  <BankInfo amount={order.amount} />
                  <SlipUpload orderId={order.id} onUploadSuccess={fetchOrder} />
                </Suspense>
              </CardContent>
            </Card>
          )}

          {/* Success/Error Messages */}
          {order.status === 'completed' && (
            <Card gaming className="border-green-500/20 bg-green-500/5">
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-500 mb-2">
                  ชำระเงินสำเร็จ!
                </h3>
                <p className="text-muted-foreground mb-4">
                  พ้อยได้ถูกเติมเข้าบัญชีของคุณแล้ว
                </p>
                <Button
                  variant="gaming"
                  onClick={() => router.push('/history')}
                >
                  ดูประวัติการทำรายการ
                </Button>
              </CardContent>
            </Card>
          )}

          {order.status === 'failed' && (
            <Card gaming className="border-red-500/20 bg-red-500/5">
              <CardContent className="text-center py-8">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-500 mb-2">
                  การชำระเงินไม่สำเร็จ
                </h3>
                <p className="text-muted-foreground mb-4">
                  กรุณาตรวจสอบสลิปและลองใหม่อีกครั้ง
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/topup')}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    เริ่มใหม่
                  </Button>
                  <Button
                    variant="gaming"
                    onClick={() => window.location.reload()}
                  >
                    ลองอีกครั้ง
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 