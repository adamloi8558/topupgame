'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useUIStore } from '@/stores/ui-store';
import { Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface ProductItem {
  id: string;
  title: string;
  gameName: string;
  rank?: string;
  price: number;
  status: 'available' | 'sold' | 'reserved';
  createdAt: string;
  soldAt?: string;
}

export function ProductsTable() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToast } = useUIStore();

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/admin/products?page=${currentPage}&limit=10`);
      const result = await response.json();

      if (result.success) {
        setProducts(result.data.products || []);
        setTotalPages(result.data.totalPages || 1);
      } else {
        addToast({
          type: 'error',
          title: 'เกิดข้อผิดพลาด',
          message: 'ไม่สามารถโหลดข้อมูลสินค้าได้',
        });
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?')) {
      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (result.success) {
          setProducts(products.filter(product => product.id !== productId));
          addToast({
            type: 'success',
            title: 'ลบสำเร็จ',
            message: 'สินค้าถูกลบออกจากระบบแล้ว',
          });
        } else {
          addToast({
            type: 'error',
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถลบสินค้าได้',
          });
        }
      } catch (error) {
        console.error('Failed to delete product:', error);
        addToast({
          type: 'error',
          title: 'เกิดข้อผิดพลาด',
          message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-600">พร้อมขาย</Badge>;
      case 'sold':
        return <Badge className="bg-gray-600">ขายแล้ว</Badge>;
      case 'reserved':
        return <Badge className="bg-yellow-600">จอง</Badge>;
      default:
        return <Badge className="bg-gray-600">{status}</Badge>;
    }
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: th });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH').format(price);
  };

  if (isLoading) {
    return (
      <Card gaming>
        <CardContent className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card gaming>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>สินค้า</TableHead>
                <TableHead>เกม</TableHead>
                <TableHead>ราคา</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>วันที่เพิ่ม</TableHead>
                <TableHead>การดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    ไม่มีข้อมูลสินค้า
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.title}</div>
                        {product.rank && (
                          <div className="text-sm text-muted-foreground">
                            {product.rank}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{product.gameName}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">฿{formatPrice(product.price)}</span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(product.status)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{formatDate(product.createdAt)}</div>
                        {product.soldAt && (
                          <div className="text-sm text-muted-foreground">
                            ขาย: {formatDate(product.soldAt)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            ก่อนหน้า
          </Button>
          
          <span className="text-sm text-muted-foreground">
            หน้า {currentPage} จาก {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            ถัดไป
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
} 