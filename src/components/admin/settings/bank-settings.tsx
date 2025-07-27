'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useUIStore } from '@/stores/ui-store';
import { CreditCard, Save, Building } from 'lucide-react';

interface BankConfig {
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankCode: string;
  branch: string;
}

export function BankSettings() {
  const [config, setConfig] = useState<BankConfig>({
    bankName: 'ธนาคารกรุงเทพ',
    accountNumber: '123-4-56789-0',
    accountName: 'TopUp Game Store',
    bankCode: 'BBL',
    branch: 'สาขาลาดพร้าว',
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
          message: 'ข้อมูลบัญชีธนาคารถูกบันทึกแล้ว',
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to save bank settings:', error);
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถบันทึกข้อมูลได้',
      });
      setIsLoading(false);
    }
  };

  const updateConfig = (key: keyof BankConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <Card gaming>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>ข้อมูลบัญชีธนาคารร้าน</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">ชื่อธนาคาร</label>
            <Input
              value={config.bankName}
              onChange={(e) => updateConfig('bankName', e.target.value)}
              gaming
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">เลขที่บัญชี</label>
            <Input
              value={config.accountNumber}
              onChange={(e) => updateConfig('accountNumber', e.target.value)}
              gaming
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">ชื่อบัญชี</label>
            <Input
              value={config.accountName}
              onChange={(e) => updateConfig('accountName', e.target.value)}
              gaming
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">รหัสธนาคาร</label>
              <Input
                value={config.bankCode}
                onChange={(e) => updateConfig('bankCode', e.target.value)}
                gaming
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">สาขา</label>
              <Input
                value={config.branch}
                onChange={(e) => updateConfig('branch', e.target.value)}
                gaming
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>ตัวอย่างที่ลูกค้าจะเห็น</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-neon-green/10 to-neon-blue/10 p-4 rounded-lg border border-neon-green/30">
            <h3 className="font-semibold mb-3">ข้อมูลการโอนเงิน</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>ธนาคาร:</span>
                <span className="font-medium">{config.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span>เลขที่บัญชี:</span>
                <span className="font-mono font-medium">{config.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>ชื่อบัญชี:</span>
                <span className="font-medium">{config.accountName}</span>
              </div>
              <div className="flex justify-between">
                <span>สาขา:</span>
                <span className="font-medium">{config.branch}</span>
              </div>
            </div>
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
              บันทึกข้อมูลธนาคาร
            </>
          )}
        </Button>
      </div>
    </div>
  );
} 