'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2 } from 'lucide-react';

export function GameSettings() {
  return (
    <div className="space-y-6">
      <Card gaming>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gamepad2 className="h-5 w-5" />
            <span>การจัดการเกม</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Gamepad2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">การตั้งค่าเกม</h3>
            <p className="text-muted-foreground mb-4">
              ฟีเจอร์นี้จะพร้อมใช้งานในเร็วๆ นี้
            </p>
            <Button variant="outline" disabled>
              จัดการเกมและแรงค์
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 