'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Package, CreditCard, BarChart3, Settings } from 'lucide-react';
import Link from 'next/link';

const quickActions = [
  {
    title: 'เพิ่มสินค้าใหม่',
    description: 'เพิ่มไอดีเกมใหม่เข้าสู่ระบบ',
    href: '/admin/products/new',
    icon: Plus,
    color: 'bg-neon-green/10 hover:bg-neon-green/20 border-neon-green/30',
  },
  {
    title: 'จัดการผู้ใช้',
    description: 'ดูและแก้ไขข้อมูลผู้ใช้งาน',
    href: '/admin/users',
    icon: Users,
    color: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30',
  },
  {
    title: 'ตรวจสลิป',
    description: 'ตรวจสอบสลิปการโอนเงิน',
    href: '/admin/slips',
    icon: CreditCard,
    color: 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30',
  },
  {
    title: 'ดูรายงาน',
    description: 'วิเคราะห์ยอดขายและสถิติ',
    href: '/admin/analytics',
    icon: BarChart3,
    color: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30',
  },
];

export function QuickActions() {
  return (
    <Card gaming>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>การกระทำด่วน</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            
            return (
              <Button
                key={index}
                variant="outline"
                asChild
                className={`h-auto p-4 flex flex-col items-start space-y-2 ${action.color}`}
              >
                <Link href={action.href}>
                  <Icon className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">{action.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </Link>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 