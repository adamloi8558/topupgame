import { Metadata } from 'next';
import { OrdersTable } from '@/components/admin/orders/orders-table';
import { OrdersFilters } from '@/components/admin/orders/orders-filters';
import { OrdersStats } from '@/components/admin/orders/orders-stats';

export const metadata: Metadata = {
  title: 'Admin - จัดการคำสั่งซื้อ',
  description: 'จัดการคำสั่งซื้อและเติมพ้อยทั้งหมดในระบบ',
};

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gradient">จัดการคำสั่งซื้อ</h1>
        <p className="text-muted-foreground">
          ดูและจัดการคำสั่งซื้อ การเติมพ้อย และการซื้อสินค้าทั้งหมด
        </p>
      </div>

      {/* Orders Statistics */}
      <OrdersStats />

      {/* Orders Management */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <OrdersFilters />
        </div>

        {/* Orders Table */}
        <div className="lg:col-span-3">
          <OrdersTable />
        </div>
      </div>
    </div>
  );
} 