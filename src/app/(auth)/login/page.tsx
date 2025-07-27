import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'เข้าสู่ระบบ',
  description: 'เข้าสู่ระบบเพื่อเริ่มเติมเกมและซื้อไอดีเกม',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-gaming flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card-gaming p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
} 