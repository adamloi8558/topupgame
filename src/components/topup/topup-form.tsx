'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/hooks/use-auth';
import { useUIStore } from '@/stores/ui-store';
import { topupOrderSchema } from '@/lib/validations';
import { TOPUP_AMOUNTS } from '@/lib/constants';
import { TopupOrderData, Game, ApiResponse } from '@/types';
import { cn } from '@/lib/utils';
import { Gamepad2, CreditCard, Zap } from 'lucide-react';

interface TopupFormProps {
  game?: Game;
}

export function TopupForm({ game }: TopupFormProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, requireAuth } = useAuth();
  const { addToast } = useUIStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TopupOrderData>({
    resolver: zodResolver(topupOrderSchema),
    defaultValues: {
      gameId: game?.id || '',
      amount: 0,
      gameUid: '',
    },
  });

  const watchedGameId = watch('gameId');

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    if (game) {
      setValue('gameId', game.id);
    }
  }, [game, setValue]);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games?active=true');
      const result: ApiResponse<Game[]> = await response.json();
      if (result.success && result.data) {
        setGames(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch games:', error);
    }
  };

  const selectedGame = games.find(g => g.id === watchedGameId) || game;

  const onSubmit = async (data: TopupOrderData) => {
    if (!requireAuth()) return;

    try {
      setIsLoading(true);
      
      const response = await fetch('/api/orders/topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        addToast({
          type: 'success',
          title: 'คำสั่งเติมพ้อยสำเร็จ',
          message: 'กรุณาดำเนินการชำระเงิน',
        });
        
        // Navigate to checkout with order data
        router.push(`/topup/checkout?order=${result.data?.id}`);
      } else {
        addToast({
          type: 'error',
          title: 'เกิดข้อผิดพลาด',
          message: result.error || 'ไม่สามารถสร้างคำสั่งเติมพ้อยได้',
        });
      }
    } catch (error) {
      console.error('Topup order error:', error);
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setValue('amount', amount); 
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gradient">เติมพ้อยเกม</h1>
        <p className="text-muted-foreground">
          เลือกเกมและจำนวนเงินที่ต้องการเติม
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Game Selection */}
        {!game && (
          <Card gaming>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gamepad2 className="h-5 w-5" />
                <span>เลือกเกม</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {games.map((gameOption) => (
                  <div
                    key={gameOption.id}
                    className={cn(
                      'p-4 border-2 rounded-lg cursor-pointer transition-all',
                      watchedGameId === gameOption.id
                        ? 'border-neon-green bg-neon-green/10'
                        : 'border-border hover:border-neon-green/50'
                    )}
                    onClick={() => setValue('gameId', gameOption.id)}
                  >
                    <div className="text-center space-y-2">
                      <div className="text-lg font-semibold">{gameOption.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {gameOption.uidLabel || 'UID'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.gameId && (
                <p className="text-sm text-red-500 mt-2">{errors.gameId.message}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Game UID Input */}
        {selectedGame && (
          <Card gaming>
            <CardHeader>
              <CardTitle>ข้อมูลเกม</CardTitle>
              <CardDescription>
                กรอก {selectedGame.uidLabel || 'UID'} ของ {selectedGame.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label htmlFor="gameUid" className="text-sm font-medium">
                  {selectedGame.uidLabel || 'UID'}
                </label>
                <Input
                  id="gameUid"
                  placeholder={`กรอก ${selectedGame.uidLabel || 'UID'} ของคุณ`}
                  gaming
                  {...register('gameUid')}
                />
                {errors.gameUid && (
                  <p className="text-sm text-red-500">{errors.gameUid.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Amount Selection */}
        <Card gaming>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>เลือกจำนวนเงิน</span>
            </CardTitle>
            <CardDescription>
              1 บาท = 1 พ้อย (ไม่มีค่าธรรมเนียม)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {TOPUP_AMOUNTS.map((amount) => (
                <Button
                  key={amount.value}
                  type="button"
                  variant={selectedAmount === amount.value ? 'gaming' : 'outline'}
                  className="h-16 text-lg"
                  onClick={() => handleAmountSelect(amount.value)}
                >
                  <div className="text-center">
                    <div>₿{amount.value}</div>
                    {amount.bonus > 0 && (
                      <div className="text-xs text-neon-green">+{amount.bonus} โบนัส</div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                หรือกรอกจำนวนเงินเอง
              </label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                min="1"
                gaming
                {...register('amount')}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  if (value && TOPUP_AMOUNTS.some(amount => amount.value === value)) {
                    setSelectedAmount(value);
                  } else {
                    setSelectedAmount(null);
                  }
                  setValue('amount', value);
                }}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button 
          type="submit" 
          variant="gaming" 
          size="lg"
          className="w-full"
          disabled={isLoading || !user}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" color="white" className="mr-2" />
              กำลังสร้างคำสั่งเติมพ้อย...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-5 w-5" />
              เติมพ้อยเลย!
            </>
          )}
        </Button>

        {!user && (
          <p className="text-center text-sm text-muted-foreground">
            กรุณา{' '}
            <Button variant="link" onClick={() => router.push('/login')} className="p-0 h-auto text-neon-green">
              เข้าสู่ระบบ
            </Button>
            {' '}เพื่อเติมพ้อย
          </p>
        )}
      </form>
    </div>
  );
} 