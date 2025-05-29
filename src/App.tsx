import { useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Details } from './pages/Details';
import { Products } from './pages/Products';
import { Menu } from './pages/Menu';
import { Calendar } from './pages/Calendar';
import { EditCoffee } from './pages/EditCoffee';
import { useAppStore } from './store/useAppStore';

function App() {
  const { activeTab, setActiveTab, checkNFCSupport } = useAppStore();

  useEffect(() => {
    // Check NFC support on app load
    checkNFCSupport();
    
    // Check URL parameters for coffee ID and edit mode
    const urlParams = new URLSearchParams(window.location.search);
    const coffeeId = urlParams.get('coffee');
    const editMode = urlParams.get('edit');
    
    if (editMode) {
      // If edit mode is enabled, show edit page
      setActiveTab('coffee-edit');
    } else if (coffeeId) {
      // If coffee ID is provided, show details page
      setActiveTab('coffee-details');
    }
  }, [checkNFCSupport, setActiveTab]);

  const renderPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const coffeeId = urlParams.get('coffee');
    const editMode = urlParams.get('edit');
    
    switch (activeTab) {
      case 'coffee':
        return <Home />;
      case 'coffee-details':
        return <Details coffeeId={coffeeId || 'eth-001'} />;
      case 'coffee-edit':
        return <EditCoffee coffeeId={coffeeId || 'eth-001'} />;
      case 'calendar':
        return <Calendar />;
      case 'store':
        return <Products />;
      case 'menu':
        return <Menu />;
      default:
        // Check URL parameters to decide default page
        if (editMode) {
          return <EditCoffee coffeeId={coffeeId || 'eth-001'} />;
        } else if (coffeeId) {
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
