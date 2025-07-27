import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { TopupForm } from '@/components/topup/topup-form';

export const metadata: Metadata = {
  title: 'เติมพ้อยเกม',
  description: 'เติมเงินเข้าระบบเพื่อใช้เป็นเครดิตในการซื้อสินค้า',
};

export default function TopupPage() {
  return (
    <div className="min-h-screen bg-gradient-gaming">
      <div className="container mx-auto px-4 py-8">
        <TopupForm />
      </div>
    </div>
  );
} 