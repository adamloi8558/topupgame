import { Metadata } from 'next';
import { ProfileForm } from '@/components/profile/profile-form';
import { PointsDisplay } from '@/components/profile/points-display';
import { SecuritySettings } from '@/components/profile/security-settings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'โปรไฟล์ของฉัน',
  description: 'จัดการข้อมูลส่วนตัวและความปลอดภัยของบัญชี',
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-gaming">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gradient">โปรไฟล์ของฉัน</h1>
            <p className="text-muted-foreground">
              จัดการข้อมูลส่วนตัวและความปลอดภัยของบัญชี
            </p>
          </div>

          {/* Points Display Card */}
          <PointsDisplay />

          {/* Profile Management Tabs */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">ข้อมูลส่วนตัว</TabsTrigger>
              <TabsTrigger value="security">ความปลอดภัย</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-6">
              <Card gaming>
                <CardHeader>
                  <CardTitle>แก้ไขข้อมูลส่วนตัว</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfileForm />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="mt-6">
              <SecuritySettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 