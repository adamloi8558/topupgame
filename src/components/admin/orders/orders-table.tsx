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
  CheckCircle, 
  XCircle, 
  Clock,
  Receipt,
  Plus,
  ShoppingCart
} from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface OrderItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: 'topup' | 'purchase';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  gameId?: string;
  gameName?: string;
  gameUid?: string;
  createdAt: string;
  updatedAt: string;
}

export function OrdersTable() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      
      // Mock data
      setTimeout(() => {
        setOrders([
          {
            id: 'ORD-001',
            userId: 'user-1',
            userName: 'นายสมชาย ใจดี',
            userEmail: 'somchai@email.com',
            type: 'topup',
            amount: 500,
            status: 'completed',
            gameId: 'rov',
            gameName: 'RoV',
            gameUid: '123456789',
            createdAt: '2024-01-26T10:30:00Z',
            updatedAt: '2024-01-26T10:35:00Z',
          },
          {
            id: 'ORD-002',
            userId: 'user-2',
            userName: 'นางสาวสมใส รักเกม',
            userEmail: 'somsai@email.com',
            type: 'purchase',
            amount: 1200,
            status: 'pending',
            createdAt: '2024-01-26T09:15:00Z',
            updatedAt: '2024-01-26T09:15:00Z',
          },
          {
            id: 'ORD-003',
            userId: 'user-3',
            userName: 'นายเกมเมอร์ โปร',
            userEmail: 'gamer@email.com',
            type: 'topup',
            amount: 300,
            status: 'failed',
            gameId: 'valorant',
            gameName: 'VALORANT',
            gameUid: '987654321',
            createdAt: '2024-01-26T08:45:00Z',
            updatedAt: '2024-01-26T08:50:00Z',
          },
        ]);
        setTotalPages(5);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrder(orderId);
      
      // Mock API call
      setTimeout(() => {
        setOrders(orders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus as any, updatedAt: new Date().toISOString() }
            : order
        ));
        setUpdatingOrder(null);
      }, 1000);
    } catch (error) {
      console.error('Failed to update order:', error);
      setUpdatingOrder(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            สำเร็จ
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            รอดำเนินการ
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            ล้มเหลว
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'topup' ? (
      <Plus className="h-4 w-4 text-green-500" />
    ) : (
      <ShoppingCart className="h-4 w-4 text-blue-500" />
    );
  };

  const getTypeText = (type: string) => {
    return type === 'topup' ? 'เติมพ้อย' : 'ซื้อสินค้า';
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('th-TH').format(amount);
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
          <Receipt className="h-5 w-5" />
          <span>รายการคำสั่งซื้อ</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>ลูกค้า</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>เกม</TableHead>
                <TableHead>จำนวนเงิน</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>วันที่สร้าง</TableHead>
                <TableHead className="text-right">การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.userName}</div>
                      <div className="text-sm text-muted-foreground">{order.userEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(order.type)}
                      <span>{getTypeText(order.type)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {order.gameName ? (
                      <div>
                        <div className="font-medium">{order.gameName}</div>
                        {order.gameUid && (
                          <div className="text-sm text-muted-foreground">UID: {order.gameUid}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono">
                    ฿{formatAmount(order.amount)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          {updatingOrder === order.id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          ดูรายละเอียด
                        </DropdownMenuItem>
                        
                        {order.status === 'pending' && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              อนุมัติ
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => updateOrderStatus(order.id, 'failed')}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              ปฏิเสธ
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          แก้ไข
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