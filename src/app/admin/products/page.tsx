import { Metadata } from 'next';
import { ProductsTable } from '@/components/admin/products/products-table';
import { ProductsFilters } from '@/components/admin/products/products-filters';
import { ProductsStats } from '@/components/admin/products/products-stats';
import { AddProductButton } from '@/components/admin/products/add-product-button';

export const metadata: Metadata = {
  title: 'Admin - จัดการสินค้า',
  description: 'จัดการไอดีเกมและสินค้าในระบบ',
};

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">จัดการสินค้า</h1>
          <p className="text-muted-foreground">
            ดูและจัดการไอดีเกม สต็อก ราคา และรายละเอียดสินค้า
          </p>
        </div>
        <AddProductButton />
      </div>

      {/* Products Statistics */}
      <ProductsStats />

      {/* Products Management */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <ProductsFilters />
        </div>

        {/* Products Table */}
        <div className="lg:col-span-3">
          <ProductsTable />
        </div>
      </div>
    </div>
  );
} 