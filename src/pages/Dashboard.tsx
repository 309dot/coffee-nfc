import { useState, useEffect } from 'react';
import { api, type CoffeeApiData } from '../services/api';
import { firebaseApi } from '../services/firebaseApi';

interface CoffeeCardProps {
  coffee: CoffeeApiData;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
  isDarkMode: boolean;
}

// SVG 아이콘 컴포넌트들
const Icons = {
  Edit: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Delete: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Add: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Close: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Save: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Sun: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Moon: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  Copy: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
};

function CoffeeListItem({ coffee, onEdit, onDelete, onToggleActive, isDarkMode }: CoffeeCardProps) {
  const copyUrl = async (type: 'home' | 'detail' | 'shop') => {
    const baseUrl = window.location.origin;
    const urls = {
      home: `${baseUrl}/?coffee=${coffee.id}`,
      detail: `${baseUrl}/?page=details&coffee=${coffee.id}`,
      shop: `${baseUrl}/?page=shop&coffee=${coffee.id}`
    };
    
    try {
      await navigator.clipboard.writeText(urls[type]);
      alert(`${type.toUpperCase()} URL이 복사되었습니다!`);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className={`group flex items-center justify-between p-3 rounded-lg hover:bg-opacity-50 transition-all duration-200 ${
      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
    }`}>
      <div className="flex items-center flex-1 min-w-0">
        <input
          type="checkbox"
          checked={coffee.active}
          onChange={(e) => onToggleActive(coffee.id, e.target.checked)}
          className={`w-4 h-4 rounded border-2 mr-3 ${
            coffee.active 
              ? 'bg-orange-500 border-orange-500 text-white' 
              : isDarkMode 
                ? 'border-gray-600 bg-gray-800' 
                : 'border-gray-300 bg-white'
          }`}
        />
        <div className="flex-1 min-w-0">
          <div className={`font-medium truncate ${
            coffee.active 
              ? isDarkMode ? 'text-white' : 'text-gray-900'
              : isDarkMode ? 'text-gray-500 line-through' : 'text-gray-400 line-through'
          }`}>
            {coffee.titleKo}
          </div>
          <div className={`text-sm truncate ${
            coffee.active 
              ? isDarkMode ? 'text-gray-400' : 'text-gray-600'
              : isDarkMode ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {coffee.titleEn} • ₩{coffee.price?.toLocaleString() || '0'}
          </div>
        </div>
      </div>

      <div className={`flex items-center gap-2 transition-opacity duration-200 opacity-0 group-hover:opacity-100`}>
        <button
          onClick={() => copyUrl('home')}
          className={`p-1.5 rounded-md transition-colors ${
            isDarkMode 
              ? 'hover:bg-blue-900 text-blue-400' 
              : 'hover:bg-blue-100 text-blue-600'
          }`}
          title="Home URL 복사"
        >
          <Icons.Copy className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onEdit(coffee.id)}
          className={`p-1.5 rounded-md transition-colors ${
            isDarkMode 
              ? 'hover:bg-gray-700 text-gray-400' 
              : 'hover:bg-gray-200 text-gray-600'
          }`}
          title="편집"
        >
          <Icons.Edit className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(coffee.id)}
          className={`p-1.5 rounded-md transition-colors ${
            isDarkMode 
              ? 'hover:bg-red-900 text-red-400' 
              : 'hover:bg-red-100 text-red-600'
          }`}
          title="삭제"
        >
          <Icons.Delete className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function Dashboard() {
  const [coffees, setCoffees] = useState<CoffeeApiData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoffee, setEditingCoffee] = useState<CoffeeApiData | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [newCoffeeTitle, setNewCoffeeTitle] = useState('');
  const [formData, setFormData] = useState({
    titleKo: '',
    titleEn: '',
    flavorNotes: [] as string[],
    masterComment: '',
    country: '',
    farm: '',
    variety: '',
    process: '',
    region: '',
    altitude: '',
    description: '',
    price: 0,
    active: true
  });

  // Firebase 실시간 데이터 구독
  useEffect(() => {
    const unsubscribe = firebaseApi.subscribeToCoffees((updatedCoffees) => {
      setCoffees(updatedCoffees);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 다크모드 토글
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // 현재 날짜 포매팅
  const getCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return now.toLocaleDateString('ko-KR', options);
  };

  // 빠른 커피 추가
  const handleQuickAdd = () => {
    if (newCoffeeTitle.trim()) {
      setFormData({
        titleKo: newCoffeeTitle.trim(),
        titleEn: newCoffeeTitle.trim(),
        flavorNotes: [],
        masterComment: '',
        country: '',
        farm: '',
        variety: '',
        process: '',
        region: '',
        altitude: '',
        description: '',
        price: 0,
        active: true
      });
      setNewCoffeeTitle('');
      setShowForm(true);
    }
  };

  // 폼 관련 함수들
  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      titleKo: '', titleEn: '', flavorNotes: [], masterComment: '',
      country: '', farm: '', variety: '', process: '', region: '',
      altitude: '', description: '', price: 0, active: true
    });
    setEditingCoffee(null);
    setShowForm(false);
  };

  // CRUD 함수들
  const handleEdit = (id: string) => {
    const coffee = coffees.find(c => c.id === id);
    if (coffee) {
      setEditingCoffee(coffee);
      setFormData({
        titleKo: coffee.titleKo, titleEn: coffee.titleEn,
        flavorNotes: [...coffee.flavorNotes], masterComment: coffee.masterComment,
        country: coffee.country, farm: coffee.farm, variety: coffee.variety,
        process: coffee.process, region: coffee.region, altitude: coffee.altitude,
        description: coffee.description, price: coffee.price || 0, active: coffee.active
      });
      setShowForm(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말로 이 원두를 삭제하시겠습니까?')) {
      try {
        await api.deleteCoffee(id);
      } catch (error) {
        console.error('Error deleting coffee:', error);
      }
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      if (active) {
        await api.activateCoffee(id);
      } else {
        await api.deleteCoffee(id);
      }
    } catch (error) {
      console.error('Error toggling coffee status:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (editingCoffee) {
        await api.updateCoffee(editingCoffee.id, formData);
      } else {
        await api.createCoffee(formData);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving coffee:', error);
    }
  };

  const activeCoffees = coffees.filter(c => c.active);
  const inactiveCoffees = coffees.filter(c => !c.active);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="animate-pulse">
          <div className={`w-16 h-16 rounded-full mb-4 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              COFFEE
            </h1>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {getCurrentDate()}
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isDarkMode ? <Icons.Sun className="w-5 h-5" /> : <Icons.Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Active Coffees Section */}
        <div className={`rounded-2xl p-4 mb-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className={`font-bold text-lg mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            활성 원두 ({activeCoffees.length})
          </h2>
          
          <div className="space-y-1">
            {activeCoffees.map((coffee) => (
              <CoffeeListItem
                key={coffee.id}
                coffee={coffee}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>

          {/* Quick Add */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newCoffeeTitle}
                onChange={(e) => setNewCoffeeTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleQuickAdd()}
                placeholder="새 원두 추가..."
                className={`flex-1 px-3 py-2 rounded-lg border-none outline-none text-sm ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 placeholder-gray-500' 
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                }`}
              />
              <button
                onClick={handleQuickAdd}
                className={`p-2 rounded-lg transition-colors ${
                  newCoffeeTitle.trim()
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : isDarkMode 
                      ? 'bg-gray-700 text-gray-500' 
                      : 'bg-gray-200 text-gray-400'
                }`}
                disabled={!newCoffeeTitle.trim()}
              >
                <Icons.Add className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Inactive Coffees Section */}
        {inactiveCoffees.length > 0 && (
          <div className={`rounded-2xl p-4 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className={`font-bold text-lg mb-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              비활성 원두 ({inactiveCoffees.length})
            </h2>
            
            <div className="space-y-1">
              {inactiveCoffees.map((coffee) => (
                <CoffeeListItem
                  key={coffee.id}
                  coffee={coffee}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className={`text-xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {editingCoffee ? '원두 편집' : '새 원두 추가'}
                </h2>
                <button
                  onClick={resetForm}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'hover:bg-gray-700 text-gray-400' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <Icons.Close className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formData.titleKo}
                    onChange={(e) => handleInputChange('titleKo', e.target.value)}
                    placeholder="한글명"
                    className={`px-3 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => handleInputChange('titleEn', e.target.value)}
                    placeholder="영문명"
                    className={`px-3 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="나라"
                    className={`px-3 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                    placeholder="가격"
                    className={`px-3 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>

                <textarea
                  value={formData.masterComment}
                  onChange={(e) => handleInputChange('masterComment', e.target.value)}
                  placeholder="설명"
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border resize-none ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={resetForm}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    isDarkMode 
                      ? 'border border-gray-600 text-gray-400 hover:bg-gray-700' 
                      : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  {editingCoffee ? '수정' : '추가'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 