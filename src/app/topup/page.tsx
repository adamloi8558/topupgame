'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/hooks/use-auth';
import { useUIStore } from '@/stores/ui-store';
import { Wallet, Upload, Copy, CheckCircle, Banknote } from 'lucide-react';
import { z } from 'zod';

const walletTopupSchema = z.object({
  slip: z.any()
    .refine((file) => file instanceof File, { message: 'กรุณาเลือกไฟล์สลิป' })
    .refine((file) => file?.size <= 5 * 1024 * 1024, { message: 'ไฟล์ต้องมีขนาดไม่เกิน 5MB' })
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file?.type),
      { message: 'รองรับเฉพาะไฟล์ภาพ (JPG, PNG, WEBP)' }
    ),
});

type WalletTopupData = z.infer<typeof walletTopupSchema>;

const BANK_INFO = {
  accountName: 'ฐาปนพงษ์ เดชยศดี',
  accountNumber: '6645533950',
  bankName: 'กรุงไทย',
};

export default function TopupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const { addToast } = useUIStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WalletTopupData>({
    resolver: zodResolver(walletTopupSchema),
  });

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      addToast({
        type: 'success',
        title: 'คัดลอกแล้ว',
        message: `คัดลอก${field}เรียบร้อยแล้ว`,
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถคัดลอกได้',
      });
    }
  };

  const onSubmit = async (data: WalletTopupData) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('slip', data.slip);

      const response = await fetch('/api/wallet/topup', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        addToast({
          type: 'success',
          title: 'อัพโหลดสลิปสำเร็จ',
          message: result.message || 'ระบบกำลังตรวจสอบสลิปของคุณ',
        });
        reset();
      } else {
        addToast({
          type: 'error',
          title: 'เกิดข้อผิดพลาด',
          message: result.error || 'ไม่สามารถอัพโหลดสลิปได้',
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
                โอนเงินเข้าบัญชีด้านล่าง แล้วอัพโหลดสลิปการโอนเงิน
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Bank Information */}
          <Card gaming className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Banknote className="h-5 w-5 text-neon-green" />
                <span>ข้อมูลบัญชีสำหรับโอนเงิน</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gaming-darker p-6 rounded-lg border border-neon-green/20">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">ธนาคาร:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{BANK_INFO.bankName}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(BANK_INFO.bankName, 'ชื่อธนาคาร')}
                      >
                        {copiedField === 'ชื่อธนาคาร' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">ชื่อบัญชี:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{BANK_INFO.accountName}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(BANK_INFO.accountName, 'ชื่อบัญชี')}
                      >
                        {copiedField === 'ชื่อบัญชี' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">เลขบัญชี:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-neon-green text-lg">
                        {BANK_INFO.accountNumber}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(BANK_INFO.accountNumber, 'เลขบัญชี')}
                      >
                        {copiedField === 'เลขบัญชี' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-300">
                  💡 <strong>วิธีการ:</strong> โอนเงินเข้าบัญชีข้างต้น จากนั้นอัพโหลดสลิปการโอนเงิน 
                  ระบบจะตรวจสอบและเติมพ้อยให้อัตโนมัติ
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Upload Slip */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card gaming>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-neon-green" />
                  <span>อัพโหลดสลิปการโอนเงิน</span>
                </CardTitle>
                <CardDescription>
                  เลือกไฟล์รูปภาพสลิปการโอนเงิน (JPG, PNG, WEBP)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">ไฟล์สลิป</label>
                  <Input
                    type="file"
                    accept="image/*"
                    gaming
                    {...register('slip')}
                    disabled={isLoading}
                  />
                  {errors.slip && (
                    <p className="text-sm text-red-500">{errors.slip.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="gaming"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" color="white" className="mr-2" />
                      กำลังอัพโหลด...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-2" />
                      อัพโหลดสลิป
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