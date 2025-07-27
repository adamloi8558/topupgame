import { Metadata } from 'next';
import { RevenueChart } from '@/components/admin/analytics/revenue-chart';
import { OrdersChart } from '@/components/admin/analytics/orders-chart';
import { GamePopularityChart } from '@/components/admin/analytics/game-popularity-chart';
import { AnalyticsStats } from '@/components/admin/analytics/analytics-stats';
import { TopProducts } from '@/components/admin/analytics/top-products';
import { RecentActivity } from '@/components/admin/analytics/recent-activity';

export const metadata: Metadata = {
  title: 'Admin - รายงานและวิเคราะห์',
  description: 'ดูสถิติ รายงาน และวิเคราะห์ข้อมูลธุรกิจ',
};

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gradient">รายงานและวิเคราะห์</h1>
        <p className="text-muted-foreground">
          ดูสถิติยอดขาย รายได้ และพฤติกรรมผู้ใช้งาน
        </p>
      </div>

      {/* Analytics Statistics */}
      <AnalyticsStats />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <OrdersChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GamePopularityChart />
        <TopProducts />
        <RecentActivity />
      </div>
    </div>
  );
} 