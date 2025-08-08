import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'สมัครสมาชิก',
  description: 'สร้างบัญชีใหม่เพื่อเริ่มใช้งานระบบเติมเกมและซื้อไอดี',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-gaming flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card-gaming p-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
} 