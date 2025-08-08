'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, RotateCcw } from 'lucide-react';

interface SlipsFiltersProps {
  onFiltersChange?: (filters: SlipsFilters) => void;
}

export interface SlipsFilters {
  status?: string;
  minAmount?: number;
  maxAmount?: number;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

export function SlipsFilters({ onFiltersChange }: SlipsFiltersProps) {
  const [filters, setFilters] = useState<SlipsFilters>({});

  const updateFilter = (key: keyof SlipsFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const resetFilters = () => {
    const emptyFilters: SlipsFilters = {};
    setFilters(emptyFilters);
    onFiltersChange?.(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  return (
    <Card gaming>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>ตัวกรอง</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium">ค้นหา</label>
          <Input
            placeholder="ค้นหาชื่อผู้ใช้ หรือ อีเมล..."
            value={filters.searchTerm || ''}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            gaming
          />
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">สถานะ</label>
          <Select onValueChange={(value: string) => updateFilter('status', value === 'all' ? undefined : value)}>
            <SelectTrigger gaming>
              <SelectValue placeholder="ทุกสถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกสถานะ</SelectItem>
              <SelectItem value="pending">รอตรวจสอบ</SelectItem>
              <SelectItem value="processing">กำลังตรวจสอบ</SelectItem>
              <SelectItem value="verified">อนุมัติแล้ว</SelectItem>
              <SelectItem value="rejected">ปฏิเสธแล้ว</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Amount Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">ช่วงจำนวนเงิน (บาท)</label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="จาก"
              value={filters.minAmount || ''}
              onChange={(e) => updateFilter('minAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
              gaming
            />
            <Input
              type="number"
              placeholder="ถึง"
              value={filters.maxAmount || ''}
              onChange={(e) => updateFilter('maxAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
              gaming
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">ช่วงวันที่อัพโหลด</label>
          <div className="space-y-2">
            <Input
              type="date"
              placeholder="วันที่เริ่มต้น"
              value={filters.dateFrom || ''}
              onChange={(e) => updateFilter('dateFrom', e.target.value)}
              gaming
            />
            <Input
              type="date"
              placeholder="วันที่สิ้นสุด"
              value={filters.dateTo || ''}
              onChange={(e) => updateFilter('dateTo', e.target.value)}
              gaming
            />
          </div>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={resetFilters}
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            ล้างตัวกรอง
          </Button>
        )}

        {/* Quick Filters */}
        <div className="space-y-2">
          <label className="text-sm font-medium">ตัวกรองด่วน</label>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFilter('status', 'pending')}
              className="w-full justify-start"
            >
              สลิปรอตรวจสอบ
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                updateFilter('dateFrom', today);
                updateFilter('dateTo', today);
              }}
              className="w-full justify-start"
            >
              สลิปวันนี้
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateFilter('minAmount', 1000);
                updateFilter('maxAmount', undefined);
              }}
              className="w-full justify-start"
            >
              จำนวนเงิน ≥ 1,000 บาท
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 