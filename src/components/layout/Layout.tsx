import { Navigation } from '../ui/Navigation';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const isCalendarPage = currentPage === 'details';
  
  return (
    <div className={`w-full min-h-screen font-inter flex flex-col ${
      isCalendarPage ? 'bg-white' : 'bg-dark-navy'
    }`}>
      <main className="flex-1 flex flex-col pt-4 pb-24">
        {children}
      </main>
      <Navigation activeTab={currentPage} onTabChange={onPageChange} />
    </div>
  );
} 