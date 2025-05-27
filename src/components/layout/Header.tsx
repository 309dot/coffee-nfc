import { InstagramIcon, GlobeIcon } from '../icons';

export function Header() {
  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/m1ct.coffee/', '_blank');
  };

  const handleThreadsClick = () => {
    window.open('https://www.threads.com/@m1ct.coffee', '_blank');
  };

  return (
    <nav className="flex justify-between items-center px-6 py-2 bg-white rounded-b-2xl">
      {/* Logo */}
      <div className="w-15 h-4 bg-gray-800 rounded"></div>
      
      {/* Button Group */}
      <div className="flex gap-2">
        <button 
          onClick={handleInstagramClick}
          className="w-10 h-10 bg-badge-bg rounded-full flex items-center justify-center hover:bg-badge-bg/80 transition-colors"
          aria-label="Instagram"
        >
          <InstagramIcon size={18} className="text-badge-text" />
        </button>
        <button 
          onClick={handleThreadsClick}
          className="w-10 h-10 bg-badge-bg rounded-full flex items-center justify-center hover:bg-badge-bg/80 transition-colors"
          aria-label="Threads"
        >
          <GlobeIcon size={18} className="text-badge-text" />
        </button>
      </div>
    </nav>
  );
} 