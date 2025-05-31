import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Detail } from './pages/Detail';
import { Shop } from './pages/Shop';
import { Dashboard } from './pages/Dashboard';
import { InstallPrompt } from './components/ui/InstallPrompt';
import { initializeData } from './services/firebaseApi';

type Tab = 'coffee' | 'details' | 'shop';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('coffee');
  const [searchParams] = useSearchParams();
  const [showInstallPrompt, setShowInstallPrompt] = useState(true);
  const page = searchParams.get('page');
  const coffeeId = searchParams.get('coffee');

  useEffect(() => {
    // Firebase 초기 데이터 설정
    initializeData();
  }, []);

  useEffect(() => {
    // URL 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    
    // 대시보드 접근 확인
    if (page === 'dashboard') {
      // 대시보드는 탭 시스템을 우회
      return;
    }
    
    // 페이지 결정 로직
    if (page === 'shop') {
      setActiveTab('shop');
    } else if (page === 'details') {
      setActiveTab('details');
    } else {
      // 기본값: coffee 페이지 (coffee 파라미터가 있어도 Home 페이지)
      setActiveTab('coffee');
    }
  }, []);

  // Get data from URL for initial load
  useEffect(() => {
    if (coffeeId) {
      // Coffee detail specified in URL
      console.log('Loading coffee from URL:', coffeeId);
    }
  }, [coffeeId]);

  // Dashboard
  if (page === 'dashboard') {
    return (
      <>
        <Dashboard />
        {showInstallPrompt && (
          <InstallPrompt onClose={() => setShowInstallPrompt(false)} />
        )}
      </>
    );
  }

  // 대시보드 렌더링 (URL에서 page=dashboard인 경우)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('page') === 'dashboard') {
    return (
      <>
        <Dashboard />
        {showInstallPrompt && (
          <InstallPrompt onClose={() => setShowInstallPrompt(false)} />
        )}
      </>
    );
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'coffee':
        return <Home />;
      case 'shop':
        return <Shop />;
      case 'details':
        return <Detail />;
      default:
        return <Home />;
    }
  };

  const handleTabChange = (tab: string) => {
    const tabMapping: Record<string, Tab> = {
      'coffee': 'coffee',
      'details': 'details',
      'shop': 'shop'
    };
    
    const newTab = tabMapping[tab] || 'coffee';
    setActiveTab(newTab);
    
    // URL 업데이트 (coffee 파라미터 유지)
    const urlParams = new URLSearchParams(window.location.search);
    const coffeeId = urlParams.get('coffee');
    
    if (newTab === 'details') {
      window.history.pushState({}, '', `/?page=details${coffeeId ? `&coffee=${coffeeId}` : ''}`);
    } else if (newTab === 'shop') {
      window.history.pushState({}, '', `/?page=shop${coffeeId ? `&coffee=${coffeeId}` : ''}`);
    } else {
      window.history.pushState({}, '', `/${coffeeId ? `?coffee=${coffeeId}` : ''}`);
    }
  };

  return (
    <>
      <Layout currentPage={activeTab} onPageChange={handleTabChange}>
        {renderPage()}
      </Layout>
      {showInstallPrompt && (
        <InstallPrompt onClose={() => setShowInstallPrompt(false)} />
      )}
    </>
  );
}

export default App;
