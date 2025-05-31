import { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { firebaseApi } from '../services/firebaseApi';
import { FlavorNoteManagement } from '../components/FlavorNoteManagement';
import type { CoffeeApiData } from '../services/api';
import type { Product } from '../types';

type DashboardTab = 'coffees' | 'products' | 'flavorNotes';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('coffees');
  const [coffees, setCoffees] = useState<CoffeeApiData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // 알림 표시 함수
  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [coffeeData, productData] = await Promise.all([
        firebaseApi.getAllCoffees(),
        firebaseApi.getAllProducts()
      ]);
      
      setCoffees(coffeeData);
      setProducts(productData);
    } catch (error) {
      console.error('Error loading data:', error);
      showNotificationMessage('데이터 로딩 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 탭별 렌더링 함수들
  const renderCoffeesTab = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-text-primary break-keep word-break-keep">커피 관리</h2>
      <div className="grid gap-4">
        {coffees.map((coffee) => (
          <div key={coffee.id} className="p-4 border rounded-lg">
            <h3 className="font-semibold break-keep word-break-keep">{coffee.titleKo}</h3>
            <p className="text-sm text-text-muted break-keep word-break-keep">{coffee.titleEn}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {coffee.flavorNotes.map((note, index) => (
                <Badge key={index} className="break-keep word-break-keep">
                  {note}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProductsTab = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-text-primary break-keep word-break-keep">상품 관리</h2>
      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product.id} className="p-4 border rounded-lg">
            <h3 className="font-semibold break-keep word-break-keep">{product.titleKo}</h3>
            <p className="text-sm text-text-muted break-keep word-break-keep">{product.category}</p>
            <p className="font-bold break-keep word-break-keep">₩{product.price.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFlavorNotesTab = () => <FlavorNoteManagement />;

  if (loading) {
    return (
      <div className="flex flex-col gap-1 min-h-screen justify-center items-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="p-6 border-b bg-white">
        <h1 className="text-2xl font-bold text-text-primary break-keep word-break-keep">관리 대시보드</h1>
        <p className="text-text-muted mt-1 break-keep word-break-keep">커피와 상품 정보를 관리하세요</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setActiveTab('coffees')}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
              activeTab === 'coffees'
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            ☕ 커피 관리
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
              activeTab === 'products'
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            🏪 상품 관리
          </button>
          <button
            onClick={() => setActiveTab('flavorNotes')}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
              activeTab === 'flavorNotes'
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            🌟 풍미 노트
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'coffees' && renderCoffeesTab()}
          {activeTab === 'products' && renderProductsTab()}
          {activeTab === 'flavorNotes' && renderFlavorNotesTab()}
        </div>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-text-primary text-white px-6 py-3 rounded-lg shadow-lg break-keep word-break-keep">
            {notificationMessage}
          </div>
        </div>
      )}
    </div>
  );
} 