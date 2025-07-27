'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductFilters, Game, ApiResponse } from '@/types';
import { GAME_RANKS } from '@/lib/constants';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShopFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  className?: string;
}

export function ShopFilters({ filters, onFiltersChange, className }: ShopFiltersProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games?active=true');
      const result: ApiResponse<Game[]> = await response.json();
      if (result.success && result.data) {
        setGames(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch games:', error);
    }
  };

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilter = (key: keyof ProductFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className={className}>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between"
        >
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="h-4 w-4" />
            <span>ตัวกรอง</span>
            {hasActiveFilters && (
              <span className="bg-neon-green text-gaming-dark px-2 py-0.5 rounded text-xs">
                {Object.keys(filters).length}
              </span>
            )}
          </div>
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Filters Content */}
      <div className={cn(
        'space-y-4',
        'lg:block', // Always show on desktop
        isExpanded ? 'block' : 'hidden' // Show/hide on mobile
      )}>
        {/* Search */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">ค้นหา</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="ค้นหาไอดีเกม..."
                value={filters.search || ''}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
                gaming
              />
              {filters.search && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearFilter('search')}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Game Filter */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">เกม</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <Button
                variant={!filters.gameId ? "gaming" : "outline"}
                size="sm"
                onClick={() => clearFilter('gameId')}
                className="w-full justify-start"
              >
                ทุกเกม
              </Button>
              {games.map((game) => (
                <Button
                  key={game.id}
                  variant={filters.gameId === game.id ? "gaming" : "outline"}
                  size="sm"
                  onClick={() => updateFilter('gameId', game.id)}
                  className="w-full justify-start"
                >
                  {game.name}
                </Button>
              ))}
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
                value={filters.minPrice || ''}
                onChange={(e) => updateFilter('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                gaming
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">ราคาสูงสุด</label>
              <Input
                type="number"
                placeholder="ไม่จำกัด"
                value={filters.maxPrice || ''}
                onChange={(e) => updateFilter('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                gaming
              />
            </div>
          </CardContent>
        </Card>

        {/* Rank Filter */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">แรงค์</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <Button
                variant={!filters.rank ? "gaming" : "outline"}
                size="sm"
                onClick={() => clearFilter('rank')}
                className="w-full justify-start"
              >
                ทุกแรงค์
              </Button>
              {GAME_RANKS.map((rank) => (
                <Button
                  key={rank}
                  variant={filters.rank === rank ? "gaming" : "outline"}
                  size="sm"
                  onClick={() => updateFilter('rank', rank)}
                  className="w-full justify-start"
                >
                  {rank}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">สถานะ</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <Button
                variant={filters.available === undefined ? "gaming" : "outline"}
                size="sm"
                onClick={() => clearFilter('available')}
                className="w-full justify-start"
              >
                ทั้งหมด
              </Button>
              <Button
                variant={filters.available === true ? "gaming" : "outline"}
                size="sm"
                onClick={() => updateFilter('available', true)}
                className="w-full justify-start"
              >
                พร้อมขาย
              </Button>
              <Button
                variant={filters.available === false ? "gaming" : "outline"}
                size="sm"
                onClick={() => updateFilter('available', false)}
                className="w-full justify-start"
              >
                ขายแล้ว
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sort */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">เรียงลำดับ</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <Button
                variant={filters.sortBy === 'createdAt' ? "gaming" : "outline"}
                size="sm"
                onClick={() => {
                  updateFilter('sortBy', 'createdAt');
                  updateFilter('sortOrder', 'desc');
                }}
                className="w-full justify-start"
              >
                ใหม่ล่าสุด
              </Button>
              <Button
                variant={filters.sortBy === 'price' && filters.sortOrder === 'asc' ? "gaming" : "outline"}
                size="sm"
                onClick={() => {
                  updateFilter('sortBy', 'price');
                  updateFilter('sortOrder', 'asc');
                }}
                className="w-full justify-start"
              >
                ราคาต่ำ → สูง
              </Button>
              <Button
                variant={filters.sortBy === 'price' && filters.sortOrder === 'desc' ? "gaming" : "outline"}
                size="sm"
                onClick={() => {
                  updateFilter('sortBy', 'price');
                  updateFilter('sortOrder', 'desc');
                }}
                className="w-full justify-start"
              >
                ราคาสูง → ต่ำ
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Clear All Filters */}
        {hasActiveFilters && (
          <Button
            variant="destructive"
            onClick={clearAllFilters}
            className="w-full"
          >
            <X className="mr-2 h-4 w-4" />
            ล้างตัวกรองทั้งหมด
          </Button>
        )}
      </div>
    </div>
  );
} 