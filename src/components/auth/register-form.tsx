'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/hooks/use-auth';
import { registerSchema } from '@/lib/validations';
import { RegisterData, RegisterRequest } from '@/types';

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    console.log('Submitting registration data:', data); // Debug log
    const { confirmPassword, ...registerData } = data;
    await registerUser(registerData as RegisterRequest);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gradient">สมัครสมาชิก</h1>
        <p className="text-muted-foreground">
          สร้างบัญชีใหม่เพื่อเริ่มใช้งาน
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="name"
              type="text"
              placeholder="ตัวอย่าง: user123"
              gaming
              className="pl-10"
              {...register('name')}
            />
          </div>
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            อีเมล
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              gaming
              className="pl-10"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            รหัสผ่าน
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="รหัสผ่านของคุณ"
              gaming
              className="pl-10 pr-10"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>รหัสผ่านต้องมี:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>อย่างน้อย 8 ตัวอักษร</li>
              <li>ตัวพิมพ์เล็ก (a-z)</li>
              <li>ตัวพิมพ์ใหญ่ (A-Z)</li>
              <li>ตัวเลข (0-9)</li>
              <li>อักขระพิเศษ (!@#$%^&* เป็นต้น)</li>
            </ul>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            ยืนยันรหัสผ่าน
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="ยืนยันรหัสผ่าน"
              gaming
              className="pl-10 pr-10"
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          variant="gaming" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" color="white" className="mr-2" />
              กำลังสมัครสมาชิก...
            </>
          ) : (
            'สมัครสมาชิก'
          )}
        </Button>
      </form>

      {/* Login Link */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          มีบัญชีแล้ว?{' '}
          <Link 
            href="/login" 
            className="text-neon-green hover:text-neon-blue transition-colors font-medium"
          >
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
} 