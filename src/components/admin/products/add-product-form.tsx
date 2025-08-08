'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useUIStore } from '@/stores/ui-store';
import { SUPPORTED_GAMES } from '@/lib/constants';
import { z } from 'zod';
import { Save, ArrowLeft } from 'lucide-react';

const addProductSchema = z.object({
  title: z.string().min(3, 'ชื่อสินค้าต้องมีอย่างน้อย 3 ตัวอักษร'),
  description: z.string().min(10, 'คำอธิบายต้องมีอย่างน้อย 10 ตัวอักษร'),
  price: z.number().min(1, 'ราคาต้องมากกว่า 0 บาท'),
  gameId: z.string().min(1, 'กรุณาเลือกเกม'),
  rank: z.string().optional(),
  level: z.number().optional(),
  accountData: z.object({
    username: z.string().min(1, 'กรุณากรอก Username'),
    password: z.string().min(1, 'กรุณากรอกรหัสผ่าน'),
    email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง').optional(),
    additionalInfo: z.string().optional(),
  }),
});

type AddProductData = z.infer<typeof addProductSchema>;

export function AddProductForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useUIStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<AddProductData>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      price: 0,
      level: 1,
      accountData: {
        username: '',
        password: '',
        email: '',
        additionalInfo: '',
      },
    },
  });

  const selectedGameId = watch('gameId');
  const selectedGame = SUPPORTED_GAMES.find(game => game.id === selectedGameId);

  const onSubmit = async (data: AddProductData) => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        addToast({
          type: 'success',
          title: 'เพิ่มสินค้าสำเร็จ',
          message: 'สินค้าใหม่ถูกเพิ่มเข้าสู่ระบบแล้ว',
        });
        
        reset();
        router.push('/admin/products');
      } else {
        addToast({
          type: 'error',
          title: 'เกิดข้อผิดพลาด',
          message: result.error || 'ไม่สามารถเพิ่มสินค้าได้',
        });
      }
    } catch (error) {
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
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">ชื่อสินค้า</label>
          <Input
            placeholder="เช่น RoV Diamond Account - Full Skin"
            gaming
            {...register('title')}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">เกม</label>
          <Select onValueChange={(value: string) => setValue('gameId', value)}>
            <SelectTrigger gaming>
              <SelectValue placeholder="เลือกเกม" />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_GAMES.map((game) => (
                <SelectItem key={game.id} value={game.id}>
                  {game.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.gameId && (
            <p className="text-sm text-red-500">{errors.gameId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">ราคา (บาท)</label>
          <Input
            type="number"
            placeholder="0"
            gaming
            {...register('price', { valueAsNumber: true })}
          />
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">แรงค์/ระดับ</label>
          <Input
            placeholder="เช่น Diamond, Immortal, Grandmaster"
            gaming
            {...register('rank')}
          />
          {errors.rank && (
            <p className="text-sm text-red-500">{errors.rank.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">คำอธิบาย</label>
        <Textarea
          placeholder="รายละเอียดของสินค้า สกินที่มี ฯลฯ"
          gaming
          rows={3}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลบัญชีเกม</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                placeholder="Username ของบัญชีเกม"
                gaming
                {...register('accountData.username')}
              />
              {errors.accountData?.username && (
                <p className="text-sm text-red-500">{errors.accountData.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">รหัสผ่าน</label>
              <Input
                type="password"
                placeholder="รหัสผ่านของบัญชีเกม"
                gaming
                {...register('accountData.password')}
              />
              {errors.accountData?.password && (
                <p className="text-sm text-red-500">{errors.accountData.password.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">อีเมล (ถ้ามี)</label>
            <Input
              type="email"
              placeholder="อีเมลที่ผูกกับบัญชีเกม"
              gaming
              {...register('accountData.email')}
            />
            {errors.accountData?.email && (
              <p className="text-sm text-red-500">{errors.accountData.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">ข้อมูลเพิ่มเติม</label>
            <Textarea
              placeholder="ข้อมูลเพิ่มเติมเกี่ยวกับบัญชี เช่น PIN, คำถามความปลอดภัย ฯลฯ"
              gaming
              rows={3}
              {...register('accountData.additionalInfo')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/products')}
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          ยกเลิก
        </Button>
        
        <Button
          type="submit"
          variant="gaming"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" color="white" className="mr-2" />
              กำลังเพิ่ม...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              เพิ่มสินค้า
            </>
          )}
        </Button>
      </div>
    </form>
  );
} 