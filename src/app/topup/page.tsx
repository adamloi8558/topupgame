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
import { Wallet, CreditCard, Upload, Banknote, Copy, CheckCircle } from 'lucide-react';
import { z } from 'zod';

// Validation schema for wallet topup
const walletTopupSchema = z.object({
  amount: z.number().min(10, 'จำนวนเงินขั้นต่ำ 10 บาท').max(100000, 'จำนวนเงินสูงสุด 100,000 บาท'),
});

type WalletTopupData = z.infer<typeof walletTopupSchema>;

// Predefined amounts
const QUICK_AMOUNTS = [
  { value: 50, label: '50 บาท' },
  { value: 100, label: '100 บาท' },
  { value: 200, label: '200 บาท' },
  { value: 500, label: '500 บาท' },
  { value: 1000, label: '1,000 บาท' },
  { value: 2000, label: '2,000 บาท' },
];

// Bank account info
const BANK_INFO = {
  accountName: 'ฐาปนพงษ์ เดชยศดี',
  accountNumber: '6645533950',
  bankName: 'กรุงไทย',
};

export default function TopupPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBankInfo, setShowBankInfo] = useState(false);
  const [uploadedSlip, setUploadedSlip] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const { user, logout, requireAuth } = useAuth();
  const { addToast } = useUIStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<WalletTopupData>({
    resolver: zodResolver(walletTopupSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const watchedAmount = watch('amount');

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setValue('amount', amount);
    setShowBankInfo(true);
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setValue('amount', value);
    setSelectedAmount(null);
    if (value >= 10) {
      setShowBankInfo(true);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      addToast({
        type: 'success',
        title: 'คัดลอกแล้ว',
        message: 'คัดลอกเลขบัญชีเรียบร้อย',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถคัดลอกได้',
      });
    }
  };

  const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        addToast({
          type: 'error',
          title: 'ไฟล์ใหญ่เกินไป',
          message: 'กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 5MB',
        });
        return;
      }
      setUploadedSlip(file);
    }
  };

  const onSubmit = async (data: WalletTopupData) => {
    if (!requireAuth()) return;

    if (!uploadedSlip) {
      addToast({
        type: 'error',
        title: 'กรุณาอัพโหลดสลิป',
        message: 'กรุณาอัพโหลดสลิปการโอนเงินก่อนดำเนินการ',
      });
      return;
    }

    try {
      setIsLoading(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('amount', data.amount.toString());
      formData.append('slip', uploadedSlip);

      const response = await fetch('/api/wallet/topup', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        addToast({
          type: 'success',
          title: 'ส่งข้อมูลสำเร็จ',
          message: 'กำลังตรวจสอบสลิปการโอนเงิน กรุณารอสักครู่',
        });
        
        // Reset form
        setValue('amount', 0);
        setSelectedAmount(null);
        setUploadedSlip(null);
        setShowBankInfo(false);
      } else {
        addToast({
          type: 'error',
          title: 'เกิดข้อผิดพลาด',
          message: result.error || 'ไม่สามารถส่งข้อมูลได้',
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
          {/* Header */}
          <Card gaming className="mb-8">
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-neon-green/20 rounded-lg flex items-center justify-center">
                <Wallet className="h-10 w-10 text-neon-green" />
              </div>
              <CardTitle className="text-2xl font-bold text-gradient">
                เติมพ้อยเข้ากระเป๋า
              </CardTitle>
              <CardDescription>
                เติมพ้อยเข้ากระเป๋าของคุณเพื่อซื้อสินค้าในเว็บไซต์
              </CardDescription>
            </CardHeader>
          </Card>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Amount Selection */}
            <Card gaming>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>เลือกจำนวนเงิน</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {QUICK_AMOUNTS.map((amount) => (
                    <Button
                      key={amount.value}
                      type="button"
                      variant={selectedAmount === amount.value ? 'gaming' : 'outline'}
                      onClick={() => handleAmountSelect(amount.value)}
                      className="h-12"
                    >
                      {amount.label}
                    </Button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">หรือกรอกจำนวนเงิน</label>
                  <div className="relative">
                    <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="number"
                      placeholder="จำนวนเงิน (บาท)"
                      gaming
                      className="pl-10"
                      {...register('amount', { valueAsNumber: true })}
                      onChange={handleCustomAmount}
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-sm text-red-500">{errors.amount.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    จำนวนเงินขั้นต่ำ 10 บาท สูงสุด 100,000 บาท
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Bank Information */}
            {showBankInfo && watchedAmount >= 10 && (
              <Card gaming>
                <CardHeader>
                  <CardTitle>ข้อมูลการโอนเงิน</CardTitle>
                  <CardDescription>
                    โอนเงินจำนวน <span className="text-neon-green font-bold">{watchedAmount.toLocaleString()} บาท</span> เข้าบัญชีด้านล่าง
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gaming-darker p-4 rounded-lg border border-neon-green/20">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">ธนาคาร:</span>
                        <span className="font-medium">{BANK_INFO.bankName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">ชื่อบัญชี:</span>
                        <span className="font-medium">{BANK_INFO.accountName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">เลขบัญชี:</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-neon-green">{BANK_INFO.accountNumber}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(BANK_INFO.accountNumber)}
                          >
                            {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <p className="font-medium text-blue-400 mb-1">📝 หมายเหตุ:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• โอนเงินตามจำนวนที่ระบุเท่านั้น</li>
                      <li>• เก็บสลิปการโอนไว้สำหรับอัพโหลด</li>
                      <li>• ระบบจะตรวจสอบและเติมพ้อยให้อัตโนมัติ</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Slip Upload */}
            {showBankInfo && watchedAmount >= 10 && (
              <Card gaming>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5" />
                    <span>อัพโหลดสลิปการโอนเงิน</span>
                  </CardTitle>
                  <CardDescription>
                    อัพโหลดสลิปการโอนเงินเพื่อยืนยันการชำระเงิน
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">เลือกไฟล์รูปภาพ</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSlipUpload}
                      className="w-full p-3 border border-neon-green/20 rounded-lg bg-gaming-dark text-foreground file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-neon-green file:text-gaming-dark file:font-medium hover:file:bg-neon-green/80"
                    />
                    {uploadedSlip && (
                      <p className="text-sm text-neon-green">
                        ✓ อัพโหลดไฟล์: {uploadedSlip.name}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      รองรับไฟล์: JPG, PNG, WEBP (ขนาดไม่เกิน 5MB)
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    variant="gaming" 
                    className="w-full" 
                    disabled={isLoading || !uploadedSlip || watchedAmount < 10}
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" color="white" className="mr-2" />
                        กำลังตรวจสอบ...
                      </>
                    ) : (
                      'ยืนยันการเติมพ้อย'
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </form>
        </div>
      </div>
    </div>
  );
} 