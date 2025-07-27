'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { Bell, User, LogOut, Settings, Home } from 'lucide-react';
import Link from 'next/link';

export function AdminHeader() {
  const { user, logout } = useAuth();
  const [notifications] = useState(3); // Mock notification count

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Page Title */}
        <div>
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            จัดการระบบเติมเกมและขายไอดีเกม
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Back to Site */}
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              กลับสู่เว็บไซต์
            </Link>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center p-0"
              >
                {notifications}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-neon-green rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm">{user?.name || 'Admin'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>บัญชีผู้ดูแลระบบ</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  โปรไฟล์
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  ตั้งค่า
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                ออกจากระบบ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
} 