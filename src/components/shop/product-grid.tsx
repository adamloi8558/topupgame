'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from './product-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { ProductWithGame, ProductFilters, PaginatedResponse, ApiResponse } from '@/types';
import { PAGINATION } from '@/lib/constants';
import { ChevronLeft, ChevronRight, Package } from 'lucide-react';

interface ProductGridProps {
  filters?: ProductFilters;
  className?: string;
}

export function ProductGrid({ filters, className }: ProductGridProps) {
  const [products, setProducts] = useState<ProductWithGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGINATION.DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.page]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      
      // Build query params
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (filters?.gameId) params.append('gameId', filters.gameId);
      if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters?.rank) params.append('rank', filters.rank);
      if (filters?.available !== undefined) params.append('available', filters.available.toString());
      if (filters?.search) params.append('search', filters.search);
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await fetch(`/api/products?${params.toString()}`);
      const result: ApiResponse<PaginatedResponse<ProductWithGame>> = await response.json();

      if (result.success && result.data) {
        setProducts(result.data.data);
        setPagination(prev => ({
          ...prev,
          total: result.data!.pagination.total,
          totalPages: result.data!.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const { page, totalPages } = pagination;
    
    // Always show first page
    if (totalPages > 0) pages.push(1);
    
    // Show pages around current page
    const start = Math.max(2, page - 2);
    const end = Math.min(totalPages - 1, page + 2);
    
    // Add ellipsis if needed
    if (start > 2) pages.push('...');
    
    // Add middle pages
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }
    
    // Add ellipsis if needed
    if (end < totalPages - 1) pages.push('...');
    
    // Always show last page
    if (totalPages > 1) pages.push(totalPages);
    
    return pages;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" color="neon" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">ไม่พบสินค้า</h3>
        <p className="text-muted-foreground">
          ลองเปลี่ยนตัวกรองหรือค้นหาด้วยคำอื่น
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page Numbers */}
          {generatePageNumbers().map((pageNum, index) => (
            <Button
              key={index}
              variant={pageNum === pagination.page ? "gaming" : "outline"}
              size="sm"
              onClick={() => typeof pageNum === 'number' && handlePageChange(pageNum)}
              disabled={pageNum === '...'}
              className={pageNum === '...' ? 'cursor-default' : ''}
            >
              {pageNum}
            </Button>
          ))}

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Results Info */}
      <div className="text-center mt-4 text-sm text-muted-foreground">
        แสดง {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} จาก {pagination.total} รายการ
      </div>
    </div>
  );
} 