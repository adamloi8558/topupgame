'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard,
  Users,
  ShoppingBag,
  Receipt,
  BarChart3,
  Settings,
  FileText,
  CreditCard,
  Package,
  TrendingUp
} from 'lucide-react';

const adminMenuItems = [
  {
    title: 'ภาพรวม',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'คำสั่งซื้อ',
    href: '/admin/orders',
    icon: Receipt,
  },
  {
    title: 'ผู้ใช้งาน',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'สินค้า',
    href: '/admin/products',
    icon: Package,
  },
  {
    title: 'สลิปการโอน',
    href: '/admin/slips',
    icon: CreditCard,
  },
  {
    title: 'รายงาน',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'ตั้งค่า',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-full w-64 border-r border-border bg-card/50 backdrop-blur-sm z-40">
      <div className="p-6">
        {/* Logo */}
        <Link href="/admin" className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-neon-green to-neon-blue rounded-lg flex items-center justify-center">
            <LayoutDashboard className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">TopUp Game Store</p>
          </div>
        </Link>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {adminMenuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive 
                    ? 'bg-neon-green/20 text-neon-green border border-neon-green/30' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Quick Stats */}
      <div className="absolute bottom-6 left-6 right-6">
        <Card className="p-4 bg-gradient-to-r from-neon-green/10 to-neon-blue/10">
          <div className="text-center space-y-2">
            <TrendingUp className="h-6 w-6 mx-auto text-neon-green" />
            <div>
              <p className="text-xs text-muted-foreground">สถานะระบบ</p>
              <p className="text-sm font-medium text-neon-green">ออนไลน์</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 