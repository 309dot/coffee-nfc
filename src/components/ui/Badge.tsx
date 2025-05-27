import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary';
  className?: string;
  onClick?: () => void;
}

export function Badge({ 
  children, 
  variant = 'default', 
  className,
  onClick 
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium cursor-pointer transition-colors',
        variant === 'default' && 'bg-badge-bg text-badge-text border border-badge-text/10',
        variant === 'secondary' && 'bg-gray-100 text-gray-800',
        className
      )}
      onClick={onClick}
    >
      {children}
    </span>
  );
} 