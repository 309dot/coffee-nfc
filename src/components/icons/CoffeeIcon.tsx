import { Coffee } from 'lucide-react';

interface CoffeeIconProps {
  size?: number;
  className?: string;
}

export function CoffeeIcon({ size = 20, className }: CoffeeIconProps) {
  return <Coffee size={size} className={className} />;
} 