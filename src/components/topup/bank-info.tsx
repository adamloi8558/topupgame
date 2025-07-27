'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BANK_INFO } from '@/lib/constants';
import { useUIStore } from '@/stores/ui-store';
import { Copy, Building2, CreditCard, User } from 'lucide-react';

interface BankInfoProps {
  amount: number;
}

export function BankInfo({ amount }: BankInfoProps) {
  const { addToast } = useUIStore();

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addToast({
        type: 'success',
        title: 'คัดลอกแล้ว',
        message: `คัดลอก${label}แล้ว`,
      });
    } catch (error) {
      console.error('Copy failed:', error);
      addToast({
        type: 'error',
        title: 'คัดลอกไม่สำเร็จ',
        message: 'กรุณาคัดลอกด้วยตนเอง',
      });
    }
  };

  return (
    <Card gaming>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building2 className="h-5 w-5" />
          <span>ข้อมูลบัญชีธนาคาร</span>
        </CardTitle>
        <CardDescription>
          โอนเงินไปยังบัญชีด้านล่างแล้วอัปโหลดสลิป
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bank Name */}
        <div className="flex items-center justify-between p-4 bg-gaming-darker/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Building2 className="h-6 w-6 text-neon-green" />
            <div>
              <div className="text-sm text-muted-foreground">ธนาคาร</div>
              <div className="font-semibold">{BANK_INFO.bankName}</div>
            </div>
          </div>
        </div>

        {/* Account Number */}
        <div className="flex items-center justify-between p-4 bg-gaming-darker/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-6 w-6 text-neon-blue" />
            <div>
              <div className="text-sm text-muted-foreground">เลขบัญชี</div>
              <div className="font-semibold font-mono">{BANK_INFO.accountNumber}</div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(BANK_INFO.accountNumber, 'เลขบัญชี')}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        {/* Account Name */}
        <div className="flex items-center justify-between p-4 bg-gaming-darker/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-neon-purple" />
            <div>
              <div className="text-sm text-muted-foreground">ชื่อบัญชี</div>
              <div className="font-semibold">{BANK_INFO.accountName}</div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(BANK_INFO.accountName, 'ชื่อบัญชี')}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        {/* Amount */}
        <div className="p-4 bg-neon-green/10 border border-neon-green/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">จำนวนเงินที่ต้องโอน</div>
              <div className="text-2xl font-bold text-neon-green">฿{amount.toLocaleString()}</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(amount.toString(), 'จำนวนเงิน')}
              className="border-neon-green text-neon-green hover:bg-neon-green hover:text-gaming-dark"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Important Note */}
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div className="text-sm space-y-2">
            <div className="font-semibold text-yellow-500">⚠️ หมายเหตุสำคัญ</div>
            <ul className="space-y-1 text-yellow-500/80">
              <li>• โอนเงินตามจำนวนที่ระบุให้ตรงทุกสตางค์</li>
              <li>• อัปโหลดสลิปภายใน 24 ชั่วโมง</li>
              <li>• ระบบจะตรวจสอบสลิปอัตโนมัติและเติมพ้อยทันที</li>
              <li>• หากมีปัญหาติดต่อแอดมิน</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 