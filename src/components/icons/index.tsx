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

export function GlobalIcon({ size = 20, className }: IconProps) {
  return <Globe size={size} className={className} />;
}

export function ArrowRightIcon({ size = 20, className }: IconProps) {
  return <ArrowRight size={size} className={className} />;
}

// Export new custom icons
export { LeadIcon } from './LeadIcon';
export { CupIcon } from './CupIcon';
export { TodoIcon } from './TodoIcon';
export { Store2Icon } from './Store2Icon';
export { MenuLineIcon } from './MenuLineIcon';

// M1CT Logo Component
interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function M1CTLogo({ className = "", width = 59.49, height = 16 }: LogoProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 60 16" 
      fill="none" 
      className={className}
    >
      <g clipPath="url(#clip0_52_89)">
        <path d="M0.329556 15.6898C0.103385 15.6898 -0.00646935 15.58 -7.31411e-06 15.3603V0.652665C-7.31411e-06 0.432956 0.109847 0.323101 0.329556 0.323101H1.75767C1.9386 0.323101 2.07431 0.400645 2.15831 0.549272L8.20678 10.0549L14.2359 0.549272C14.3199 0.407108 14.4556 0.329563 14.6365 0.323101H16.1098C16.336 0.323101 16.4459 0.432956 16.4459 0.652665V15.3538C16.4459 15.5735 16.336 15.6834 16.1098 15.6834H13.9321C13.706 15.6834 13.5961 15.5735 13.5961 15.3538V6.15832L9.23424 13.0727C9.15023 13.2149 9.01453 13.2924 8.84006 13.2989H7.63166C7.45072 13.2989 7.31502 13.2213 7.23101 13.0727L2.81744 6.07431V15.3538C2.81744 15.5735 2.70759 15.6834 2.48141 15.6834H0.329556V15.6898Z" fill="currentColor"/>
        <path d="M21.7254 3.063L19.58 3.65105C19.4184 3.69628 19.2569 3.59935 19.2116 3.4378L18.7787 1.80937C18.7399 1.65428 18.8239 1.49919 18.979 1.44749L22.895 0.22617C22.895 0.22617 22.9338 0.219707 22.9532 0.219707H24.5234C24.685 0.219707 24.8207 0.35541 24.8207 0.516961V15.3926C24.8207 15.5541 24.685 15.6898 24.5234 15.6898H22.3974C22.2359 15.6898 22.1002 15.5541 22.1002 15.3926V3.34733C22.1002 3.15347 21.9128 3.01131 21.7254 3.063Z" fill="currentColor"/>
        <path d="M36.4588 16C33.9451 16 31.916 15.2633 30.378 13.79C28.8401 12.3166 28.0646 10.3845 28.0646 7.98061C28.0646 5.57674 28.8336 3.65105 30.378 2.19063C31.916 0.73021 33.9451 0 36.4588 0C38.4039 0 40.084 0.523425 41.4992 1.57027C42.9144 2.61712 43.8126 4.00646 44.1939 5.74475C44.2391 5.97738 44.1357 6.10016 43.8901 6.10016H41.6349C41.441 6.10016 41.3118 6.00969 41.2536 5.83522C40.9111 4.80129 40.3231 3.98708 39.4766 3.40549C38.6365 2.81745 37.6284 2.52666 36.4588 2.52666C34.811 2.52666 33.4798 3.03069 32.4782 4.03231C31.4701 5.03393 30.9661 6.35864 30.9661 7.99354C30.9661 9.62843 31.4701 10.9725 32.4717 11.9742C33.4733 12.9758 34.8045 13.4798 36.4588 13.4798C37.622 13.4798 38.6236 13.189 39.4701 12.6139C40.3166 12.0323 40.9111 11.231 41.2536 10.1906C41.3118 9.99677 41.441 9.89984 41.6349 9.89984H43.8901C44.1422 9.89984 44.2455 10.0162 44.1939 10.2552C43.8061 12 42.9079 13.3958 41.4992 14.4426C40.084 15.4895 38.4039 16.0129 36.4588 16.0129V16Z" fill="currentColor"/>
        <path d="M59.1535 0.323101C59.3796 0.323101 59.4895 0.432956 59.4895 0.652665V2.42972C59.4895 2.64943 59.3796 2.75929 59.1535 2.75929H53.8869V15.3473C53.8869 15.567 53.7771 15.6769 53.5509 15.6769H51.3796C51.1535 15.6769 51.0436 15.567 51.0436 15.3473V2.76575H45.8029C45.5767 2.76575 45.4669 2.6559 45.4669 2.43619V0.652665C45.4669 0.432956 45.5767 0.323101 45.8029 0.323101H59.1535Z" fill="currentColor"/>
      </g>
      <defs>
        <clipPath id="clip0_52_89">
          <rect width="59.4895" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
} 