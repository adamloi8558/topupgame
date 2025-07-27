import { Metadata } from 'next';
import { AdminStats } from '@/components/admin/admin-stats';
import { RecentOrders } from '@/components/admin/recent-orders';
import { RecentSlips } from '@/components/admin/recent-slips';
import { QuickActions } from '@/components/admin/quick-actions';

export const metadata: Metadata = {
  title: 'Admin Dashboard - ภาพรวมระบบ',
  description: 'แดชบอร์ดสำหรับผู้ดูแลระบบเติมเกมและขายไอดีเกม',
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gradient">ภาพรวมระบบ</h1>
        <p className="text-muted-foreground">
          สถิติและข้อมูลสำคัญของระบบเติมเกมและขายไอดีเกม
        </p>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Statistics Cards */}
      <AdminStats />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders />
        <RecentSlips />
      </div>
    </div>
  );
} 