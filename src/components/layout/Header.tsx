import { M1CTLogo, InstagramIcon, GlobalIcon } from '../icons';

export function Header() {
  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/m1ct.coffee/', '_blank');
  };

  const handleThreadsClick = () => {
    window.open('https://www.threads.com/@m1ct.coffee', '_blank');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-2 bg-white">
      {/* Logo */}
      <M1CTLogo className="text-text-primary" />
      
      {/* Button Group */}
      <div className="flex gap-2">
        <button 
          onClick={handleInstagramClick}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Instagram"
        >
          <InstagramIcon size={20} className="text-text-primary" />
        </button>
        <button 
          onClick={handleThreadsClick}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Threads"
        >
          <GlobalIcon size={20} className="text-text-primary" />
        </button>
      </div>
    </nav>
  );
} 