'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Package,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface ProductItem {
  id: string;
  title: string;
  gameName: string;
  rank: string;
  price: number;
  status: 'available' | 'sold';
  createdAt: string;
  soldAt?: string;
}

export function ProductsTable() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      
      // Mock data
      setTimeout(() => {
        setProducts([
          {
            id: 'prod-1',
            title: 'RoV Diamond Account - Full Skin',
            gameName: 'RoV',
            rank: 'Diamond',
            price: 2500,
            status: 'available',
            createdAt: '2024-01-26T10:30:00Z',
          },
          {
            id: 'prod-2',
            title: 'VALORANT Immortal Account',
            gameName: 'VALORANT',
            rank: 'Immortal',
            price: 3500,
            status: 'sold',
            createdAt: '2024-01-25T14:20:00Z',
            soldAt: '2024-01-26T09:15:00Z',
          },
          {
            id: 'prod-3',
            title: 'Free Fire Grandmaster ID',
            gameName: 'Free Fire',
            rank: 'Grandmaster',
            price: 1800,
            status: 'available',
            createdAt: '2024-01-24T16:45:00Z',
          },
        ]);
        setTotalPages(3);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setIsLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?')) {
      try {
        setProducts(products.filter(product => product.id !== productId));
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'available' ? (
      <Badge variant="default" className="bg-green-600">
        <CheckCircle className="mr-1 h-3 w-3" />
        พร้อมขาย
      </Badge>
    ) : (
      <Badge variant="secondary">
        <XCircle className="mr-1 h-3 w-3" />
        ขายแล้ว
      </Badge>
    );
  };

  const formatPoints = (points: number) => {
    return new Intl.NumberFormat('th-TH').format(points);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: th });
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
    <Card gaming>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <span>รายการสินค้า</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อสินค้า</TableHead>
                <TableHead>เกม</TableHead>
                <TableHead>แรงค์</TableHead>
                <TableHead>ราคา</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>สร้างเมื่อ</TableHead>
                <TableHead className="text-right">การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium max-w-xs">
                    <div className="truncate">{product.title}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.gameName}</Badge>
                  </TableCell>
                  <TableCell>{product.rank}</TableCell>
                  <TableCell className="font-mono">
                    <span className="text-neon-green">{formatPoints(product.price)}</span> พ้อย
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(product.status)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(product.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          ดูรายละเอียด
                        </DropdownMenuItem>
                        
                        {product.status === 'available' && (
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            แก้ไข
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuItem 
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          ลบสินค้า
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ก่อนหน้า
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "gaming" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              ถัดไป
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 