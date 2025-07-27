import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'default' | 'neon' | 'white';
}

export function LoadingSpinner({ 
  size = 'md', 
  className, 
  color = 'default' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const colorClasses = {
    default: 'text-foreground',
    neon: 'text-neon-green',
    white: 'text-white',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-transparent border-t-current',
          sizeClasses[size],
          colorClasses[color]
        )}
      />
    </div>
  );
}

interface LoadingDotsProps {
  className?: string;
  color?: 'default' | 'neon' | 'white';
}

export function LoadingDots({ className, color = 'default' }: LoadingDotsProps) {
  const colorClasses = {
    default: 'bg-foreground',
    neon: 'bg-neon-green',
    white: 'bg-white',
  };

  return (
    <div className={cn('loading-dots', className)}>
      <div className={cn('w-2 h-2 rounded-full', colorClasses[color])} />
      <div className={cn('w-2 h-2 rounded-full', colorClasses[color])} />
      <div className={cn('w-2 h-2 rounded-full', colorClasses[color])} />
    </div>
  );
} 