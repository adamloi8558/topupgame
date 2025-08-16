'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/hooks/use-auth';
import { useUIStore } from '@/stores/ui-store';
import { ApiResponse, Transaction } from '@/types';
import { 
  Plus, 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Receipt,
  Calendar,
  Coins
} from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { requireAuth } = useAuth();
  const { addToast } = useUIStore();

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/transactions?page=${currentPage}&limit=10`);
      const result: ApiResponse<{
        transactions: Transaction[];
        pagination: {
          page: number;
          totalPages: number;
          total: number;
        };
      }> = await response.json();

      if (result.success && result.data) {
        setTransactions(result.data.transactions);
        setTotalPages(result.data.pagination.totalPages);
      } else {
        addToast({
          type: 'error',
          title: 'เกิดข้อผิดพลาด',
          message: 'ไม่สามารถโหลดประวัติธุรกรรมได้',
        });
      }
    } catch (error) {
      console.error('Fetch transactions error:', error);
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, addToast]);

  useEffect(() => {
    if (requireAuth()) {
      fetchTransactions();
    }
  }, [requireAuth, fetchTransactions]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'topup':
        return <Plus className="h-4 w-4" />;
      case 'purchase':
        return <ShoppingCart className="h-4 w-4" />;
      default:
        return <Receipt className="h-4 w-4" />;
    }
  };

  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case 'topup':
        return 'เติมพ้อย';
      case 'purchase':
        return 'ซื้อสินค้า';
      default:
        return 'ธุรกรรม';
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
            ไม่สำเร็จ
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatAmount = (amount: string) => {
    return new Intl.NumberFormat('th-TH').format(Number(amount));
  };

  const formatDate = (date: string | Date) => {
    return format(new Date(date), 'dd MMM yyyy, HH:mm', { locale: th });
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

  if (transactions.length === 0) {
    return (
      <Card gaming>
        <CardContent className="text-center py-12">
          <Receipt className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">ไม่มีประวัติธุรกรรม</h3>
          <p className="text-muted-foreground mb-4">
            คุณยังไม่มีประวัติการทำธุรกรรมในระบบ
          </p>
          <Button variant="gaming" asChild>
            <a href="/topup">เติมพ้อยเลย!</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Transaction List */}
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <Card key={transaction.id} gaming>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-neon-green/10 p-2 rounded-lg">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">
                        {getTransactionTypeText(transaction.type)}
                      </h3>
                      {getStatusBadge('completed')} {/* Assuming completed for now */}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {transaction.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{transaction.createdAt ? formatDate(transaction.createdAt) : 'ไม่ระบุ'}</span>
                      </div>
                      {transaction.referenceId && (
                        <div className="flex items-center space-x-1">
                          <Receipt className="h-3 w-3" />
                          <span>อ้างอิง: {transaction.referenceId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="text-lg font-bold text-neon-green">
                    +{formatAmount(transaction.amount)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ยอดคงเหลือ: {formatAmount(transaction.pointsAfter)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ก่อนหน้า
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "gaming" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
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
    </div>
  );
} 