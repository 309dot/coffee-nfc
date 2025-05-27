import { CoffeeIcon, CalendarIcon, StoreIcon, MenuIcon } from '../icons';
import { cn } from '../../utils/cn';

interface NavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Navigation({ activeTab = 'coffee', onTabChange }: NavigationProps) {
  const navItems = [
    { id: 'coffee', icon: CoffeeIcon, label: 'Coffee' },
    { id: 'calendar', icon: CalendarIcon, label: 'Calendar' },
    { id: 'store', icon: StoreIcon, label: 'Store' },
    { id: 'menu', icon: MenuIcon, label: 'Menu' },
  ];

  return (
    <nav className="flex justify-between items-center bg-white rounded-t-2xl px-6 py-2 shadow-lg">
      {navItems.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onTabChange?.(id)}
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center transition-all',
            activeTab === id 
              ? 'bg-badge-bg shadow-sm' 
              : 'bg-transparent hover:bg-gray-100'
          )}
          aria-label={label}
        >
          <Icon 
            size={20} 
            className={cn(
              'transition-colors',
              activeTab === id ? 'text-badge-text' : 'text-gray-400'
            )} 
          />
        </button>
      ))}
    </nav>
  );
} 