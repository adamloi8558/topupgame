'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Calendar, X } from 'lucide-react';

interface OrderFilters {
  status?: 'all' | 'pending' | 'completed' | 'failed';
  type?: 'all' | 'topup' | 'purchase';
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

interface OrdersFiltersProps {
  onFiltersChange?: (filters: OrderFilters) => void;
}

export function OrdersFilters({ onFiltersChange }: OrdersFiltersProps) {
  const [filters, setFilters] = useState<OrderFilters>({
    status: 'all',
    type: 'all',
    dateFrom: '',
    dateTo: '',
    searchTerm: '',
  });

  const updateFilter = (key: keyof OrderFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: OrderFilters = {
      status: 'all',
      type: 'all',
      dateFrom: '',
      dateTo: '',
      searchTerm: '',
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const hasActiveFilters = 
    filters.status !== 'all' || 
    filters.type !== 'all' || 
    filters.dateFrom || 
    filters.dateTo ||
    filters.searchTerm;

  return (
    <div className="space-y-4">
      {/* Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">ค้นหา</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Input
            placeholder="ค้นหา Order ID หรือ Username..."
            value={filters.searchTerm || ''}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            gaming
          />
        </CardContent>
      </Card>

      {/* Order Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">สถานะคำสั่งซื้อ</CardTitle>
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
              ล้มเหลว
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Order Type */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">ประเภทคำสั่งซื้อ</CardTitle>
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