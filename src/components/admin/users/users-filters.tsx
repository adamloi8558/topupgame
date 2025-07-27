'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search, Calendar, X } from 'lucide-react';

interface UserFilters {
  role?: 'all' | 'user' | 'admin';
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  pointsMin?: number;
  pointsMax?: number;
}

interface UsersFiltersProps {
  onFiltersChange?: (filters: UserFilters) => void;
}

export function UsersFilters({ onFiltersChange }: UsersFiltersProps) {
  const [filters, setFilters] = useState<UserFilters>({
    role: 'all',
    dateFrom: '',
    dateTo: '',
    searchTerm: '',
    pointsMin: undefined,
    pointsMax: undefined,
  });

  const updateFilter = (key: keyof UserFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: UserFilters = {
      role: 'all',
      dateFrom: '',
      dateTo: '',
      searchTerm: '',
      pointsMin: undefined,
      pointsMax: undefined,
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const hasActiveFilters = 
    filters.role !== 'all' || 
    filters.dateFrom || 
    filters.dateTo ||
    filters.searchTerm ||
    filters.pointsMin !== undefined ||
    filters.pointsMax !== undefined;

  return (
    <div className="space-y-4">
      {/* Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>ค้นหา</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Input
            placeholder="ค้นหาชื่อหรืออีเมล..."
            value={filters.searchTerm || ''}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            gaming
          />
        </CardContent>
      </Card>

      {/* User Role */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">บทบาทผู้ใช้</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <Button
              variant={filters.role === 'all' ? "gaming" : "outline"}
              size="sm"
              onClick={() => updateFilter('role', 'all')}
              className="w-full justify-start"
            >
              ทั้งหมด
            </Button>
            <Button
              variant={filters.role === 'user' ? "gaming" : "outline"}
              size="sm"
              onClick={() => updateFilter('role', 'user')}
              className="w-full justify-start"
            >
              ผู้ใช้งานทั่วไป
            </Button>
            <Button
              variant={filters.role === 'admin' ? "gaming" : "outline"}
              size="sm"
              onClick={() => updateFilter('role', 'admin')}
              className="w-full justify-start"
            >
              ผู้ดูแลระบบ
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Points Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">ช่วงพ้อย</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">พ้อยต่ำสุด</label>
            <Input
              type="number"
              placeholder="0"
              value={filters.pointsMin || ''}
              onChange={(e) => updateFilter('pointsMin', e.target.value ? parseInt(e.target.value) : undefined)}
              gaming
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">พ้อยสูงสุด</label>
            <Input
              type="number"
              placeholder="ไม่จำกัด"
              value={filters.pointsMax || ''}
              onChange={(e) => updateFilter('pointsMax', e.target.value ? parseInt(e.target.value) : undefined)}
              gaming
            />
          </div>
        </CardContent>
      </Card>

      {/* Registration Date Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>วันที่สมัครสมาชิก</span>
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

      {/* Quick Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">ตัวกรองด่วน</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateFilter('pointsMin', 1000);
                updateFilter('pointsMax', undefined);
              }}
              className="w-full justify-start"
            >
              ผู้ใช้ที่มีพ้อยมาก (1000+)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateFilter('pointsMin', undefined);
                updateFilter('pointsMax', 100);
              }}
              className="w-full justify-start"
            >
              ผู้ใช้ที่มีพ้อยน้อย (&lt;100)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                updateFilter('dateFrom', lastWeek.toISOString().split('T')[0]);
                updateFilter('dateTo', today.toISOString().split('T')[0]);
              }}
              className="w-full justify-start"
            >
              สมาชิกใหม่ (7 วันที่แล้ว)
            </Button>
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