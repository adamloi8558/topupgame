'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useUIStore } from '@/stores/ui-store';
import { Eye, Check, X, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface SlipItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: string;
  status: 'pending' | 'verified' | 'rejected' | 'processing';
  fileName: string;
  fileUrl: string;
  createdAt: string;
  verifiedAt?: string;
}

export function SlipsTable() {
  const [slips, setSlips] = useState<SlipItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingSlip, setUpdatingSlip] = useState<string | null>(null);
  const { addToast } = useUIStore();

  const fetchSlips = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/admin/slips?page=${currentPage}&limit=10`);
      const result = await response.json();

      if (result.success) {
        setSlips(result.data.slips || []);
        setTotalPages(result.data.totalPages || 1);
      } else {
        addToast({
          type: 'error',
          title: 'เกิดข้อผิดพลาด',
          message: 'ไม่สามารถโหลดข้อมูลสลิปได้',
        });
      }
    } catch (error) {
      console.error('Failed to fetch slips:', error);
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
    fetchSlips();
  }, [fetchSlips]);

  const updateSlipStatus = async (slipId: string, status: 'verified' | 'rejected') => {
    try {
      setUpdatingSlip(slipId);

      const response = await fetch(`/api/admin/slips/${slipId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (result.success) {
        setSlips(slips.map(slip => 
          slip.id === slipId 
            ? { ...slip, status, verifiedAt: status === 'verified' ? new Date().toISOString() : slip.verifiedAt }
            : slip
        ));
        
        addToast({
          type: 'success',
          title: 'อัปเดตสำเร็จ',
          message: `สลิปถูก${status === 'verified' ? 'อนุมัติ' : 'ปฏิเสธ'}แล้ว`,
        });
      } else {
        addToast({
          type: 'error',
          title: 'เกิดข้อผิดพลาด',
          message: 'ไม่สามารถอัปเดตสถานะสลิปได้',
        });
      }
    } catch (error) {
      console.error('Failed to update slip status:', error);
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
      });
    } finally {
      setUpdatingSlip(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-600">ตรวจสอบแล้ว</Badge>;
      case 'rejected':
        return <Badge className="bg-red-600">ปฏิเสธ</Badge>;
      case 'processing':
        return <Badge className="bg-blue-600">กำลังตรวจสอบ</Badge>;
      default:
        return <Badge className="bg-yellow-600">รอตรวจสอบ</Badge>;
    }
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: th });
  };

  const formatAmount = (amount: string) => {
    return new Intl.NumberFormat('th-TH').format(parseFloat(amount));
  };

  const openSlipImage = (url: string) => {
    window.open(url, '_blank');
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
                <TableHead>ผู้ใช้</TableHead>
                <TableHead>จำนวนเงิน</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>วันที่อัพโหลด</TableHead>
                <TableHead>การดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slips.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    ไม่มีข้อมูลสลิป
                  </TableCell>
                </TableRow>
              ) : (
                slips.map((slip) => (
                  <TableRow key={slip.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{slip.userName}</div>
                        <div className="text-sm text-muted-foreground">{slip.userEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">฿{formatAmount(slip.amount)}</span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(slip.status)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{formatDate(slip.createdAt)}</div>
                        {slip.verifiedAt && (
                          <div className="text-sm text-muted-foreground">
                            ตรวจสอบ: {formatDate(slip.verifiedAt)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openSlipImage(slip.fileUrl)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {slip.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateSlipStatus(slip.id, 'verified')}
                              disabled={updatingSlip === slip.id}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              {updatingSlip === slip.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateSlipStatus(slip.id, 'rejected')}
                              disabled={updatingSlip === slip.id}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
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