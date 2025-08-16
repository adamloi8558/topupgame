import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { LoginCredentials, RegisterData, RegisterRequest, AuthUser, ApiResponse } from '@/types';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, login, logout, setLoading } = useAuthStore();
  const { addToast } = useUIStore();
  const router = useRouter();

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/me');
      
      if (response.ok) {
        const { data }: ApiResponse<AuthUser> = await response.json();
        if (data) {
          login(data);
        }
      } else {
        logout();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [login, logout, setLoading]);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const loginUser = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result: ApiResponse<AuthUser> = await response.json();

      if (result.success && result.data) {
        login(result.data);
        addToast({
          type: 'success',
          title: 'เข้าสู่ระบบสำเร็จ',
          message: result.message,
        });
        router.push('/');
        return { success: true };
      } else {
        addToast({
          type: 'error',
          title: 'เข้าสู่ระบบไม่สำเร็จ',
          message: result.error || 'กรุณาตรวจสอบข้อมูลอีกครั้ง',
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่',
      });
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (userData: RegisterRequest) => {
    try {
      setLoading(true);
      console.log('useAuth register called with:', userData); // Debug
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('Register API response status:', response.status); // Debug
      const result: ApiResponse<AuthUser> = await response.json();
      console.log('Register API response body:', result); // Debug

      if (result.success && result.data) {
        login(result.data);
        addToast({
          type: 'success',
          title: 'สมัครสมาชิกสำเร็จ',
          message: result.message,
        });
        router.push('/');
        return { success: true };
      } else {
        console.error('Registration failed with result:', result); // Debug
        addToast({
          type: 'error',
          title: 'สมัครสมาชิกไม่สำเร็จ',
          message: result.error || 'ข้อมูลที่กรอกไม่ถูกต้อง',
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Register network error:', error); // Debug
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
      });
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      logout();
      addToast({
        type: 'success',
        title: 'ออกจากระบบแล้ว',
        message: 'ขอบคุณที่ใช้บริการ',
      });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if API call fails
      logout();
      router.push('/');
    }
  };

  const requireAuth = () => {
    if (!isAuthenticated) {
      addToast({
        type: 'warning',
        title: 'กรุณาเข้าสู่ระบบ',
        message: 'คุณต้องเข้าสู่ระบบก่อนใช้งานฟีเจอร์นี้',
      });
      router.push('/login');
      return false;
    }
    return true;
  };

  const requireAdmin = () => {
    if (!isAuthenticated || user?.role !== 'admin') {
      addToast({
        type: 'error',
        title: 'ไม่มีสิทธิ์เข้าถึง',
        message: 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้',
      });
      router.push('/');
      return false;
    }
    return true;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    checkAuthStatus,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    requireAuth,
    requireAdmin,
  };
}; 