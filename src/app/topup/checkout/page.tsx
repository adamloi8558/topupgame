'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Dynamic imports
const BankInfo = dynamic(
  () => import('@/components/topup/bank-info').then(mod => mod.BankInfo),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
);

const SlipUpload = dynamic(
  () => import('@/components/topup/slip-upload').then(mod => mod.SlipUpload),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
);

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const amount = parseInt(searchParams.get('amount') || '0');
  const orderId = searchParams.get('orderId') || '';

  return (
    <div className="min-h-screen bg-gradient-gaming">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card gaming>
            <CardHeader>
              <CardTitle>ชำระเงิน</CardTitle>
              <CardDescription>
                โอนเงินและอัพโหลดสลิปเพื่อยืนยันการชำระเงิน
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoadingSpinner />}>
                <BankInfo amount={amount} />
                <SlipUpload orderId={orderId} onUploadSuccess={() => {}} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 