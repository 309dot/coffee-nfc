import { useState, useEffect } from 'react';
import { M1CTLogo, InstagramIcon, GlobalIcon } from '../icons';

interface HeaderProps {
  variant?: 'default' | 'shop';
  className?: string;
}

export function Header({ variant: _variant = 'default', className = '' }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  // 스크롤 이벤트 리스너
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/m1ct.coffee/', '_blank');
  };

  const handleThreadsClick = () => {
    window.open('https://www.threads.com/@m1ct.coffee', '_blank');
  };

  // 스타일 변형
  const getContainerClasses = () => {
    const baseClasses = "fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-2 transition-shadow duration-300";
    
    // 스크롤 시 그림자 효과 추가
    return `${baseClasses} bg-white ${isScrolled ? 'shadow-lg' : ''}`;
  };

  const getButtonClasses = () => {
    return "w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors";
  };

  const getIconClasses = () => {
    return "text-text-primary";
  };

  return (
    <nav className={`${getContainerClasses()} ${className}`}>
      {/* Logo */}
      <M1CTLogo className="text-text-primary" />
      
      {/* Button Group */}
      <div className="flex gap-2">
        <button 
          onClick={handleInstagramClick}
          className={getButtonClasses()}
          aria-label="Instagram"
        >
          <InstagramIcon size={20} className={getIconClasses()} />
        </button>
        <button 
          onClick={handleThreadsClick}
          className={getButtonClasses()}
          aria-label="Threads"
        >
          <GlobalIcon size={20} className={getIconClasses()} />
        </button>
      </div>
    </nav>
  );
} 