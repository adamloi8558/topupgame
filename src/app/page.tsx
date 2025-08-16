'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SUPPORTED_GAMES, TOPUP_AMOUNTS } from '@/lib/constants';
import { useAuth } from '@/hooks/use-auth';
import { 
  Zap, 
  Shield, 
  Clock, 
  Star, 
  TrendingUp, 
  Users, 
  CreditCard,
  ShoppingBag,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function HomePage() {
  const { user, isLoading, logout } = useAuth();

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-neon-green" />,
      title: 'เติมพ้อยอัตโนมัติ',
      description: 'ระบบตรวจสอบสลิปและเติมพ้อยอัตโนมัติภายใน 1 นาที',
    },
    {
      icon: <Shield className="h-8 w-8 text-neon-blue" />,
      title: 'ปลอดภัย 100%',
			description: 'ระบบรักษาความปลอดภัยระดับธนาคาร ข้อมูลเข้ารหัส SSL',
    },
    {
      icon: <Clock className="h-8 w-8 text-neon-purple" />,
      title: 'บริการ 24/7',
      description: 'เติมเกมได้ตลอด 24 ชั่วโมง ไม่มีวันหยุด',
    },
    {
      icon: <Star className="h-8 w-8 text-neon-yellow" />,
      title: 'ไอดีเกมคุณภาพ',
      description: 'ไอดีเกมแรงค์สูง มีสกินหายาก ราคาดี',
    },
  ];

  const stats = [
    { icon: <Users className="h-6 w-6" />, label: 'ผู้ใช้งาน', value: '50,000+' },
    { icon: <TrendingUp className="h-6 w-6" />, label: 'การเติม/วัน', value: '5,000+' },
    { icon: <Star className="h-6 w-6" />, label: 'ความพึงพอใจ', value: '99.9%' },
    { icon: <CheckCircle className="h-6 w-6" />, label: 'ความสำเร็จ', value: '100%' },
  ];

  return (
    <div className="min-h-screen bg-gradient-gaming">
              <Header user={user} onLogout={logout} />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
              เติมเกม
              <span className="block text-neon-blue">ขายไอดีเกม</span>
              <span className="block text-neon-green">อัตโนมัติ</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              เติมพ้อยเกมและซื้อไอดีเกมแรงค์สูง ระบบอัตโนมัติ ปลอดภัย รวดเร็วภายใน 1 นาที
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button variant="gaming" size="xl" asChild>
                <Link href="/topup">
                  <CreditCard className="mr-2 h-5 w-5" />
                  เติมพ้อยเกม
                </Link>
              </Button>
              
              <Button variant="neon" size="xl" asChild>
                <Link href="/shop">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  ซื้อไอดีเกม
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2 text-neon-green">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -right-4 w-96 h-96 bg-neon-green/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-4 -left-4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Wallet Topup Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
			<h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gradient">
				เติมพ้อยเข้ากระเป๋า
			</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Quick Amounts */}
              <Card gaming className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-neon-green/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-neon-green">50</span>
                </div>
                <h3 className="font-semibold mb-2">เริ่มต้น 50 บาท</h3>
                <p className="text-sm text-muted-foreground">เหมาะสำหรับซื้อของเล็กๆ น้อยๆ</p>
              </Card>

              <Card gaming className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-neon-blue/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-neon-blue">500</span>
                </div>
                <h3 className="font-semibold mb-2">เติม 500 บาท</h3>
                <p className="text-sm text-muted-foreground">เหมาะสำหรับซื้อของราคากลาง</p>
              </Card>

              <Card gaming className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-neon-purple/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-neon-purple">2K</span>
                </div>
                <h3 className="font-semibold mb-2">เติม 2,000 บาท</h3>
                <p className="text-sm text-muted-foreground">เหมาะสำหรับซื้อของแพงๆ</p>
              </Card>
            </div>

            {/* Bank Info Preview */}
            <Card gaming className="text-center p-8">
              <h3 className="text-xl font-bold mb-4 text-neon-green">โอนเงินเข้าบัญชี</h3>
              <div className="bg-gaming-darker p-6 rounded-lg border border-neon-green/20 max-w-md mx-auto">
					<div className="space-y-2">
						<p className="text-muted-foreground">ดูข้อมูลบัญชีล่าสุดในหน้าชำระเงิน</p>
					</div>
              </div>
              <Link href="/topup">
                <Button variant="gaming" size="lg" className="mt-6">
                  เติมพ้อยตอนนี้
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gaming-darker/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gradient">
            ทำไมต้องเลือกเรา?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} gaming className="text-center group hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top-up Amounts Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gradient">
            แพ็คเกจเติมพ้อยเข้ากระเป๋า
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {TOPUP_AMOUNTS.map((amount, index) => (
              <Card key={index} gaming className="text-center group hover:scale-105 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-neon-green mb-2">
                    ฿{amount.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {amount.label}
                  </div>
                  {amount.bonus > 0 && (
                    <div className="text-xs text-neon-blue mt-1">
                      +{amount.bonus} โบนัส
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="gaming" size="lg" asChild>
              <Link href="/topup">
                เริ่มเติมพ้อยเข้ากระเป๋า
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gaming-darker/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
            พร้อมเติมพ้อยและช้อปปิ้งแล้วใช่ไหม?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            เติมพ้อยเข้ากระเป๋าแล้วช้อปปิ้งสินค้าต่างๆ ในเว็บไซต์ได้เลย
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Button variant="gaming" size="lg" asChild>
                  <Link href="/register">
                    สมัครสมาชิกฟรี
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/login">เข้าสู่ระบบ</Link>
                </Button>
              </>
            ) : (
              <Button variant="gaming" size="lg" asChild>
                <Link href="/topup">
                  เติมพ้อยเลย
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neon-green/20 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="text-2xl font-bold text-gradient mb-4">DumStore</div>
			<p className="text-muted-foreground mb-6 max-w-md mx-auto">
				เว็บไซต์เติมเกม & จำหน่ายไอดีเกมแท้ ครบทุกเกมยอดนิยม ทั้ง ROV, Free Fire, Valorant และอีกมากมาย บริการด้วยความจริงใจ ปลอดภัย 100%
			</p>
          <p className="text-sm text-muted-foreground">
            © 2024 DumStore. สงวนลิขสิทธิ์.
          </p>
        </div>
      </footer>
    </div>
  );
} 