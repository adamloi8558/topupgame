'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search, X } from 'lucide-react';

interface ProductFilters {
  search?: string;
  status?: 'all' | 'available' | 'sold';
  gameId?: string;
  priceMin?: number;
  priceMax?: number;
}

interface ProductsFiltersProps {
  onFiltersChange?: (filters: ProductFilters) => void;
}

export function ProductsFilters({ onFiltersChange }: ProductsFiltersProps) {
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    status: 'all',
    gameId: '',
    priceMin: undefined,
    priceMax: undefined,
  });

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: ProductFilters = {
      search: '',
      status: 'all',
      gameId: '',
      priceMin: undefined,
      priceMax: undefined,
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const hasActiveFilters = 
    filters.search || 
    filters.status !== 'all' || 
    filters.gameId ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined;

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
            placeholder="ค้นหาชื่อสินค้า..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            gaming
          />
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">สถานะสินค้า</CardTitle>
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
              variant={filters.status === 'available' ? "gaming" : "outline"}
              size="sm"
              onClick={() => updateFilter('status', 'available')}
              className="w-full justify-start"
            >
              พร้อมขาย
            </Button>
            <Button
              variant={filters.status === 'sold' ? "gaming" : "outline"}
              size="sm"
              onClick={() => updateFilter('status', 'sold')}
              className="w-full justify-start"
            >
              ขายแล้ว
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">ช่วงราคา (พ้อย)</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">ราคาต่ำสุด</label>
            <Input
              type="number"
              placeholder="0"
              value={filters.priceMin || ''}
              onChange={(e) => updateFilter('priceMin', e.target.value ? parseInt(e.target.value) : undefined)}
              gaming
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">ราคาสูงสุด</label>
            <Input
              type="number"
              placeholder="ไม่จำกัด"
              value={filters.priceMax || ''}
              onChange={(e) => updateFilter('priceMax', e.target.value ? parseInt(e.target.value) : undefined)}
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