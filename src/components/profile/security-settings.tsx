'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useUIStore } from '@/stores/ui-store';
import { changePasswordSchema } from '@/lib/validations';
import { ChangePasswordData, ApiResponse } from '@/types';
import { Eye, EyeOff, Shield, Lock, Key } from 'lucide-react';

export function SecuritySettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useUIStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordData) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/profile/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        addToast({
          type: 'success',
          title: 'เปลี่ยนรหัสผ่านสำเร็จ',
          message: 'รหัสผ่านของคุณถูกเปลี่ยนแล้ว',
        });
        reset(); // Clear form
      } else {
        addToast({
          type: 'error',
          title: 'เกิดข้อผิดพลาด',
          message: result.error || 'ไม่สามารถเปลี่ยนรหัสผ่านได้',
        });
      }
    } catch (error) {
      console.error('Change password error:', error);
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password Card */}
      <Card gaming>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>เปลี่ยนรหัสผ่าน</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="text-sm font-medium flex items-center space-x-2">
                <Lock className="h-4 w-4" />
                <span>รหัสผ่านปัจจุบัน</span>
              </label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="กรอกรหัสผ่านปัจจุบัน"
                  gaming
                  {...register('currentPassword')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <span>รหัสผ่านใหม่</span>
              </label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="กรอกรหัสผ่านใหม่"
                  gaming
                  {...register('newPassword')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-500">{errors.newPassword.message}</p>
              )}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>รหัสผ่านใหม่ต้องมี:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>อย่างน้อย 8 ตัวอักษร</li>
                  <li>ตัวพิมพ์เล็ก (a-z)</li>
                  <li>ตัวพิมพ์ใหญ่ (A-Z)</li>
                  <li>ตัวเลข (0-9)</li>
                  <li>อักขระพิเศษ (!@#$%^&* เป็นต้น)</li>
                </ul>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <label htmlFor="confirmNewPassword" className="text-sm font-medium flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <span>ยืนยันรหัสผ่านใหม่</span>
              </label>
              <div className="relative">
                <Input
                  id="confirmNewPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                  gaming
                  {...register('confirmNewPassword')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
              </div>
              {errors.confirmNewPassword && (
                <p className="text-sm text-red-500">{errors.confirmNewPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="gaming"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" color="white" className="mr-2" />
                  กำลังเปลี่ยนรหัสผ่าน...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  เปลี่ยนรหัสผ่าน
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">คำแนะนำเรื่องความปลอดภัย</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <p>• ใช้รหัสผ่านที่มีความปลอดภัยสูง อย่างน้อย 8 ตัวอักษร</p>
            <p>• ควรมีทั้งตัวพิมพ์เล็ก ตัวพิมพ์ใหญ่ และตัวเลข</p>
            <p>• ไม่แชร์รหัสผ่านกับผู้อื่น</p>
            <p>• เปลี่ยนรหัสผ่านอย่างสม่ำเสมอ</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 