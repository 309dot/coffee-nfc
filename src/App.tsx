import { useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { initializeData } from './services/firebaseApi';

function App() {
  useEffect(() => {
    // Firebase 초기 데이터 설정
    initializeData();
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Dashboard />
    </div>
  );
}

export default App;
