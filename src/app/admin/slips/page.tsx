import { Metadata } from 'next';
import { SlipsTable } from '@/components/admin/slips/slips-table';
import { SlipsStats } from '@/components/admin/slips/slips-stats';
import { SlipsFilters } from '@/components/admin/slips/slips-filters';

export const metadata: Metadata = {
  title: 'Admin - จัดการสลิป',
  description: 'ดูและจัดการสลิปการโอนเงินของลูกค้า',
};

export default function AdminSlipsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gradient">จัดการสลิป</h1>
        <p className="text-muted-foreground">
          ดูและจัดการสลิปการโอนเงินของลูกค้า
        </p>
      </div>

      {/* Slips Statistics */}
      <SlipsStats />

      {/* Slips Management */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <SlipsFilters />
        </div>

        {/* Slips Table */}
        <div className="lg:col-span-3">
          <SlipsTable />
        </div>
      </div>
    </div>
  );
} 