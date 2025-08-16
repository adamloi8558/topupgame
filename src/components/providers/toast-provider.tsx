'use client';

import { useUIStore } from '@/stores/ui-store';
import { Toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

export function ToastProvider() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed bottom-0 right-0 z-[100] p-4 md:max-w-[420px]">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          variant={toast.type === 'error' ? 'destructive' : toast.type}
          title={toast.title}
          description={toast.message}
          onClose={() => removeToast(toast.id)}
          className={cn(
            "animate-in fade-in slide-in-from-bottom-4 duration-300",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-right-4"
          )}
        />
      ))}
    </div>
  );
} 