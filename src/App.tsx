import { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Calendar } from './pages/Calendar';
import { Details } from './pages/Details';
import { Dashboard } from './pages/Dashboard';

type Tab = 'coffee' | 'calendar' | 'coffee-details';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('coffee');

  useEffect(() => {
    // URL 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    
    // 대시보드 접근 확인
    if (page === 'dashboard') {
      // 대시보드는 탭 시스템을 우회
      return;
    }
    
    // 기존 탭 시스템
    const coffeeId = urlParams.get('coffee');
    if (coffeeId) {
      setActiveTab('coffee-details');
    } else {
      setActiveTab('coffee');
    }
  }, []);

  // 대시보드 렌더링 (URL에서 page=dashboard인 경우)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('page') === 'dashboard') {
    return <Dashboard />;
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'coffee':
        return <Home />;
      case 'coffee-details':
        return <Details />;
      case 'calendar':
        return <Calendar />;
      default:
        return <Home />;
    }
  };

  const handleTabChange = (tab: string) => {
    const tabMapping: Record<string, Tab> = {
      'home': 'coffee',
      'coffee': 'coffee',
      'calendar': 'calendar',
      'details': 'coffee-details'
    };
    
    const newTab = tabMapping[tab] || 'coffee';
    setActiveTab(newTab);
    
    // URL 업데이트 (coffee 파라미터 유지)
    const urlParams = new URLSearchParams(window.location.search);
    const coffeeId = urlParams.get('coffee');
    
    if (newTab === 'coffee-details') {
      window.history.pushState({}, '', `/?page=details${coffeeId ? `&coffee=${coffeeId}` : ''}`);
    } else if (newTab === 'calendar') {
      window.history.pushState({}, '', `/?page=calendar${coffeeId ? `&coffee=${coffeeId}` : ''}`);
    } else {
      window.history.pushState({}, '', `/${coffeeId ? `?coffee=${coffeeId}` : ''}`);
    }
  };

  return (
    <Layout currentPage={activeTab} onPageChange={handleTabChange}>
      {renderPage()}
    </Layout>
  );
}

export default App;
