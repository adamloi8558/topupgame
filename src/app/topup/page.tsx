'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/hooks/use-auth';
import { useUIStore } from '@/stores/ui-store';
import { Wallet, Plus, Banknote } from 'lucide-react';
import { z } from 'zod';

const topupOrderSchema = z.object({
  amount: z.string()
    .min(1, { message: 'กรุณาระบุจำนวนเงิน' })
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 100 && num <= 50000;
    }, { message: 'จำนวนเงินต้องอยู่ระหว่าง 100-50,000 บาท' }),
});

type TopupOrderData = z.infer<typeof topupOrderSchema>;

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

export default function TopupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useAuth();
  const { addToast } = useUIStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TopupOrderData>({
    resolver: zodResolver(topupOrderSchema),
  });

  const currentAmount = watch('amount');

  const handleQuickAmount = (amount: number) => {
    setValue('amount', amount.toString());
  };

  const onSubmit = async (data: TopupOrderData) => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/orders/topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(data.amount),
          type: 'wallet_topup',
        }),
      });

      const result = await response.json();

      if (result.success) {
        addToast({
          type: 'success',
          title: 'สร้างคำสั่งซื้อสำเร็จ',
          message: 'กำลังไปหน้าชำระเงิน',
        });
        
        // ไปหน้า checkout พร้อม orderId
        router.push(`/topup/checkout?orderId=${result.orderId}`);
      } else {
        addToast({
          type: 'error',
          title: 'เกิดข้อผิดพลาด',
          message: result.error || 'ไม่สามารถสร้างคำสั่งซื้อได้',
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-gaming">
      <Header user={user} onLogout={logout} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <Card gaming className="mb-8">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-neon-green/20 rounded-full">
                  <Wallet className="h-8 w-8 text-neon-green" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gradient">
                เติมพ้อยเข้ากระเป๋า
              </CardTitle>
              <CardDescription className="text-base">
                ระบุจำนวนเงินที่ต้องการเติม แล้วดำเนินการชำระเงิน
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Amount Selection */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card gaming className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-neon-green" />
                  <span>เลือกจำนวนเงินที่ต้องการเติม</span>
                </CardTitle>
                <CardDescription>
                  เลือกจำนวนที่กำหนดไว้ หรือระบุจำนวนเองได้
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Amount Buttons */}
                <div>
                  <label className="text-sm font-medium mb-3 block">จำนวนที่นิยม</label>
                  <div className="grid grid-cols-3 gap-3">
                    {QUICK_AMOUNTS.map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        variant={currentAmount === amount.toString() ? "gaming" : "outline"}
                        onClick={() => handleQuickAmount(amount)}
                        className="text-sm"
                      >
                        ฿{amount.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">จำนวนเงิน (บาท)</label>
                  <Input
                    type="number"
                    placeholder="ระบุจำนวนเงิน (100-50,000 บาท)"
                    gaming
                    {...register('amount')}
                    disabled={isLoading}
                    min={100}
                    max={50000}
                  />
                  {errors.amount && (
                    <p className="text-sm text-red-500">{errors.amount.message}</p>
                  )}
                </div>

                {/* Summary */}
                {currentAmount && !errors.amount && (
                  <div className="bg-gaming-darker p-4 rounded-lg border border-neon-green/20">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">จำนวนที่เติม:</span>
                      <span className="font-bold text-neon-green text-lg">
                        ฿{parseFloat(currentAmount || '0').toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-muted-foreground">พ้อยที่ได้รับ:</span>
                      <span className="font-medium text-blue-300">
                        {parseFloat(currentAmount || '0').toLocaleString()} พ้อย
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="gaming"
                  size="lg"
                  className="w-full"
                  disabled={isLoading || !currentAmount}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" color="white" className="mr-2" />
                      กำลังสร้างคำสั่งซื้อ...
                    </>
                  ) : (
                    <>
                      <Banknote className="h-5 w-5 mr-2" />
                      ดำเนินการชำระเงิน
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
} 