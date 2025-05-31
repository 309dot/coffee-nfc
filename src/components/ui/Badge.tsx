import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'secondary';
  className?: string;
  onClick?: () => void;
}

export function Badge({ children, variant = 'default', className, onClick }: BadgeProps) {
  return (
    <span 
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
        {
          'bg-gray-100 text-gray-800': variant === 'default',
          'bg-gray-50 text-gray-600': variant === 'secondary',
          'cursor-pointer hover:bg-gray-200 transition-colors': onClick
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </span>
  );
} 