import { 
  Coffee, 
  Calendar, 
  Store, 
  Menu, 
  Instagram, 
  Globe, 
  ArrowRight 
} from 'lucide-react';

interface IconProps {
  size?: number;
  className?: string;
}

export function CoffeeIcon({ size = 20, className }: IconProps) {
  return <Coffee size={size} className={className} />;
}

export function CalendarIcon({ size = 20, className }: IconProps) {
  return <Calendar size={size} className={className} />;
}

export function StoreIcon({ size = 20, className }: IconProps) {
  return <Store size={size} className={className} />;
}

export function MenuIcon({ size = 20, className }: IconProps) {
  return <Menu size={size} className={className} />;
}

export function InstagramIcon({ size = 20, className }: IconProps) {
  return <Instagram size={size} className={className} />;
}

export function GlobeIcon({ size = 20, className }: IconProps) {
  return <Globe size={size} className={className} />;
}

export function ArrowRightIcon({ size = 20, className }: IconProps) {
  return <ArrowRight size={size} className={className} />;
} 