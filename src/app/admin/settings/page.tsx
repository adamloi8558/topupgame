import { Metadata } from 'next';
import { SystemSettings } from '@/components/admin/settings/system-settings';
import { BankSettings } from '@/components/admin/settings/bank-settings';
import { EasySlipSettings } from '@/components/admin/settings/easyslip-settings';
import { NotificationSettings } from '@/components/admin/settings/notification-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'Admin - ตั้งค่าระบบ',
  description: 'จัดการการตั้งค่าระบบและการกำหนดค่าต่างๆ',
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gradient">ตั้งค่าระบบ</h1>
        <p className="text-muted-foreground">
          จัดการการตั้งค่าระบบ การชำระเงิน และการกำหนดค่าต่างๆ
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="system" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="system">ระบบทั่วไป</TabsTrigger>
          <TabsTrigger value="bank">บัญชีธนาคาร</TabsTrigger>
          <TabsTrigger value="easyslip">EasySlip API</TabsTrigger>
          <TabsTrigger value="notifications">การแจ้งเตือน</TabsTrigger>
        </TabsList>
        
        <TabsContent value="system" className="mt-6">
          <SystemSettings />
        </TabsContent>
        
        <TabsContent value="bank" className="mt-6">
          <BankSettings />
        </TabsContent>
        
        <TabsContent value="easyslip" className="mt-6">
          <EasySlipSettings />
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
} 