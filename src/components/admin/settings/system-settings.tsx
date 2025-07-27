'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useUIStore } from '@/stores/ui-store';
import { Settings, Save, Globe, Shield, Clock } from 'lucide-react';

interface SystemConfig {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  autoTopupEnabled: boolean;
  maxFileSize: number;
  sessionTimeout: number;
}

export function SystemSettings() {
  const [config, setConfig] = useState<SystemConfig>({
    siteName: 'TopUp Game Store',
    siteDescription: 'ระบบเติมเกมและขายไอดีเกมออนไลน์',
    maintenanceMode: false,
    registrationEnabled: true,
    autoTopupEnabled: true,
    maxFileSize: 5,
    sessionTimeout: 30,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useUIStore();

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      // Mock API call
      setTimeout(() => {
        addToast({
          type: 'success',
          title: 'บันทึกสำเร็จ',
          message: 'การตั้งค่าระบบถูกบันทึกแล้ว',
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถบันทึกการตั้งค่าได้',
      });
      setIsLoading(false);
    }
  };

  const updateConfig = (key: keyof SystemConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Site Information */}
      <Card gaming>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>ข้อมูลเว็บไซต์</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">ชื่อเว็บไซต์</label>
            <Input
              value={config.siteName}
              onChange={(e) => updateConfig('siteName', e.target.value)}
              gaming
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">คำอธิบายเว็บไซต์</label>
            <Textarea
              value={config.siteDescription}
              onChange={(e) => updateConfig('siteDescription', e.target.value)}
              rows={3}
              gaming
            />
          </div>
        </CardContent>
      </Card>

      {/* System Controls */}
      <Card gaming>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>การควบคุมระบบ</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">โหมดบำรุงรักษา</div>
              <div className="text-sm text-muted-foreground">
                ปิดเว็บไซต์ชั่วคราวเพื่อบำรุงรักษา
              </div>
            </div>
            <Switch
              checked={config.maintenanceMode}
              onCheckedChange={(checked) => updateConfig('maintenanceMode', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">เปิดการลงทะเบียน</div>
              <div className="text-sm text-muted-foreground">
                อนุญาตให้ผู้ใช้ใหม่สมัครสมาชิก
              </div>
            </div>
            <Switch
              checked={config.registrationEnabled}
              onCheckedChange={(checked) => updateConfig('registrationEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">เติมพ้อยอัตโนมัติ</div>
              <div className="text-sm text-muted-foreground">
                เติมพ้อยทันทีหลังตรวจสอบสลิป
              </div>
            </div>
            <Switch
              checked={config.autoTopupEnabled}
              onCheckedChange={(checked) => updateConfig('autoTopupEnabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security & Limits */}
      <Card gaming>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>ความปลอดภัยและข้อจำกัด</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">ขนาดไฟล์สูงสุด (MB)</label>
            <Input
              type="number"
              value={config.maxFileSize}
              onChange={(e) => updateConfig('maxFileSize', parseInt(e.target.value))}
              gaming
            />
            <p className="text-xs text-muted-foreground">
              ขนาดไฟล์สูงสุดสำหรับการอัปโหลดสลิป
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Session Timeout (นาที)</label>
            <Input
              type="number"
              value={config.sessionTimeout}
              onChange={(e) => updateConfig('sessionTimeout', parseInt(e.target.value))}
              gaming
            />
            <p className="text-xs text-muted-foreground">
              ระยะเวลาที่ผู้ใช้จะถูกออกจากระบบอัตโนมัติ
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          variant="gaming"
          size="lg"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" color="white" className="mr-2" />
              กำลังบันทึก...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              บันทึกการตั้งค่า
            </>
          )}
        </Button>
      </div>
    </div>
  );
} 