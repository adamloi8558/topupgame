import { Metadata } from 'next';
import { TransactionHistory } from '@/components/history/transaction-history';
import { HistoryFilters } from '@/components/history/history-filters';

export const metadata: Metadata = {
  title: 'ประวัติการทำธุรกรรม',
  description: 'ดูประวัติการเติมพ้อย การซื้อสินค้า และการทำธุรกรรมทั้งหมด',
};

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-gaming">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gradient">ประวัติการทำธุรกรรม</h1>
            <p className="text-muted-foreground">
              ดูประวัติการเติมพ้อย การซื้อสินค้า และการทำธุรกรรมทั้งหมด
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <HistoryFilters />
            </div>

            {/* Transaction History */}
            <div className="lg:col-span-3">
              <TransactionHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 