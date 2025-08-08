'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useUIStore } from '@/stores/ui-store';
import { CreditCard, Save, Key, Eye, EyeOff } from 'lucide-react';

interface EasySlipConfig {
  accessToken: string;
  enabled: boolean;
  duplicateCheck: boolean;
  autoVerify: boolean;
}

export function EasySlipSettings() {
  const [config, setConfig] = useState<EasySlipConfig>({
    accessToken: '********************************',
    enabled: true,
    duplicateCheck: true,
    autoVerify: true,
  });
  const [showToken, setShowToken] = useState(false);
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
          message: 'การตั้งค่า EasySlip API ถูกบันทึกแล้ว',
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to save EasySlip settings:', error);
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถบันทึกการตั้งค่าได้',
      });
      setIsLoading(false);
    }
  };

  const updateConfig = (key: keyof EasySlipConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* API Configuration */}
      <Card gaming>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>การตั้งค่า API</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Access Token</label>
            <div className="relative">
              <Input
                type={showToken ? 'text' : 'password'}
                value={config.accessToken}
                onChange={(e) => updateConfig('accessToken', e.target.value)}
                gaming
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              >
                {showToken ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Access Token สำหรับเชื่อมต่อกับ EasySlip API
            </p>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card gaming>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>การตั้งค่าระบบ</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">เปิดใช้งาน EasySlip API</div>
              <div className="text-sm text-muted-foreground">
                เปิด/ปิดการตรวจสอบสลิปอัตโนมัติ
              </div>
            </div>
            <Switch
              checked={config.enabled}
              onCheckedChange={(checked) => updateConfig('enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">ตรวจสอบสลิปซ้ำ</div>
              <div className="text-sm text-muted-foreground">
                ป้องกันการใช้สลิปซ้ำในระบบ
              </div>
            </div>
            <Switch
              checked={config.duplicateCheck}
              onCheckedChange={(checked) => updateConfig('duplicateCheck', checked)}
              disabled={!config.enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">ตรวจสอบและเติมพ้อยอัตโนมัติ</div>
              <div className="text-sm text-muted-foreground">
                เติมพ้อยทันทีหลังตรวจสอบสลิปสำเร็จ
              </div>
            </div>
            <Switch
              checked={config.autoVerify}
              onCheckedChange={(checked) => updateConfig('autoVerify', checked)}
              disabled={!config.enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* API Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">ข้อมูล EasySlip API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <p><strong>Endpoint:</strong> https://developer.easyslip.com/api/v1/verify</p>
            <p><strong>Method:</strong> POST</p>
            <p><strong>Headers:</strong> Authorization: Bearer [ACCESS_TOKEN]</p>
            <p><strong>สถานะ API:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${config.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {config.enabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
              </span>
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