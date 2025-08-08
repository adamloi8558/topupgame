'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { NAVIGATION_ITEMS, APP_NAME } from '@/lib/constants';
import { useCartStore } from '@/stores/cart-store';
import { cn } from '@/lib/utils';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Wallet, 
  History,
  ShoppingCart,
  Crown
} from 'lucide-react';

interface HeaderProps {
  user?: {
    id: string;
    name: string;
    email: string;
    points: string;
    role: 'user' | 'admin';
  } | null;
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount, toggleCart } = useCartStore();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsUserMenuOpen(false); // Close user menu when opening main menu
  };
  
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsMenuOpen(false); // Close main menu when opening user menu
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  // Close menus on route change
  useEffect(() => {
    closeAllMenus();
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen || isUserMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, isUserMenuOpen]);

  const isActivePath = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-neon-green/20 bg-gaming-dark/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2" onClick={closeAllMenus}>
              <div className="text-2xl font-bold text-gradient">
                {APP_NAME}
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-neon-green",
                    isActivePath(item.href)
                      ? "text-neon-green"
                      : "text-foreground/80"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCart}
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-neon-green text-black text-xs font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>

              {/* User Section */}
              {user ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-neon-green/20 flex items-center justify-center">
                        {user.role === 'admin' ? (
                          <Crown className="h-4 w-4 text-neon-green" />
                        ) : (
                          <User className="h-4 w-4 text-neon-green" />
                        )}
                      </div>
                      <div className="hidden md:block text-left">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {parseInt(user.points).toLocaleString()} พ้อย
                        </div>
                      </div>
                    </div>
                  </Button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-gaming-dark border border-neon-green/20 rounded-lg shadow-lg z-[60]">
                      <div className="p-4 border-b border-neon-green/20">
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                        <div className="text-xs text-neon-green mt-1">
                          {parseInt(user.points).toLocaleString()} พ้อย
                        </div>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/profile"
                          onClick={closeAllMenus}
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-neon-green/10 transition-colors"
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          จัดการโปรไฟล์
                        </Link>
                        <Link
                          href="/history"
                          onClick={closeAllMenus}
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-neon-green/10 transition-colors"
                        >
                          <History className="h-4 w-4 mr-3" />
                          ประวัติการซื้อ
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            href="/admin"
                            onClick={closeAllMenus}
                            className="flex items-center w-full px-4 py-2 text-sm hover:bg-neon-green/10 transition-colors"
                          >
                            <Crown className="h-4 w-4 mr-3" />
                            แดชบอร์ดแอดมิน
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            closeAllMenus();
                            onLogout?.();
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-destructive/10 text-destructive transition-colors border-t border-neon-green/20 mt-2"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          ออกจากระบบ
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">เข้าสู่ระบบ</Link>
                  </Button>
                  <Button variant="gaming" size="sm" asChild>
                    <Link href="/register">สมัครสมาชิก</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden p-2 touch-manipulation"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeAllMenus}
          />
          
          {/* Mobile Menu */}
          <div className="absolute top-16 left-0 right-0 bg-gaming-dark border-b border-neon-green/20 shadow-lg">
            <nav className="py-4">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block px-6 py-3 text-base font-medium transition-colors touch-manipulation",
                    isActivePath(item.href)
                      ? "text-neon-green bg-neon-green/10 border-r-2 border-neon-green"
                      : "text-foreground/80 hover:text-neon-green hover:bg-neon-green/5"
                  )}
                  onClick={closeAllMenus}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile User Section */}
              {user ? (
                <div className="border-t border-neon-green/20 mt-4 pt-4">
                  <div className="px-6 py-2 text-sm text-muted-foreground">
                    {user.name} • {parseInt(user.points).toLocaleString()} พ้อย
                  </div>
                  <Link
                    href="/profile"
                    onClick={closeAllMenus}
                    className="block px-6 py-3 text-base font-medium text-foreground/80 hover:text-neon-green hover:bg-neon-green/5 transition-colors touch-manipulation"
                  >
                    จัดการโปรไฟล์
                  </Link>
                  <Link
                    href="/history"
                    onClick={closeAllMenus}
                    className="block px-6 py-3 text-base font-medium text-foreground/80 hover:text-neon-green hover:bg-neon-green/5 transition-colors touch-manipulation"
                  >
                    ประวัติการซื้อ
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={closeAllMenus}
                      className="block px-6 py-3 text-base font-medium text-foreground/80 hover:text-neon-green hover:bg-neon-green/5 transition-colors touch-manipulation"
                    >
                      แดชบอร์ดแอดมิน
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      closeAllMenus();
                      onLogout?.();
                    }}
                    className="block w-full text-left px-6 py-3 text-base font-medium text-destructive hover:bg-destructive/10 transition-colors touch-manipulation"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              ) : (
                <div className="border-t border-neon-green/20 mt-4 pt-4 px-6 space-y-3">
                  <Button asChild className="w-full touch-manipulation">
                    <Link href="/login" onClick={closeAllMenus}>
                      เข้าสู่ระบบ
                    </Link>
                  </Button>
                  <Button variant="gaming" asChild className="w-full touch-manipulation">
                    <Link href="/register" onClick={closeAllMenus}>
                      สมัครสมาชิก
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* User Menu Backdrop for Mobile */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-[55] md:hidden"
          onClick={closeAllMenus}
        />
      )}
    </>
  );
} 