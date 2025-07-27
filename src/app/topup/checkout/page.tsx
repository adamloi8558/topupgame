'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { BankInfo } from '@/components/topup/bank-info';
import { SlipUpload } from '@/components/topup/slip-upload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/hooks/use-auth';
import { useUIStore } from '@/stores/ui-store';
import { OrderWithDetails, ApiResponse } from '@/types';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';

export default function CheckoutPage() {
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout, requireAuth } = useAuth();
  const { addToast } = useUIStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');

  useEffect(() => {
    if (!requireAuth()) return;
    
    if (!orderId) {
      addToast({
        type: 'error',
        title: 'ไม่พบข้อมูลคำสั่งซื้อ',
        message: 'กรุณาสร้างคำสั่งซื้อใหม่',
      });
      router.push('/topup');
      return;
    }

    fetchOrder();
  }, [orderId, requireAuth, router, addToast]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/orders/${orderId}`);
      const result: ApiResponse<OrderWithDetails> = await response.json();

      if (result.success && result.data) {
        setOrder(result.data);
      } else {
        addToast({
          type: 'error',
          title: 'ไม่พบคำสั่งซื้อ',
          message: 'คำสั่งซื้อไม่ถูกต้องหรือหมดอายุ',
        });
        router.push('/topup');
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้',
      });
      router.push('/topup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    addToast({
      type: 'success',
      title: 'เติมพ้อยสำเร็จ! 🎉',
      message: 'ขอบคุณที่ใช้บริการ',
      duration: 5000,
    });
    
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-gaming">
        <Header user={user} onLogout={logout} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" color="neon" />
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
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500">ไม่พบคำสั่งซื้อ</h1>
            <Button
              onClick={() => router.push('/topup')}
              className="mt-4"
              variant="gaming"
            >
              กลับไปหน้าเติมพ้อย
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (order.status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-neon-green" />;
      case 'processing':
        return <Clock className="h-6 w-6 text-neon-blue" />;
      default:
        return <Clock className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch (order.status) {
      case 'completed':
        return 'เติมพ้อยสำเร็จ';
      case 'processing':
        return 'กำลังตรวจสอบ';
      default:
        return 'รอการชำระเงิน';
    }
  };

  const getStatusColor = () => {
    switch (order.status) {
      case 'completed':
        return 'text-neon-green';
      case 'processing':
        return 'text-neon-blue';
      default:
        return 'text-yellow-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-gaming">
      <Header user={user} onLogout={logout} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/topup')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับไปหน้าเติมพ้อย
        </Button>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gradient">ชำระเงิน</h1>
            <p className="text-muted-foreground">
              โอนเงินและอัปโหลดสลิปเพื่อเติมพ้อย
            </p>
          </div>

          {/* Order Summary */}
          <Card gaming>
            <CardHeader>
              <CardTitle>สรุปคำสั่งเติมพ้อย</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">เกม</div>
                  <div className="font-semibold">{order.game?.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">UID เกม</div>
                  <div className="font-semibold font-mono">{order.gameUid}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">จำนวนเงิน</div>
                  <div className="font-semibold text-lg">฿{parseInt(order.amount).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">สถานะ</div>
                  <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
                    {getStatusIcon()}
                    <span className="font-semibold">{getStatusText()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Process */}
          {order.status === 'pending' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bank Info */}
              <div>
                <BankInfo amount={parseInt(order.amount)} />
              </div>

              {/* Slip Upload */}
              <div>
                <SlipUpload
                  orderId={order.id}
                  onUploadSuccess={handleUploadSuccess}
                />
              </div>
            </div>
          )}

          {order.status === 'processing' && (
            <Card gaming>
              <CardContent className="text-center py-8">
                <Clock className="h-16 w-16 text-neon-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neon-blue mb-2">
                  กำลังตรวจสอบสลิป
                </h3>
                <p className="text-muted-foreground">
                  ระบบกำลังตรวจสอบสลิปของคุณ กรุณารอสักครู่...
                </p>
              </CardContent>
            </Card>
          )}

          {order.status === 'completed' && (
            <Card gaming>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-neon-green mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neon-green mb-2">
                  เติมพ้อยสำเร็จ! 🎉
                </h3>
                <p className="text-muted-foreground mb-4">
                  พ้อยได้ถูกเติมเข้าบัญชีของคุณแล้ว
                </p>
                <Button
                  onClick={() => router.push('/')}
                  variant="gaming"
                >
                  กลับหน้าหลัก
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 