import { Metadata } from 'next';
import { AddProductForm } from '@/components/admin/products/add-product-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin - เพิ่มสินค้าใหม่',
  description: 'เพิ่มไอดีเกมหรือสินค้าใหม่เข้าสู่ระบบ',
};

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center space-x-4">
        <Link 
          href="/admin/products" 
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          กลับไปจัดการสินค้า
        </Link>
      </div>

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gradient">เพิ่มสินค้าใหม่</h1>
        <p className="text-muted-foreground">
          เพิ่มไอดีเกมหรือสินค้าใหม่เข้าสู่ระบบ
        </p>
      </div>

      {/* Add Product Form */}
      <div className="max-w-4xl">
        <Card gaming>
          <CardHeader>
            <CardTitle>ข้อมูลสินค้า</CardTitle>
          </CardHeader>
          <CardContent>
            <AddProductForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 