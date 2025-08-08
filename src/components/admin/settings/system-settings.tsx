'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useUIStore } from '@/stores/ui-store';
import { Save, Settings, Globe, Shield } from 'lucide-react';

export function SystemSettings() {
  const { addToast } = useUIStore();
  const [settings, setSettings] = useState({
    siteName: 'DumStore',
    siteDescription: 'เว็บไซต์เติมเกมและขายไอดีเกมออนไลน์',
    contactEmail: 'support@dumstore.com',
    supportPhone: '02-123-4567',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerification: true,
    autoApproveOrders: false,
    maxFileSize: 5,
    sessionTimeout: 30,
  });

  const handleSave = async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addToast({
        type: 'success',
        title: 'บันทึกสำเร็จ',
        message: 'การตั้งค่าระบบถูกบันทึกแล้ว',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถบันทึกการตั้งค่าได้',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card gaming>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>การตั้งค่าทั่วไป</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ชื่อเว็บไซต์</label>
              <Input
                value={settings.siteName}
                onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                gaming
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">อีเมลติดต่อ</label>
              <Input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                gaming
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">คำอธิบายเว็บไซต์</label>
            <Textarea
              value={settings.siteDescription}
              onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
              rows={3}
              gaming
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">เบอร์โทรสนับสนุน</label>
            <Input
              value={settings.supportPhone}
              onChange={(e) => setSettings(prev => ({ ...prev, supportPhone: e.target.value }))}
              gaming
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card gaming>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>การตั้งค่าความปลอดภัย</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">โหมดบำรุงรักษา</h4>
              <p className="text-xs text-muted-foreground">ปิดการเข้าถึงเว็บไซต์ชั่วคราว</p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
              />
              <Badge variant={settings.maintenanceMode ? "destructive" : "default"}>
                {settings.maintenanceMode ? 'เปิด' : 'ปิด'}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">การสมัครสมาชิก</h4>
              <p className="text-xs text-muted-foreground">อนุญาตให้ผู้ใช้สมัครสมาชิกใหม่</p>
            </div>
            <Switch
              checked={settings.registrationEnabled}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, registrationEnabled: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">การยืนยันอีเมล</h4>
              <p className="text-xs text-muted-foreground">ต้องยืนยันอีเมลก่อนใช้งาน</p>
            </div>
            <Switch
              checked={settings.emailVerification}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailVerification: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">อนุมัติคำสั่งซื้ออัตโนมัติ</h4>
              <p className="text-xs text-muted-foreground">อนุมัติคำสั่งซื้อโดยไม่ต้องรอแอดมิน</p>
            </div>
            <Switch
              checked={settings.autoApproveOrders}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoApproveOrders: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* File & Session Settings */}
      <Card gaming>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>การตั้งค่าระบบ</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ขนาดไฟล์สูงสุด (MB)</label>
              <Input
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => setSettings(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }))}
                gaming
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">หมดเวลา Session (นาที)</label>
              <Input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                gaming
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="gaming" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          บันทึกการตั้งค่า
        </Button>
      </div>
    </div>
  );
} 