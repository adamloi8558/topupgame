'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/hooks/use-auth';
import { useUIStore } from '@/stores/ui-store';
import { profileUpdateSchema } from '@/lib/validations';
import { ProfileUpdateData, ApiResponse } from '@/types';
import { User, Mail, Save } from 'lucide-react';

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, checkAuthStatus } = useAuth();
  const { addToast } = useUIStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
  });

  // Load user data into form
  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
    }
  }, [user, setValue]);

  const onSubmit = async (data: ProfileUpdateData) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/profile', {
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
          title: 'อัปเดตสำเร็จ',
          message: 'ข้อมูลโปรไฟล์ถูกอัปเดตแล้ว',
        });
        
        // Refresh user data
        await checkAuthStatus();
      } else {
        addToast({
          type: 'error',
          title: 'เกิดข้อผิดพลาด',
          message: result.error || 'ไม่สามารถอัปเดตข้อมูลได้',
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>Username</span>
        </label>
        <Input
          id="name"
          placeholder="กรอก Username ของคุณ"
          gaming
          {...register('name')}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium flex items-center space-x-2">
          <Mail className="h-4 w-4" />
          <span>อีเมล</span>
        </label>
        <Input
          id="email"
          type="email"
          placeholder="กรอกอีเมลของคุณ"
          gaming
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
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
            กำลังบันทึก...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            บันทึกการเปลี่ยนแปลง
          </>
        )}
      </Button>
    </form>
  );
} 