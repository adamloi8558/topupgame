'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from './product-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { ProductWithGame, ProductFilters } from '@/types';
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
      const result = await response.json();

      if (result.success && result.data) {
        // Updated to match our mock API structure
        const productsList = result.data.products || [];
        const paginationData = result.data.pagination || {};
        
        setProducts(productsList);
        setPagination(prev => ({
          ...prev,
          total: paginationData.total || 0,
          totalPages: paginationData.totalPages || 0,
        }));
      } else {
        console.error('Failed to fetch products:', result.error);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, pagination.page - Math.floor(maxVisible / 2));
    let end = Math.min(pagination.totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" color="neon" />
      </div>
    );
  }

  // Add safety check for products array
  if (!products || products.length === 0) {
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            แสดง {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} จาก {pagination.total} รายการ
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              ก่อนหน้า
            </Button>

            {/* Page Numbers */}
            <div className="flex space-x-1">
              {generatePageNumbers().map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={pageNum === pagination.page ? "gaming" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className="w-10"
                >
                  {pageNum}
                </Button>
              ))}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              ถัดไป
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 