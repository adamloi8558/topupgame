'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { TopupForm } from '@/components/topup/topup-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/hooks/use-auth';
import { SUPPORTED_GAMES } from '@/lib/constants';
import { Game, ApiResponse } from '@/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function GameTopupPage() {
  const { game: gameSlug } = useParams();
  const [gameData, setGameData] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    const loadGameData = async () => {
      try {
        // Find game in supported games first
        const supportedGame = SUPPORTED_GAMES.find(g => g.id === gameSlug);
        if (!supportedGame) {
          notFound();
          return;
        }

        // Fetch game data from API
        const response = await fetch(`/api/games?slug=${gameSlug}&active=true`);
        const result: ApiResponse<Game[]> = await response.json();

        if (result.success && result.data && result.data.length > 0) {
          setGameData(result.data[0]);
        } else {
          // If not found in database, create game object from supported games
          setGameData({
            id: supportedGame.id,
            name: supportedGame.name,
            slug: supportedGame.id,
            logoUrl: supportedGame.logo,
            uidLabel: supportedGame.uidLabel,
            isActive: true,
            createdAt: new Date(),
          });
        }
      } catch (error) {
        console.error('Failed to load game data:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    loadGameData();
  }, [gameSlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-gaming">
        <Header user={user} onLogout={logout} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!gameData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-gaming">
      <Header user={user} onLogout={logout} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center text-neon-green hover:text-neon-blue transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับหน้าหลัก
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Game Header */}
          <Card gaming className="mb-8">
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-neon-green/20 rounded-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-neon-green">
                  {gameData.name.substring(0, 2)}
                </span>
              </div>
              <CardTitle className="text-2xl font-bold text-gradient">
                เติมพ้อย {gameData.name}
              </CardTitle>
              <CardDescription>
                เติมพ้อยเกม {gameData.name} ง่าย รวดเร็ว ปลอดภัย
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Topup Form */}
          <Card gaming>
            <CardHeader>
              <CardTitle>กรอกข้อมูลเติมพ้อย</CardTitle>
              <CardDescription>
                กรุณากรอกข้อมูลให้ครบถ้วนเพื่อดำเนินการเติมพ้อย
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TopupForm game={gameData} />
            </CardContent>
          </Card>

          {/* How to Find UID */}
          <Card gaming className="mt-6">
            <CardHeader>
              <CardTitle>วิธีหา {gameData.uidLabel || 'UID'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• เปิดเกม {gameData.name}</p>
                <p>• เข้าไปที่หน้าโปรไฟล์หรือการตั้งค่า</p>
                <p>• คัดลอก {gameData.uidLabel || 'UID'} ของคุณ</p>
                <p>• นำมาใส่ในช่องด้านบน</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 