import { useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { Menu } from './pages/Menu';
import { Calendar } from './pages/Calendar';
import { useAppStore } from './store/useAppStore';

function App() {
  const { activeTab, setActiveTab, checkNFCSupport } = useAppStore();

  useEffect(() => {
    // Check NFC support on app load
    checkNFCSupport();
  }, [checkNFCSupport]);

  const renderPage = () => {
    switch (activeTab) {
      case 'coffee':
        return <Home />;
      case 'calendar':
        return <Calendar />;
      case 'store':
        return <Products />;
      case 'menu':
        return <Menu />;
      default:
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
