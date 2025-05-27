import { Header } from './Header';
import { Navigation } from '../ui/Navigation';

interface LayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="w-full min-h-screen bg-dark-navy font-inter flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col mt-1">
        {children}
      </main>
      <Navigation activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
} 