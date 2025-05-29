import { LeadIcon, TodoIcon, Store2Icon } from '../icons';
import { cn } from '../../utils/cn';

type Page = 'home' | 'calendar' | 'details' | 'dashboard';

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const navItems = [
    { id: 'home' as Page, icon: LeadIcon, label: 'Coffee' },
    { id: 'calendar' as Page, icon: TodoIcon, label: 'Calendar' },
    { id: 'details' as Page, icon: Store2Icon, label: 'Details' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-6 flex justify-center">
      <div className="bg-dark-navy rounded-full shadow-lg">
        <div className="flex items-center justify-center px-2 py-2 gap-5">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onPageChange(id)}
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center transition-all',
                currentPage === id 
                  ? 'bg-white shadow-sm' 
                  : 'bg-transparent hover:bg-white/10'
              )}
              aria-label={label}
            >
              <Icon 
                size={20} 
                className={cn(
                  'transition-colors',
                  currentPage === id ? 'text-text-primary' : 'text-white/46'
                )} 
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 