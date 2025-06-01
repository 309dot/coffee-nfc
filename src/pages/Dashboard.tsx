import { useState, useEffect, useMemo } from 'react';
import { Badge } from '../components/ui/Badge';
import { Toast, useToast } from '../components/ui/Toast';
import { FlavorNoteManager } from '../components/FlavorNoteManager';
import type { CoffeeApiData } from '../services/api';
import * as firebaseApi from '../services/firebaseApi';
import type { Product, FlavorNote } from '../types';
// 개발 모드에서만 import
import { addSampleCoffees } from '../utils/addSampleCoffees';

interface CoffeeCardProps {
  coffee: CoffeeApiData;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
  showToast: (message: string) => void;
}

interface ProductCardProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
  showToast: (message: string) => void;
}

// SVG 아이콘 컴포넌트들
const Icons = {
  Coffee: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M9 5v1m6-1v1M8 8h8a1 1 0 011 1v8a1 1 0 01-1 1H8a1 1 0 01-1-1V9a1 1 0 011-1z" />
    </svg>
  ),
  Shop: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  Edit: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Toggle: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
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
  Copy: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  Link: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  ChevronDown: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
};

// 토글 버튼 컴포넌트
function ToggleButton({ checked, onChange, disabled = false }: { 
  checked: boolean; 
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked 
          ? 'bg-blue-500' 
          : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

// 인풋 셀렉트 박스 컴포넌트
function InputSelect({ 
  value, 
  onChange, 
  options, 
  placeholder = "선택하세요",
  onAddNew,
  onSelect
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ id: string; value: string; label: string; emoji?: string }>;
  placeholder?: string;
  onAddNew?: () => void;
  onSelect?: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
    option.value.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    onChange(''); // 검색 중에는 선택값 초기화
  };

  const selectOption = (option: { value: string; label: string }) => {
    setInputValue(''); // 선택 후 입력값 초기화
    onChange('');
    setIsOpen(false);
    if (onSelect) {
      onSelect(option.value); // 선택 시 즉시 콜백 호출
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-text-primary"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <Icons.ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => selectOption(option)}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
              >
                {option.emoji && <span>{option.emoji}</span>}
                <span>{option.label}</span>
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500 text-center">
              검색 결과가 없습니다.
              {onAddNew && (
                <button
                  type="button"
                  onClick={() => {
                    onAddNew();
                    setIsOpen(false);
                  }}
                  className="block w-full mt-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  새로 등록하기
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 가격 입력 컴포넌트
function PriceInput({ 
  value, 
  onChange, 
  placeholder = "0" 
}: { 
  value: number; 
  onChange: (value: number) => void;
  placeholder?: string;
}) {
  const [displayValue, setDisplayValue] = useState(value ? value.toLocaleString() : '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^\d]/g, ''); // 숫자만 추출
    const numericValue = parseInt(inputValue) || 0;
    
    setDisplayValue(numericValue ? numericValue.toLocaleString() : '');
    onChange(numericValue);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        className="w-full px-3 py-2 pr-8 border rounded-lg focus:ring-2 focus:ring-text-primary"
        placeholder={placeholder}
      />
      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
        원
      </span>
    </div>
  );
}

// 고도 입력 컴포넌트
function AltitudeInput({ 
  value, 
  onChange, 
  placeholder = "0" 
}: { 
  value: string; 
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [displayValue, setDisplayValue] = useState(value.replace('m', ''));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^\d,]/g, ''); // 숫자와 콤마만 허용
    const numericValue = parseInt(inputValue.replace(/,/g, '')) || 0;
    const formattedValue = numericValue.toLocaleString();
    setDisplayValue(formattedValue);
    onChange(formattedValue + 'm');
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        className="w-full px-3 py-2 pr-8 border rounded-lg focus:ring-2 focus:ring-text-primary"
        placeholder={placeholder}
      />
      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
        m
      </span>
    </div>
  );
}

function CoffeeCard({ coffee, onEdit, onDelete, onToggleActive, showToast }: CoffeeCardProps) {
  const baseUrl = window.location.origin;
  const homeUrl = `${baseUrl}/?coffee=${coffee.id}`;

  const copyHomeUrl = async () => {
    try {
      await navigator.clipboard.writeText(homeUrl);
      showToast('홈 URL이 클립보드에 복사되었습니다!');
    } catch (error) {
      console.error('Failed to copy:', error);
      showToast('복사에 실패했습니다.');
    }
  };

  return (
    <div className={`border rounded-2xl p-6 transition-all duration-200 hover:shadow-lg relative ${
      coffee.active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
    }`}>
      {/* 우측 상단 컨트롤 */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        {/* 활성화 토글 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            {coffee.active ? '활성화' : '비활성화'}
          </span>
          <ToggleButton
            checked={coffee.active}
            onChange={(checked) => onToggleActive(coffee.id, checked)}
          />
        </div>
      </div>

      {/* 제목 */}
      <div className="pr-20 mb-4">
        <h3 className={`text-xl font-bold mb-3 ${
          coffee.active ? 'text-gray-900' : 'text-gray-400'
        }`}>
          {coffee.titleKo}
        </h3>
      </div>

      {/* 풍미 노트 배지 */}
      {coffee.flavorNotes && coffee.flavorNotes.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {coffee.flavorNotes.slice(0, 3).map((note, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  coffee.active 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {note}
              </span>
            ))}
            {coffee.flavorNotes.length > 3 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                +{coffee.flavorNotes.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 액션 버튼들 */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={copyHomeUrl}
          className="flex items-center justify-center w-10 h-10 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors"
          title="홈 URL 복사"
        >
          <Icons.Link className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(coffee.id)}
          className="flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
          title="편집"
        >
          <Icons.Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(coffee.id)}
          className="flex items-center justify-center w-10 h-10 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
          title="삭제"
        >
          <Icons.Delete className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ProductCard({ product, onEdit, onDelete, onToggleActive, showToast }: ProductCardProps) {
  const baseUrl = window.location.origin;
  const homeUrl = `${baseUrl}/?product=${product.id}`;

  const copyHomeUrl = async () => {
    try {
      await navigator.clipboard.writeText(homeUrl);
      showToast('홈 URL이 클립보드에 복사되었습니다!');
    } catch (error) {
      console.error('Failed to copy:', error);
      showToast('복사에 실패했습니다.');
    }
  };

  return (
    <div className={`border rounded-2xl p-6 transition-all duration-200 hover:shadow-lg relative ${
      product.active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
    }`}>
      {/* 우측 상단 컨트롤 */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        {/* 활성화 토글 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            {product.active ? '활성화' : '비활성화'}
          </span>
          <ToggleButton
            checked={product.active}
            onChange={(checked) => onToggleActive(product.id, checked)}
          />
        </div>
      </div>

      {/* 제목과 가격 */}
      <div className="pr-20 mb-4">
        {/* 카테고리 */}
        <div className="mb-2">
          <span className="text-sm font-medium text-gray-600">
            {product.category}
          </span>
        </div>
        
        <h3 className={`text-xl font-bold mb-3 ${
          product.active ? 'text-gray-900' : 'text-gray-400'
        }`}>
          {product.titleKo}
        </h3>
        <div className="text-lg font-semibold text-gray-900">
          ₩{product.price.toLocaleString()}
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={copyHomeUrl}
          className="flex items-center justify-center w-10 h-10 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors"
          title="홈 URL 복사"
        >
          <Icons.Link className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(product.id)}
          className="flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
          title="편집"
        >
          <Icons.Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="flex items-center justify-center w-10 h-10 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
          title="삭제"
        >
          <Icons.Delete className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function Dashboard() {
  const [coffees, setCoffees] = useState<CoffeeApiData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [flavorNotes, setFlavorNotes] = useState<FlavorNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'coffee' | 'products' | 'flavorNotes'>('coffee');
  const [showForm, setShowForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingCoffee, setEditingCoffee] = useState<CoffeeApiData | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedFlavorNote, setSelectedFlavorNote] = useState('');
  const [showFlavorNoteForm, setShowFlavorNoteForm] = useState(false);
  const [newFlavorNoteData, setNewFlavorNoteData] = useState({
    titleKo: '',
    titleEn: '',
    emoji: '☕',
    description: '',
    category: ''
  });

  // 토스트 메시지
  const { toast, showToast, hideToast } = useToast();

  // 새로운 필터링 및 정렬 상태
  const [coffeeFilter, setCoffeeFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [productFilter, setProductFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [coffeeSort, setCoffeeSort] = useState<'newest' | 'oldest' | 'name' | 'price'>('newest');
  const [productSort, setProductSort] = useState<'newest' | 'oldest' | 'name' | 'price' | 'category'>('newest');
  const [searchTerm, setSearchTerm] = useState('');

  // Coffee form data
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

  // Product form data
  const [productFormData, setProductFormData] = useState({
    category: '',
    titleKo: '',
    titleEn: '',
    price: 0,
    description: '',
    imageUrl: '',
    active: true
  });

  // 풍미 노트 옵션 데이터 변환
  const flavorNoteOptions = flavorNotes.map(note => ({
    id: note.id,
    value: note.titleKo,
    label: note.titleKo,
    emoji: note.emoji
  }));

  // Firebase 실시간 데이터 구독
  useEffect(() => {
    const unsubscribeCoffees = firebaseApi.subscribeToCoffees((updatedCoffees) => {
      setCoffees(updatedCoffees);
      setLoading(false);
    });

    const unsubscribeProducts = firebaseApi.subscribeToProducts((updatedProducts) => {
      setProducts(updatedProducts);
    });

    const unsubscribeFlavorNotes = firebaseApi.subscribeToFlavorNotes((updatedFlavorNotes) => {
      setFlavorNotes(updatedFlavorNotes);
    });

    return () => {
      unsubscribeCoffees();
      unsubscribeProducts();
      unsubscribeFlavorNotes();
    };
  }, []);

  // 필터링 및 정렬된 데이터 계산
  const filteredAndSortedCoffees = useMemo(() => {
    // 1단계: 검색 필터 적용
    let searchFiltered = coffees;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      searchFiltered = coffees.filter(coffee => 
        coffee.titleKo.toLowerCase().includes(term) ||
        coffee.titleEn.toLowerCase().includes(term) ||
        coffee.country?.toLowerCase().includes(term) ||
        coffee.flavorNotes?.some(note => note.toLowerCase().includes(term))
      );
    }

    // 2단계: 상태 필터 적용
    let statusFiltered = searchFiltered;
    if (coffeeFilter === 'active') {
      statusFiltered = searchFiltered.filter(coffee => coffee.active);
    } else if (coffeeFilter === 'inactive') {
      statusFiltered = searchFiltered.filter(coffee => !coffee.active);
    }

    // 3단계: 정렬 적용
    const sorted = [...statusFiltered].sort((a, b) => {
      switch (coffeeSort) {
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'oldest':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case 'name':
          return a.titleKo.localeCompare(b.titleKo);
        case 'price':
          return (b.price || 0) - (a.price || 0);
        default:
          return 0;
      }
    });

    return sorted;
  }, [coffees, searchTerm, coffeeFilter, coffeeSort]);

  const filteredAndSortedProducts = useMemo(() => {
    // 1단계: 검색 필터 적용
    let searchFiltered = products;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      searchFiltered = products.filter(product => 
        product.titleKo.toLowerCase().includes(term) ||
        product.titleEn?.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
    }

    // 2단계: 상태 필터 적용
    let statusFiltered = searchFiltered;
    if (productFilter === 'active') {
      statusFiltered = searchFiltered.filter(product => product.active);
    } else if (productFilter === 'inactive') {
      statusFiltered = searchFiltered.filter(product => !product.active);
    }

    // 3단계: 정렬 적용
    const sorted = [...statusFiltered].sort((a, b) => {
      switch (productSort) {
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'oldest':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case 'name':
          return a.titleKo.localeCompare(b.titleKo);
        case 'price':
          return b.price - a.price;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, searchTerm, productFilter, productSort]);

  // 개별 초기화 함수들
  const resetSearch = () => setSearchTerm('');
  const resetStatusFilter = () => {
    if (activeTab === 'coffee') {
      setCoffeeFilter('all');
    } else {
      setProductFilter('all');
    }
  };
  const resetSort = () => {
    if (activeTab === 'coffee') {
      setCoffeeSort('newest');
    } else {
      setProductSort('newest');
    }
  };

  // 현재 활성화된 필터 개수 계산
  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if ((activeTab === 'coffee' ? coffeeFilter : productFilter) !== 'all') count++;
    if ((activeTab === 'coffee' ? coffeeSort : productSort) !== 'newest') count++;
    return count;
  };

  // 폼 관련 함수들
  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProductInputChange = (field: string, value: string | number | boolean) => {
    setProductFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      titleKo: '',
      titleEn: '',
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
    setSelectedFlavorNote('');
    setEditingCoffee(null);
    setShowForm(false);
  };

  const resetProductForm = () => {
    setProductFormData({
      category: '',
      titleKo: '',
      titleEn: '',
      price: 0,
      description: '',
      imageUrl: '',
      active: true
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleEdit = (id: string) => {
    const coffee = coffees.find(c => c.id === id);
    if (coffee) {
      setFormData({
        titleKo: coffee.titleKo,
        titleEn: coffee.titleEn,
        flavorNotes: coffee.flavorNotes || [],
        masterComment: coffee.masterComment || '',
        country: coffee.country || '',
        farm: coffee.farm || '',
        variety: coffee.variety || '',
        process: coffee.process || '',
        region: coffee.region || '',
        altitude: coffee.altitude || '',
        description: coffee.description || '',
        price: coffee.price || 0,
        active: coffee.active
      });
      setEditingCoffee(coffee);
      setShowForm(true);
    }
  };

  const handleProductEdit = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setProductFormData({
        category: product.category,
        titleKo: product.titleKo,
        titleEn: product.titleEn || '',
        price: product.price,
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        active: product.active
      });
      setEditingProduct(product);
      setShowProductForm(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말로 이 커피를 삭제하시겠습니까?')) {
      try {
        await firebaseApi.deleteCoffee(id);
        showToast('커피가 삭제되었습니다.');
      } catch (error) {
        console.error('Error deleting coffee:', error);
        showToast('커피 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleProductDelete = async (id: string) => {
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      try {
        await firebaseApi.deleteProduct(id);
        showToast('상품이 삭제되었습니다.');
      } catch (error) {
        console.error('Error deleting product:', error);
        showToast('상품 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      await firebaseApi.updateCoffee(id, { active });
      showToast(`커피가 ${active ? '활성화' : '비활성화'}되었습니다.`);
    } catch (error) {
      console.error('Error toggling coffee status:', error);
      showToast('커피 상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleProductToggleActive = async (id: string, active: boolean) => {
    try {
      const updatedProduct = await firebaseApi.toggleProductActive(id, active);
      if (updatedProduct) {
        setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
        showToast(`상품이 ${active ? '활성화' : '비활성화'}되었습니다.`);
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
      showToast('상품 상태 변경 중 오류가 발생했습니다.');
    }
  };

  const addFlavorNote = (noteValue: string) => {
    if (noteValue && !formData.flavorNotes.includes(noteValue)) {
      setFormData(prev => ({
        ...prev,
        flavorNotes: [...prev.flavorNotes, noteValue]
      }));
      setSelectedFlavorNote('');
    }
  };

  const removeFlavorNote = (index: number) => {
    setFormData(prev => ({
      ...prev,
      flavorNotes: prev.flavorNotes.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    if (!formData.titleKo.trim()) {
      showToast('커피명(한글)을 입력해주세요.');
      return;
    }
    if (!formData.titleEn.trim()) {
      showToast('커피명(영문)을 입력해주세요.');
      return;
    }

    try {
      if (editingCoffee) {
        const updatedCoffee = await firebaseApi.updateCoffee(editingCoffee.id, formData);
        if (updatedCoffee) {
          setCoffees(prev => prev.map(c => c.id === editingCoffee.id ? updatedCoffee : c));
          showToast('커피가 수정되었습니다.');
        }
      } else {
        const newCoffee = await firebaseApi.createCoffee(formData);
        setCoffees(prev => [...prev, newCoffee]);
        showToast('새 커피가 추가되었습니다.');
      }
      resetForm();
    } catch (error) {
      console.error('Error saving coffee:', error);
      showToast('커피 저장 중 오류가 발생했습니다.');
    }
  };

  const handleProductSave = async () => {
    if (!productFormData.titleKo.trim()) {
      showToast('상품명(한글)을 입력해주세요.');
      return;
    }
    if (!productFormData.category.trim()) {
      showToast('카테고리를 입력해주세요.');
      return;
    }
    if (productFormData.price <= 0) {
      showToast('올바른 가격을 입력해주세요.');
      return;
    }

    try {
      if (editingProduct) {
        const updatedProduct = await firebaseApi.updateProduct(editingProduct.id, productFormData);
        if (updatedProduct) {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
          showToast('상품이 수정되었습니다.');
        }
      } else {
        const newProduct = await firebaseApi.createProduct(productFormData);
        setProducts(prev => [...prev, newProduct]);
        showToast('새 상품이 추가되었습니다.');
      }
      resetProductForm();
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('상품 저장 중 오류가 발생했습니다.');
    }
  };

  // 신규 풍미 노트 등록 함수
  const handleNewFlavorNoteSubmit = async () => {
    if (!newFlavorNoteData.titleKo.trim() || !newFlavorNoteData.titleEn.trim()) {
      showToast('풍미 노트 제목을 입력해주세요.');
      return;
    }

    try {
      const newFlavorNote = await firebaseApi.createFlavorNote(newFlavorNoteData);
      // 새로 생성된 풍미 노트를 선택된 상태로 설정
      setSelectedFlavorNote(newFlavorNote.titleKo);
      setShowFlavorNoteForm(false);
      setNewFlavorNoteData({
        titleKo: '',
        titleEn: '',
        emoji: '☕',
        description: '',
        category: ''
      });
      showToast('새 풍미 노트가 등록되었습니다.');
    } catch (error) {
      console.error('Error creating flavor note:', error);
      showToast('풍미 노트 등록 중 오류가 발생했습니다.');
    }
  };

  const handleNewFlavorNoteInputChange = (field: string, value: string) => {
    setNewFlavorNoteData(prev => ({ ...prev, [field]: value }));
  };

  // 중복 체크 함수들 추가
  const getDuplicateError = (field: 'titleKo' | 'titleEn', value: string) => {
    if (!value.trim()) return '';
    
    const duplicate = coffees.find(coffee => 
      coffee[field].toLowerCase() === value.toLowerCase() && 
      (!editingCoffee || coffee.id !== editingCoffee.id)
    );
    
    return duplicate ? `이미 "${value}"로 등록된 커피가 있습니다.` : '';
  };

  // 실시간 중복 체크
  const titleKoError = getDuplicateError('titleKo', formData.titleKo);
  const titleEnError = getDuplicateError('titleEn', formData.titleEn);

  // Product form 중복 체크
  const getProductDuplicateError = (field: 'titleKo' | 'titleEn', value: string) => {
    if (!value.trim()) return '';
    
    const duplicate = products.find(product => 
      product[field]?.toLowerCase() === value.toLowerCase() && 
      (!editingProduct || product.id !== editingProduct.id)
    );
    
    return duplicate ? `이미 "${value}"로 등록된 상품이 있습니다.` : '';
  };

  const productTitleKoError = getProductDuplicateError('titleKo', productFormData.titleKo);
  const productTitleEnError = getProductDuplicateError('titleEn', productFormData.titleEn);

  // 전체 삭제 함수 추가
  const handleDeleteAll = async () => {
    if (!window.confirm('정말로 모든 커피를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    if (!window.confirm('마지막 확인: 정말로 모든 커피 데이터를 삭제하시겠습니까?')) {
      return;
    }

    try {
      // 모든 커피 삭제
      const deletePromises = coffees.map(coffee => firebaseApi.deleteCoffee(coffee.id));
      await Promise.all(deletePromises);
      showToast(`${coffees.length}개의 커피가 모두 삭제되었습니다.`);
    } catch (error) {
      console.error('Error deleting all coffees:', error);
      showToast('전체 삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">☕</div>
            <p className="text-text-muted">데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">관리 대시보드</h1>
            <p className="text-text-muted">커피, 상품, 풍미노트를 통합 관리하세요</p>
          </div>
          
          {/* 개발 모드 도구 */}
          {import.meta.env.DEV && (
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  const success = await addSampleCoffees();
                  if (success) {
                    showToast('샘플 커피 4개가 추가되었습니다!');
                  } else {
                    showToast('샘플 커피 추가 중 오류가 발생했습니다.');
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                샘플 커피 추가
              </button>
              <button
                onClick={handleDeleteAll}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                전체 삭제
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setActiveTab('coffee')}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
              activeTab === 'coffee'
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Icons.Coffee className="w-4 h-4" />
            <span className="hidden sm:inline">커피 관리</span>
            <span className="sm:hidden">커피</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
              activeTab === 'products'
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Icons.Shop className="w-4 h-4" />
            <span className="hidden sm:inline">상품 관리</span>
            <span className="sm:hidden">상품</span>
          </button>
          <button
            onClick={() => setActiveTab('flavorNotes')}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
              activeTab === 'flavorNotes'
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            🌟
            <span className="hidden sm:inline">풍미노트 관리</span>
            <span className="sm:hidden">풍미노트</span>
          </button>
        </div>

        {/* Filter and Sort Controls + Add Button - 풍미노트 탭에서는 숨김 */}
        {activeTab !== 'flavorNotes' && (
          <div className="flex flex-col gap-3">
            {/* 컴팩트한 필터 및 추가 버튼 - 모바일 최적화 */}
            <div className="flex items-center justify-between gap-3">
              {/* 왼쪽: 검색/필터/정렬 */}
              <div className="flex items-center gap-2 flex-1">
                {/* 검색 */}
                <div className="relative flex-1 min-w-0 sm:min-w-[200px] sm:max-w-xs">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`${activeTab === 'coffee' ? '커피명, 원산지' : '상품명, 카테고리'} 검색`}
                    className="w-full pl-8 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-text-primary focus:border-text-primary transition-colors"
                  />
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {searchTerm && (
                    <button
                      onClick={resetSearch}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <Icons.Close className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* 상태 필터 드롭다운 */}
                <div className="relative">
                  <select
                    value={activeTab === 'coffee' ? coffeeFilter : productFilter}
                    onChange={(e) => {
                      if (activeTab === 'coffee') {
                        setCoffeeFilter(e.target.value as 'all' | 'active' | 'inactive');
                      } else {
                        setProductFilter(e.target.value as 'all' | 'active' | 'inactive');
                      }
                    }}
                    className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-7 py-2 text-sm focus:ring-2 focus:ring-text-primary focus:border-text-primary transition-colors cursor-pointer min-w-[90px]"
                  >
                    <option value="all">전체</option>
                    <option value="active">활성</option>
                    <option value="inactive">비활성</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* 정렬 드롭다운 */}
                <div className="relative">
                  <select
                    value={activeTab === 'coffee' ? coffeeSort : productSort}
                    onChange={(e) => {
                      if (activeTab === 'coffee') {
                        setCoffeeSort(e.target.value as 'newest' | 'oldest' | 'name' | 'price');
                      } else {
                        setProductSort(e.target.value as 'newest' | 'oldest' | 'name' | 'price' | 'category');
                      }
                    }}
                    className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-7 py-2 text-sm focus:ring-2 focus:ring-text-primary focus:border-text-primary transition-colors cursor-pointer min-w-[90px]"
                  >
                    <option value="newest">최신순</option>
                    <option value="oldest">오래된순</option>
                    <option value="name">이름순</option>
                    <option value="price">가격순</option>
                    {activeTab === 'products' && (
                      <option value="category">카테고리순</option>
                    )}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* 필터 초기화 버튼 (필터가 적용된 경우에만 표시) */}
                {getActiveFiltersCount() > 0 && (
                  <button
                    onClick={() => {
                      resetSearch();
                      resetStatusFilter();
                      resetSort();
                    }}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap min-h-[36px]"
                    title="모든 필터 초기화"
                  >
                    <Icons.Close className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 오른쪽: 새 아이템 추가 버튼 (데스크톱에서만 표시) */}
              <button
                onClick={() => activeTab === 'coffee' ? setShowForm(true) : setShowProductForm(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-text-primary text-white rounded-lg hover:bg-text-primary/90 transition-colors whitespace-nowrap min-h-[36px] touch-manipulation"
              >
                <Icons.Add className="w-4 h-4" />
                새 {activeTab === 'coffee' ? '커피' : '상품'} 추가
              </button>
            </div>

            {/* 결과 요약 (필터가 적용된 경우에만 표시) */}
            {getActiveFiltersCount() > 0 && (
              <div className="bg-gray-50 px-3 py-2 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">
                      {activeTab === 'coffee' ? filteredAndSortedCoffees.length : filteredAndSortedProducts.length}개
                    </span>
                    <span className="text-gray-500">
                      / 전체 {activeTab === 'coffee' ? coffees.length : products.length}개
                    </span>
                  </div>
                  
                  {/* 활성 필터 태그 */}
                  <div className="flex flex-wrap gap-1">
                    {searchTerm && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                        "{searchTerm.length > 10 ? searchTerm.substring(0, 10) + '...' : searchTerm}"
                        <button onClick={resetSearch} className="ml-1 hover:text-blue-900">
                          <Icons.Close className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {(activeTab === 'coffee' ? coffeeFilter : productFilter) !== 'all' && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                        {(activeTab === 'coffee' ? coffeeFilter : productFilter) === 'active' ? '활성' : '비활성'}
                        <button onClick={resetStatusFilter} className="ml-1 hover:text-green-900">
                          <Icons.Close className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {(activeTab === 'coffee' ? coffeeSort : productSort) !== 'newest' && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                        {(activeTab === 'coffee' 
                          ? [
                              { value: 'newest', label: '최신순' },
                              { value: 'oldest', label: '오래된순' },
                              { value: 'name', label: '이름순' },
                              { value: 'price', label: '가격순' }
                            ]
                          : [
                              { value: 'newest', label: '최신순' },
                              { value: 'oldest', label: '오래된순' },
                              { value: 'name', label: '이름순' },
                              { value: 'price', label: '가격순' },
                              { value: 'category', label: '카테고리순' }
                            ]
                        ).find(option => option.value === (activeTab === 'coffee' ? coffeeSort : productSort))?.label}
                        <button onClick={resetSort} className="ml-1 hover:text-purple-900">
                          <Icons.Close className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 모바일 플로팅 추가 버튼 */}
        {activeTab !== 'flavorNotes' && (
          <button
            onClick={() => activeTab === 'coffee' ? setShowForm(true) : setShowProductForm(true)}
            className="fixed bottom-6 right-6 sm:hidden flex items-center justify-center w-14 h-14 bg-text-primary text-white rounded-full shadow-lg hover:bg-text-primary/90 transition-all duration-200 z-40 hover:scale-105"
            title={`새 ${activeTab === 'coffee' ? '커피' : '상품'} 추가`}
          >
            <Icons.Add className="w-6 h-6" />
          </button>
        )}

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'flavorNotes' ? (
            <FlavorNoteManager />
          ) : (
            <>
              {(activeTab === 'coffee' ? filteredAndSortedCoffees : filteredAndSortedProducts).length === 0 ? (
                <div className="text-center py-12 text-text-muted">
                  <div className="text-4xl mb-4">{activeTab === 'coffee' ? '☕' : '🏪'}</div>
                  <p className="text-lg">등록된 {activeTab === 'coffee' ? '커피' : '상품'}가 없습니다.</p>
                  <p className="text-sm">새 {activeTab === 'coffee' ? '커피' : '상품'}를 추가해보세요!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {activeTab === 'coffee' && filteredAndSortedCoffees.map((coffee) => (
                    <CoffeeCard
                      key={coffee.id}
                      coffee={coffee}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleActive={handleToggleActive}
                      showToast={showToast}
                    />
                  ))}
                  {activeTab === 'products' && filteredAndSortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={handleProductEdit}
                      onDelete={handleProductDelete}
                      onToggleActive={handleProductToggleActive}
                      showToast={showToast}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Coffee Form Modal - 높이 고정 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl h-[90vh] flex flex-col">
            <div className="p-6 flex-shrink-0">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-text-primary">
                  {editingCoffee ? '커피 편집' : '새 커피 추가'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Icons.Close className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6">
              <div className="space-y-4 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      커피명(한글) *
                    </label>
                    <input
                      type="text"
                      value={formData.titleKo}
                      onChange={(e) => handleInputChange('titleKo', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors ${
                        titleKoError 
                          ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                          : 'border-gray-300 focus:ring-text-primary'
                      }`}
                    />
                    {titleKoError && (
                      <p className="text-red-500 text-xs mt-1">{titleKoError}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      커피명(영문) *
                    </label>
                    <input
                      type="text"
                      value={formData.titleEn}
                      onChange={(e) => handleInputChange('titleEn', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors ${
                        titleEnError 
                          ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                          : 'border-gray-300 focus:ring-text-primary'
                      }`}
                    />
                    {titleEnError && (
                      <p className="text-red-500 text-xs mt-1">{titleEnError}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      가격
                    </label>
                    <PriceInput
                      value={formData.price}
                      onChange={(value) => handleInputChange('price', value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      원산지
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      농장
                    </label>
                    <input
                      type="text"
                      value={formData.farm}
                      onChange={(e) => handleInputChange('farm', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      품종
                    </label>
                    <input
                      type="text"
                      value={formData.variety}
                      onChange={(e) => handleInputChange('variety', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      가공 방식
                    </label>
                    <input
                      type="text"
                      value={formData.process}
                      onChange={(e) => handleInputChange('process', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                      placeholder="예: 워시드, 내추럴"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      지역
                    </label>
                    <input
                      type="text"
                      value={formData.region}
                      onChange={(e) => handleInputChange('region', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    고도
                  </label>
                  <AltitudeInput
                    value={formData.altitude}
                    onChange={(value) => handleInputChange('altitude', value)}
                    placeholder="1,800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    풍미 노트
                  </label>
                  <div className="mb-2">
                    <InputSelect
                      value={selectedFlavorNote}
                      onChange={setSelectedFlavorNote}
                      options={flavorNoteOptions}
                      placeholder="풍미 노트를 검색하거나 선택하세요"
                      onAddNew={() => setShowFlavorNoteForm(true)}
                      onSelect={(value) => addFlavorNote(value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.flavorNotes.map((note, index) => (
                      <Badge
                        key={index}
                        className="cursor-pointer hover:bg-red-100 hover:text-red-800"
                        onClick={() => removeFlavorNote(index)}
                      >
                        {note} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    마스터 코멘트
                  </label>
                  <textarea
                    value={formData.masterComment}
                    onChange={(e) => handleInputChange('masterComment', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                    placeholder="커피에 대한 전문가의 코멘트"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    상세 설명
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                    placeholder="커피에 대한 자세한 설명을 입력해주세요"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0 p-6 pt-0">
              <div className="flex gap-3">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  disabled={!!titleKoError || !!titleEnError || !formData.titleKo.trim() || !formData.titleEn.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-text-primary text-white rounded-lg hover:bg-text-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icons.Save className="w-4 h-4" />
                  {editingCoffee ? '수정' : '저장'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal - 높이 고정 */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl h-[90vh] flex flex-col">
            <div className="p-6 flex-shrink-0">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-text-primary">
                  {editingProduct ? '상품 편집' : '새 상품 추가'}
                </h2>
                <button
                  onClick={resetProductForm}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Icons.Close className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6">
              <div className="space-y-4 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      카테고리 *
                    </label>
                    <input
                      type="text"
                      value={productFormData.category}
                      onChange={(e) => handleProductInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                      placeholder="예: 드립백, 원두, 굿즈"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      가격 *
                    </label>
                    <PriceInput
                      value={productFormData.price}
                      onChange={(value) => handleProductInputChange('price', value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      상품명(한글) *
                    </label>
                    <input
                      type="text"
                      value={productFormData.titleKo}
                      onChange={(e) => handleProductInputChange('titleKo', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors ${
                        productTitleKoError 
                          ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                          : 'border-gray-300 focus:ring-text-primary'
                      }`}
                      placeholder="예: 에티오피아 드립백"
                    />
                    {productTitleKoError && (
                      <p className="text-red-500 text-xs mt-1">{productTitleKoError}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      상품명(영문)
                    </label>
                    <input
                      type="text"
                      value={productFormData.titleEn}
                      onChange={(e) => handleProductInputChange('titleEn', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors ${
                        productTitleEnError 
                          ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                          : 'border-gray-300 focus:ring-text-primary'
                      }`}
                      placeholder="예: Ethiopia Drip Bag"
                    />
                    {productTitleEnError && (
                      <p className="text-red-500 text-xs mt-1">{productTitleEnError}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    상품 설명
                  </label>
                  <textarea
                    value={productFormData.description}
                    onChange={(e) => handleProductInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                    placeholder="상품에 대한 간단한 설명"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    이미지 업로드
                  </label>
                  <div className="space-y-3">
                    {/* 파일 업로드 */}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const result = event.target?.result as string;
                              handleProductInputChange('imageUrl', result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                      />
                      <p className="text-xs text-gray-500 mt-1">또는 아래에 이미지 URL을 직접 입력하세요</p>
                    </div>
                    
                    {/* URL 입력 */}
                    <div>
                      <input
                        type="url"
                        value={productFormData.imageUrl}
                        onChange={(e) => handleProductInputChange('imageUrl', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    {/* 미리보기 */}
                    {productFormData.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={productFormData.imageUrl}
                          alt="미리보기"
                          className="w-32 h-32 object-cover rounded-lg border"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0 p-6 pt-0">
              <div className="flex gap-3">
                <button
                  onClick={resetProductForm}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleProductSave}
                  disabled={!!productTitleKoError || !!productTitleEnError || !productFormData.titleKo.trim() || !productFormData.category.trim() || productFormData.price <= 0}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-text-primary text-white rounded-lg hover:bg-text-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icons.Save className="w-4 h-4" />
                  {editingProduct ? '수정' : '저장'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Flavor Note Form Modal */}
      {showFlavorNoteForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-text-primary">새 풍미 노트 등록</h2>
                <button
                  onClick={() => setShowFlavorNoteForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Icons.Close className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      제목(한글) *
                    </label>
                    <input
                      type="text"
                      value={newFlavorNoteData.titleKo}
                      onChange={(e) => handleNewFlavorNoteInputChange('titleKo', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                      placeholder="예: 레몬 껍질"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      제목(영문) *
                    </label>
                    <input
                      type="text"
                      value={newFlavorNoteData.titleEn}
                      onChange={(e) => handleNewFlavorNoteInputChange('titleEn', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                      placeholder="예: lemon peel"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      이모지
                    </label>
                    <input
                      type="text"
                      value={newFlavorNoteData.emoji}
                      onChange={(e) => handleNewFlavorNoteInputChange('emoji', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                      placeholder="🍋"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      카테고리
                    </label>
                    <input
                      type="text"
                      value={newFlavorNoteData.category}
                      onChange={(e) => handleNewFlavorNoteInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                      placeholder="과일, 견과류, 플로럴 등"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    설명
                  </label>
                  <textarea
                    value={newFlavorNoteData.description}
                    onChange={(e) => handleNewFlavorNoteInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                    placeholder="풍미 노트에 대한 자세한 설명"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowFlavorNoteForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleNewFlavorNoteSubmit}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-text-primary text-white rounded-lg hover:bg-text-primary/90 transition-colors"
                  disabled={!newFlavorNoteData.titleKo.trim() || !newFlavorNoteData.titleEn.trim()}
                >
                  <Icons.Save className="w-4 h-4" />
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast 컴포넌트 */}
      <Toast 
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
} 