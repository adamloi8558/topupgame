'use client';

import { useUIStore } from '@/stores/ui-store';
import { Toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

export function ToastProvider() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          variant={toast.type === 'error' ? 'destructive' : toast.type}
          title={toast.title}
          description={toast.message}
          onClose={() => removeToast(toast.id)}
          className={cn(
            "mb-2 last:mb-0 sm:mb-0 sm:mt-2 sm:last:mt-0",
            "animate-in slide-in-from-top-full duration-300",
            "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-full"
          )}
        />
      ))}
    </div>
  );
} 