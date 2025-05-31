import { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import type { CoffeeApiData } from '../services/api';
import { firebaseApi } from '../services/firebaseApi';
import type { Product } from '../types';

interface CoffeeCardProps {
  coffee: CoffeeApiData;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

interface ProductCardProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
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
  )
};

function CoffeeCard({ coffee, onEdit, onDelete, onToggleActive }: CoffeeCardProps) {
  const baseUrl = window.location.origin;
  const homeUrl = `${baseUrl}/?coffee=${coffee.id}`;

  const copyHomeUrl = async () => {
    try {
      await navigator.clipboard.writeText(homeUrl);
      alert('홈 URL이 클립보드에 복사되었습니다!');
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('복사에 실패했습니다.');
    }
  };

  return (
    <div className={`border rounded-xl p-4 transition-all duration-200 hover:shadow-lg ${
      coffee.active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-lg truncate ${
            coffee.active ? 'text-text-primary' : 'text-gray-400'
          }`}>
            {coffee.titleKo}
          </h3>
          <p className={`text-sm truncate ${
            coffee.active ? 'text-text-muted' : 'text-gray-400'
          }`}>
            {coffee.titleEn}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 ml-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            coffee.active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {coffee.active ? '활성' : '비활성'}
          </span>
          <span className="text-sm font-medium text-text-primary">
            {coffee.price ? `₩${coffee.price.toLocaleString()}` : '가격 미설정'}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {coffee.flavorNotes.slice(0, 2).map((note, index) => (
          <Badge key={index} className="text-xs">
            {note}
          </Badge>
        ))}
        {coffee.flavorNotes.length > 2 && (
          <span className="text-xs text-text-muted">+{coffee.flavorNotes.length - 2}</span>
        )}
      </div>

      {/* 간단한 아이콘 버튼들 */}
      <div className="flex gap-2">
        <button
          onClick={copyHomeUrl}
          className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
          title="홈 URL 복사"
        >
          <Icons.Link className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(coffee.id)}
          className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
          title="편집"
        >
          <Icons.Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onToggleActive(coffee.id, !coffee.active)}
          className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
            coffee.active
              ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
              : 'bg-green-100 text-green-600 hover:bg-green-200'
          }`}
          title={coffee.active ? '비활성화' : '활성화'}
        >
          <Icons.Toggle className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(coffee.id)}
          className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
          title="삭제"
        >
          <Icons.Delete className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ProductCard({ product, onEdit, onDelete, onToggleActive }: ProductCardProps) {
  const baseUrl = window.location.origin;
  const homeUrl = `${baseUrl}/?product=${product.id}`;

  const copyHomeUrl = async () => {
    try {
      await navigator.clipboard.writeText(homeUrl);
      alert('홈 URL이 클립보드에 복사되었습니다!');
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('복사에 실패했습니다.');
    }
  };

  return (
    <div className={`border rounded-xl p-4 transition-all duration-200 hover:shadow-lg ${
      product.active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-lg truncate ${
            product.active ? 'text-text-primary' : 'text-gray-400'
          }`}>
            {product.titleKo}
          </h3>
          {product.titleEn && (
            <p className={`text-sm truncate ${
              product.active ? 'text-text-muted' : 'text-gray-400'
            }`}>
              {product.titleEn}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 ml-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.active ? '활성' : '비활성'}
          </span>
          <span className="text-sm font-medium text-text-primary">
            ₩{product.price.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          product.active 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-gray-100 text-gray-400'
        }`}>
          {product.category}
        </span>
      </div>

      {/* 간단한 아이콘 버튼들 */}
      <div className="flex gap-2">
        <button
          onClick={copyHomeUrl}
          className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
          title="홈 URL 복사"
        >
          <Icons.Link className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(product.id)}
          className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
          title="편집"
        >
          <Icons.Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onToggleActive(product.id, !product.active)}
          className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
            product.active
              ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
              : 'bg-green-100 text-green-600 hover:bg-green-200'
          }`}
          title={product.active ? '비활성화' : '활성화'}
        >
          <Icons.Toggle className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'coffee' | 'products'>('coffee');
  const [showForm, setShowForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingCoffee, setEditingCoffee] = useState<CoffeeApiData | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [flavorNoteInput, setFlavorNoteInput] = useState('');

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

  // Firebase 실시간 데이터 구독
  useEffect(() => {
    const unsubscribeCoffees = firebaseApi.subscribeToCoffees((updatedCoffees) => {
      setCoffees(updatedCoffees);
      setLoading(false);
    });

    const unsubscribeProducts = firebaseApi.subscribeToProducts((updatedProducts) => {
      setProducts(updatedProducts);
    });

    return () => {
      unsubscribeCoffees();
      unsubscribeProducts();
    };
  }, []);

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
    setFlavorNoteInput('');
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
        setCoffees(prev => prev.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting coffee:', error);
        alert('커피 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleProductDelete = async (id: string) => {
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      try {
        await firebaseApi.deleteProduct(id);
        setProducts(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('상품 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      if (active) {
        await firebaseApi.updateCoffee(id, { active });
      } else {
        await firebaseApi.deleteCoffee(id);
      }
      setCoffees(prev => prev.map(c => c.id === id ? { ...c, active } : c));
    } catch (error) {
      console.error('Error toggling coffee status:', error);
      alert('커피 상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleProductToggleActive = async (id: string, active: boolean) => {
    try {
      const updatedProduct = await firebaseApi.toggleProductActive(id, active);
      if (updatedProduct) {
        setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
      alert('상품 상태 변경 중 오류가 발생했습니다.');
    }
  };

  const addFlavorNote = () => {
    if (flavorNoteInput.trim() && !formData.flavorNotes.includes(flavorNoteInput.trim())) {
      setFormData(prev => ({
        ...prev,
        flavorNotes: [...prev.flavorNotes, flavorNoteInput.trim()]
      }));
      setFlavorNoteInput('');
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
      alert('커피명(한글)을 입력해주세요.');
      return;
    }
    if (!formData.titleEn.trim()) {
      alert('커피명(영문)을 입력해주세요.');
      return;
    }

    try {
      if (editingCoffee) {
        const updatedCoffee = await firebaseApi.updateCoffee(editingCoffee.id, formData);
        if (updatedCoffee) {
          setCoffees(prev => prev.map(c => c.id === editingCoffee.id ? updatedCoffee : c));
        }
      } else {
        const newCoffee = await firebaseApi.createCoffee(formData);
        setCoffees(prev => [...prev, newCoffee]);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving coffee:', error);
      alert('커피 저장 중 오류가 발생했습니다.');
    }
  };

  const handleProductSave = async () => {
    if (!productFormData.titleKo.trim()) {
      alert('상품명(한글)을 입력해주세요.');
      return;
    }
    if (!productFormData.category.trim()) {
      alert('카테고리를 입력해주세요.');
      return;
    }
    if (productFormData.price <= 0) {
      alert('올바른 가격을 입력해주세요.');
      return;
    }

    try {
      if (editingProduct) {
        const updatedProduct = await firebaseApi.updateProduct(editingProduct.id, productFormData);
        if (updatedProduct) {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
        }
      } else {
        const newProduct = await firebaseApi.createProduct(productFormData);
        setProducts(prev => [...prev, newProduct]);
      }
      resetProductForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('상품 저장 중 오류가 발생했습니다.');
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
            <p className="text-text-muted">커피와 상품을 통합 관리하세요</p>
          </div>
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
            커피 관리
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
            상품 관리
          </button>
        </div>

        {/* Add Button */}
        <div className="flex justify-end">
          <button
            onClick={() => activeTab === 'coffee' ? setShowForm(true) : setShowProductForm(true)}
            className="flex items-center gap-2 px-4 py-3 bg-text-primary text-white rounded-xl hover:bg-text-primary/90 transition-colors"
          >
            <Icons.Add className="w-5 h-5" />
            새 {activeTab === 'coffee' ? '커피' : '상품'} 추가
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {(activeTab === 'coffee' ? coffees : products).length === 0 ? (
            <div className="text-center py-12 text-text-muted">
              <div className="text-4xl mb-4">{activeTab === 'coffee' ? '☕' : '🏪'}</div>
              <p className="text-lg">등록된 {activeTab === 'coffee' ? '커피' : '상품'}가 없습니다.</p>
              <p className="text-sm">새 {activeTab === 'coffee' ? '커피' : '상품'}를 추가해보세요!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeTab === 'coffee' && coffees.map((coffee) => (
                <CoffeeCard
                  key={coffee.id}
                  coffee={coffee}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                />
              ))}
              {activeTab === 'products' && products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleProductEdit}
                  onDelete={handleProductDelete}
                  onToggleActive={handleProductToggleActive}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Coffee Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
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

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      커피명(한글) *
                    </label>
                    <input
                      type="text"
                      value={formData.titleKo}
                      onChange={(e) => handleInputChange('titleKo', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      커피명(영문) *
                    </label>
                    <input
                      type="text"
                      value={formData.titleEn}
                      onChange={(e) => handleInputChange('titleEn', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      가격
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                      min="0"
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
                  <input
                    type="text"
                    value={formData.altitude}
                    onChange={(e) => handleInputChange('altitude', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                    placeholder="예: 1,800m"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    풍미 노트
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={flavorNoteInput}
                      onChange={(e) => setFlavorNoteInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addFlavorNote()}
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                      placeholder="풍미 노트 입력 후 추가 버튼 클릭"
                    />
                    <button
                      onClick={addFlavorNote}
                      type="button"
                      className="px-4 py-2 bg-text-primary text-white rounded-lg hover:bg-text-primary/90"
                    >
                      추가
                    </button>
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

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => handleInputChange('active', e.target.checked)}
                    className="w-4 h-4 text-text-primary rounded"
                  />
                  <label htmlFor="active" className="text-sm font-medium text-text-primary">
                    커피 활성화
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-text-primary text-white rounded-lg hover:bg-text-primary/90 transition-colors"
                >
                  <Icons.Save className="w-4 h-4" />
                  {editingCoffee ? '수정' : '저장'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
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

              <div className="space-y-4">
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
                    <input
                      type="number"
                      value={productFormData.price}
                      onChange={(e) => handleProductInputChange('price', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                      placeholder="원"
                      min="0"
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
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                      placeholder="예: 에티오피아 드립백"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      상품명(영문)
                    </label>
                    <input
                      type="text"
                      value={productFormData.titleEn}
                      onChange={(e) => handleProductInputChange('titleEn', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                      placeholder="예: Ethiopia Drip Bag"
                    />
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
                    이미지 URL
                  </label>
                  <input
                    type="url"
                    value={productFormData.imageUrl}
                    onChange={(e) => handleProductInputChange('imageUrl', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="productActive"
                    checked={productFormData.active}
                    onChange={(e) => handleProductInputChange('active', e.target.checked)}
                    className="w-4 h-4 text-text-primary rounded"
                  />
                  <label htmlFor="productActive" className="text-sm font-medium text-text-primary">
                    상품 활성화
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={resetProductForm}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleProductSave}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-text-primary text-white rounded-lg hover:bg-text-primary/90 transition-colors"
                >
                  <Icons.Save className="w-4 h-4" />
                  {editingProduct ? '수정' : '저장'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 