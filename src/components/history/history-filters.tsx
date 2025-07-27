'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Filter, X } from 'lucide-react';

interface HistoryFilter {
  type?: 'all' | 'topup' | 'purchase';
  status?: 'all' | 'pending' | 'completed' | 'failed';
  dateFrom?: string;
  dateTo?: string;
}

interface HistoryFiltersProps {
  onFiltersChange?: (filters: HistoryFilter) => void;
}

export function HistoryFilters({ onFiltersChange }: HistoryFiltersProps) {
  const [filters, setFilters] = useState<HistoryFilter>({
    type: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: '',
  });

  const updateFilter = (key: keyof HistoryFilter, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: HistoryFilter = {
      type: 'all',
      status: 'all',
      dateFrom: '',
      dateTo: '',
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const hasActiveFilters = 
    filters.type !== 'all' || 
    filters.status !== 'all' || 
    filters.dateFrom || 
    filters.dateTo;

  return (
    <div className="space-y-4">
      {/* Transaction Type */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">ประเภทธุรกรรม</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <Button
              variant={filters.type === 'all' ? "gaming" : "outline"}
              size="sm"
              onClick={() => updateFilter('type', 'all')}
              className="w-full justify-start"
            >
              ทั้งหมด
            </Button>
            <Button
              variant={filters.type === 'topup' ? "gaming" : "outline"}
              size="sm"
              onClick={() => updateFilter('type', 'topup')}
              className="w-full justify-start"
            >
              เติมพ้อย
            </Button>
            <Button
              variant={filters.type === 'purchase' ? "gaming" : "outline"}
              size="sm"
              onClick={() => updateFilter('type', 'purchase')}
              className="w-full justify-start"
            >
              ซื้อสินค้า
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">สถานะ</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <Button
              variant={filters.status === 'all' ? "gaming" : "outline"}
              size="sm"
              onClick={() => updateFilter('status', 'all')}
              className="w-full justify-start"
            >
              ทั้งหมด
            </Button>
            <Button
              variant={filters.status === 'pending' ? "gaming" : "outline"}
              size="sm"
              onClick={() => updateFilter('status', 'pending')}
              className="w-full justify-start"
            >
              รอดำเนินการ
            </Button>
            <Button
              variant={filters.status === 'completed' ? "gaming" : "outline"}
              size="sm"
              onClick={() => updateFilter('status', 'completed')}
              className="w-full justify-start"
            >
              สำเร็จ
            </Button>
            <Button
              variant={filters.status === 'failed' ? "gaming" : "outline"}
              size="sm"
              onClick={() => updateFilter('status', 'failed')}
              className="w-full justify-start"
            >
              ไม่สำเร็จ
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Date Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>ช่วงเวลา</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">จากวันที่</label>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => updateFilter('dateFrom', e.target.value)}
              gaming
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">ถึงวันที่</label>
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => updateFilter('dateTo', e.target.value)}
              gaming
            />
          </div>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="destructive"
          onClick={clearFilters}
          className="w-full"
        >
          <X className="mr-2 h-4 w-4" />
          ล้างตัวกรอง
        </Button>
      )}
    </div>
  );
} 