import { useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Details } from './pages/Details';
import { Products } from './pages/Products';
import { Menu } from './pages/Menu';
import { Calendar } from './pages/Calendar';
import { useAppStore } from './store/useAppStore';

function App() {
  const { activeTab, setActiveTab, checkNFCSupport } = useAppStore();

  useEffect(() => {
    // Check NFC support on app load
    checkNFCSupport();
    
    // Check URL parameters for coffee ID
    const urlParams = new URLSearchParams(window.location.search);
    const coffeeId = urlParams.get('coffee');
    
    if (coffeeId) {
      // If coffee ID is provided, show details page
      setActiveTab('coffee-details');
    }
  }, [checkNFCSupport, setActiveTab]);

  const renderPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const coffeeId = urlParams.get('coffee');
    
    switch (activeTab) {
      case 'coffee':
        return <Home />;
      case 'coffee-details':
        return <Details coffeeId={coffeeId || 'eth-001'} />;
      case 'calendar':
        return <Calendar />;
      case 'store':
        return <Products />;
      case 'menu':
        return <Menu />;
      default:
        // If coffee ID is in URL, show details by default
        if (coffeeId) {
          return <Details coffeeId={coffeeId} />;
        }
        return <Home />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderPage()}
    </Layout>
  );
}

export default App;
