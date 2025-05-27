import { Header } from './Header';
import { Navigation } from '../ui/Navigation';

interface LayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const isCalendarPage = activeTab === 'calendar';
  
  return (
    <div className={`w-full min-h-screen font-inter flex flex-col ${
      isCalendarPage ? 'bg-white' : 'bg-dark-navy'
    }`}>
      <Header />
      <main className="flex-1 flex flex-col pt-16 pb-24">
        {children}
      </main>
      <Navigation activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
} 