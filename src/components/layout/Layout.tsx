import { Header } from './Header';
import { Navigation } from '../ui/Navigation';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const isCalendarPage = currentPage === 'details';
  const isShopPage = currentPage === 'shop';
  
  return (
    <div className={`w-full min-h-screen font-pretendard flex flex-col ${
      isCalendarPage || isShopPage ? 'bg-white' : 'bg-dark-navy'
    }`}>
      {!isShopPage && <Header />}
      <main className={`flex-1 flex flex-col ${isShopPage ? 'pt-0' : 'pt-16'} pb-24`}>
        {children}
      </main>
      <Navigation activeTab={currentPage} onTabChange={onPageChange} />
    </div>
  );
} 