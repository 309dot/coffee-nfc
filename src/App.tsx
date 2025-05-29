import { useState, useEffect } from 'react';
import { Navigation } from './components/ui/Navigation';
import { Home } from './pages/Home';
import { Calendar } from './pages/Calendar';
import { Details } from './pages/Details';
import { Dashboard } from './pages/Dashboard';

type Page = 'home' | 'calendar' | 'details' | 'dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  useEffect(() => {
    // URL 파라미터를 읽어서 페이지 결정
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') as Page;
    
    if (page && ['home', 'calendar', 'details', 'dashboard'].includes(page)) {
      setCurrentPage(page);
    } else {
      // 기본값: home
      setCurrentPage('home');
    }
  }, []);

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    
    // URL 업데이트 (coffee 파라미터 유지)
    const urlParams = new URLSearchParams(window.location.search);
    const coffeeId = urlParams.get('coffee');
    
    let newUrl = `/?page=${page}`;
    if (coffeeId && page !== 'dashboard') {
      newUrl += `&coffee=${coffeeId}`;
    }
    
    window.history.pushState({}, '', newUrl);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'calendar':
        return <Calendar />;
      case 'details':
        return <Details />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Home />;
    }
  };

  // 대시보드는 네비게이션 숨기기
  const showNavigation = currentPage !== 'dashboard';

  return (
    <div className="min-h-screen bg-app-background flex flex-col">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {renderCurrentPage()}
        </main>
        
        {/* Navigation - 대시보드에서는 숨김 */}
        {showNavigation && (
          <Navigation 
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}

export default App;
