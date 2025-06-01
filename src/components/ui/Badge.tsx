import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: ReactNode;
  variant?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'yellow' | 'pink' | 'indigo' | undefined;
  className?: string;
  onClick?: () => void;
}

export function Badge({ children, variant = 'blue', className, onClick }: BadgeProps) {
  const variants = {
    blue: 'bg-[#E3EAFD] text-[#133A9A] border-[rgba(10,15,41,0.08)]',
    green: 'bg-[#D1FAE4] text-[#166E3F] border-[rgba(10,15,41,0.08)]',
    orange: 'bg-[#FDEAD8] text-[#AE590A] border-[rgba(10,15,41,0.08)]',
    red: 'bg-[#FCE5E4] text-[#9A1C13] border-[rgba(10,15,41,0.08)]',
    purple: 'bg-[#ECDFFB] text-[#5314A3] border-[rgba(10,15,41,0.08)]',
    yellow: 'bg-yellow-50 text-yellow-700 border-[rgba(10,15,41,0.08)]',
    pink: 'bg-pink-50 text-pink-700 border-[rgba(10,15,41,0.08)]',
    indigo: 'bg-indigo-50 text-indigo-700 border-[rgba(10,15,41,0.08)]',
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center justify-center rounded-full text-sm font-medium border',
        'px-[6px] py-1', // Figma padding: 4px 6px
        variant ? variants[variant] : 'bg-gray-100 text-gray-400 border-gray-200',
        {
          'cursor-pointer hover:opacity-80 transition-all duration-200': onClick
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </span>
  );
} 