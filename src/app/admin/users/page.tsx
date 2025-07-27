import { Metadata } from 'next';
import { UsersTable } from '@/components/admin/users/users-table';
import { UsersFilters } from '@/components/admin/users/users-filters';
import { UsersStats } from '@/components/admin/users/users-stats';

export const metadata: Metadata = {
  title: 'Admin - จัดการผู้ใช้งาน',
  description: 'จัดการข้อมูลผู้ใช้งานและการตั้งค่าบัญชี',
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gradient">จัดการผู้ใช้งาน</h1>
        <p className="text-muted-foreground">
          ดูและจัดการข้อมูลผู้ใช้งาน ยอดพ้อย และสิทธิ์การเข้าใช้งาน
        </p>
      </div>

      {/* Users Statistics */}
      <UsersStats />

      {/* Users Management */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <UsersFilters />
        </div>

        {/* Users Table */}
        <div className="lg:col-span-3">
          <UsersTable />
        </div>
      </div>
    </div>
  );
} 