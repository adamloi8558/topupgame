'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Users,
  Crown,
  User,
  DollarSign,
  Plus,
  Minus
} from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface UserItem {
  id: string;
  name: string;
  email: string;
  points: number;
  role: 'user' | 'admin';
  lastLoginAt?: string;
  createdAt: string;
}

export function UsersTable() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState<number>(0);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // Mock data
      setTimeout(() => {
        setUsers([
          {
            id: 'user-1',
            name: 'นายสมชาย ใจดี',
            email: 'somchai@email.com',
            points: 1250,
            role: 'user',
            lastLoginAt: '2024-01-26T10:30:00Z',
            createdAt: '2024-01-15T08:00:00Z',
          },
          {
            id: 'user-2',
            name: 'นางสาวสมใส รักเกม',
            email: 'somsai@email.com',
            points: 850,
            role: 'user',
            lastLoginAt: '2024-01-26T09:15:00Z',
            createdAt: '2024-01-20T14:30:00Z',
          },
          {
            id: 'admin-1',
            name: 'ผู้ดูแลระบบ',
            email: 'admin@topupgame.com',
            points: 999999,
            role: 'admin',
            lastLoginAt: '2024-01-26T11:00:00Z',
            createdAt: '2024-01-01T00:00:00Z',
          },
        ]);
        setTotalPages(5);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setIsLoading(false);
    }
  };

  const updateUserPoints = async (userId: string, newPoints: number) => {
    try {
      // Mock API call
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, points: Math.max(0, user.points + newPoints) }
          : user
      ));
      setEditingUser(null);
      setPointsToAdd(0);
    } catch (error) {
      console.error('Failed to update user points:', error);
    }
  };

  const toggleUserRole = async (userId: string) => {
    try {
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: user.role === 'admin' ? 'user' : 'admin' }
          : user
      ));
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?')) {
      try {
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const getRoleBadge = (role: string) => {
    return role === 'admin' ? (
      <Badge variant="default" className="bg-purple-600">
        <Crown className="mr-1 h-3 w-3" />
        Admin
      </Badge>
    ) : (
      <Badge variant="secondary">
        <User className="mr-1 h-3 w-3" />
        User
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
          <Users className="h-5 w-5" />
          <span>รายการผู้ใช้งาน</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อ</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead>พ้อย</TableHead>
                <TableHead>บทบาท</TableHead>
                <TableHead>เข้าใช้ล่าสุด</TableHead>
                <TableHead>สมัครเมื่อ</TableHead>
                <TableHead className="text-right">การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="font-mono">
                    <span className="text-neon-green">{formatPoints(user.points)}</span> พ้อย
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(user.role)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'ยังไม่เคยเข้าใช้'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(user.createdAt)}
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
                        
                        <DropdownMenuItem onClick={() => setEditingUser(user)}>
                          <DollarSign className="mr-2 h-4 w-4" />
                          จัดการพ้อย
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => toggleUserRole(user.id)}>
                          <Crown className="mr-2 h-4 w-4" />
                          {user.role === 'admin' ? 'ลดเป็น User' : 'เลื่อนเป็น Admin'}
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          แก้ไขข้อมูล
                        </DropdownMenuItem>
                        
                        {user.role !== 'admin' && (
                          <DropdownMenuItem 
                            onClick={() => deleteUser(user.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            ลบผู้ใช้
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Points Management Dialog */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>จัดการพ้อย - {editingUser?.name}</DialogTitle>
              <DialogDescription>
                พ้อยปัจจุบัน: {editingUser ? formatPoints(editingUser.points) : 0} พ้อย
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPointsToAdd(-100)}
                >
                  <Minus className="h-4 w-4" />
                  100
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPointsToAdd(-500)}
                >
                  <Minus className="h-4 w-4" />
                  500
                </Button>
                <Input
                  type="number"
                  placeholder="จำนวนพ้อย (+/-)"
                  value={pointsToAdd}
                  onChange={(e) => setPointsToAdd(Number(e.target.value))}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPointsToAdd(100)}
                >
                  <Plus className="h-4 w-4" />
                  100
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPointsToAdd(500)}
                >
                  <Plus className="h-4 w-4" />
                  500
                </Button>
              </div>
              
              {pointsToAdd !== 0 && (
                <div className="text-sm text-muted-foreground">
                  พ้อยใหม่จะเป็น: {editingUser ? formatPoints(Math.max(0, editingUser.points + pointsToAdd)) : 0} พ้อย
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingUser(null)}>
                ยกเลิก
              </Button>
              <Button 
                variant="gaming"
                onClick={() => editingUser && updateUserPoints(editingUser.id, pointsToAdd)}
                disabled={pointsToAdd === 0}
              >
                บันทึก
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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