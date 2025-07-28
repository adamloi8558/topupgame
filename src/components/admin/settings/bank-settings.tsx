'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/ui-store';
import { Save, CreditCard, Copy, CheckCircle } from 'lucide-react';

export function BankSettings() {
  const { addToast } = useUIStore();
  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState({
    bankName: 'กรุงไทย',
    accountNumber: '6645533950',
    accountName: 'DumStore',
    branchName: 'สาขาท่าพระ',
    accountType: 'savings',
    isActive: true,
  });

  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(settings.accountNumber);
      setCopied(true);
      addToast({
        type: 'success',
        title: 'คัดลอกแล้ว',
        message: 'คัดลอกเลขบัญชีเรียบร้อย',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถคัดลอกได้',
      });
    }
  };

  const handleSave = async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addToast({
        type: 'success',
        title: 'บันทึกสำเร็จ',
        message: 'ข้อมูลบัญชีธนาคารถูกบันทึกแล้ว',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถบันทึกข้อมูลได้',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card gaming>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>ข้อมูลบัญชีธนาคาร</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ธนาคาร</label>
              <Select value={settings.bankName} onValueChange={(value) => setSettings(prev => ({ ...prev, bankName: value }))}>
                <SelectTrigger gaming>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="กรุงไทย">ธนาคารกรุงไทย</SelectItem>
                  <SelectItem value="กสิกรไทย">ธนาคารกสิกรไทย</SelectItem>
                  <SelectItem value="กรุงเทพ">ธนาคารกรุงเทพ</SelectItem>
                  <SelectItem value="ไทยพาณิชย์">ธนาคารไทยพาณิชย์</SelectItem>
                  <SelectItem value="กรุงศรีอยุธยา">ธนาคารกรุงศรีอยุธยา</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">ชื่อบัญชี</label>
              <Input
                value={settings.accountName}
                onChange={(e) => setSettings(prev => ({ ...prev, accountName: e.target.value }))}
                gaming
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">เลขที่บัญชี</label>
            <div className="flex space-x-2">
              <Input
                value={settings.accountNumber}
                onChange={(e) => setSettings(prev => ({ ...prev, accountNumber: e.target.value }))}
                gaming
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyAccountNumber}
                className="px-3"
              >
                {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">สาขา</label>
              <Input
                value={settings.branchName}
                onChange={(e) => setSettings(prev => ({ ...prev, branchName: e.target.value }))}
                gaming
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">ประเภทบัญชี</label>
              <Select value={settings.accountType} onValueChange={(value) => setSettings(prev => ({ ...prev, accountType: value }))}>
                <SelectTrigger gaming>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="savings">บัญชีออมทรัพย์</SelectItem>
                  <SelectItem value="current">บัญชีกระแสรายวัน</SelectItem>
                  <SelectItem value="fixed">บัญชีประจำ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview Card */}
          <div className="mt-6 p-4 bg-gaming-darker rounded-lg border border-neon-green/20">
            <h4 className="text-sm font-medium mb-3">ตัวอย่างการแสดงผล</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ธนาคาร:</span>
                <span>{settings.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ชื่อบัญชี:</span>
                <span>{settings.accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">เลขบัญชี:</span>
                <span className="font-mono text-neon-green">{settings.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">สาขา:</span>
                <span>{settings.branchName}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="gaming" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          บันทึกข้อมูลบัญชี
        </Button>
      </div>
    </div>
  );
} 