import { LeadIcon, TodoIcon, Store2Icon, MenuLineIcon } from '../icons';
import { cn } from '../../utils/cn';

interface NavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Navigation({ activeTab = 'coffee', onTabChange }: NavigationProps) {
  const navItems = [
    { id: 'coffee', icon: LeadIcon, label: 'Coffee', visible: true },
    { id: 'calendar', icon: TodoIcon, label: 'Calendar', visible: true },
    { id: 'store', icon: Store2Icon, label: 'Store', visible: false },
    { id: 'menu', icon: MenuLineIcon, label: 'Menu', visible: false },
  ];

  // 보이는 아이템만 필터링
  const visibleItems = navItems.filter(item => item.visible);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-6">
      <div className="bg-dark-navy rounded-full shadow-lg">
        <div className="flex items-center justify-center px-2 py-2 gap-5">
          {visibleItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onTabChange?.(id)}
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center transition-all',
                activeTab === id 
                  ? 'bg-white shadow-sm' 
                  : 'bg-transparent hover:bg-white/10'
              )}
              aria-label={label}
            >
              <Icon 
                size={20} 
                className={cn(
                  'transition-colors',
                  activeTab === id ? 'text-text-primary' : 'text-white/46'
                )} 
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 