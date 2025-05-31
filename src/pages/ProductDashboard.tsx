import { useState, useEffect } from 'react';
import { firebaseApi } from '../services/firebaseApi';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

// SVG 아이콘 컴포넌트들
const Icons = {
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
  Image: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
};

function ProductCard({ product, onEdit, onDelete, onToggleActive }: ProductCardProps) {
  return (
    <div className={`border rounded-xl p-4 sm:p-6 transition-all duration-200 hover:shadow-lg ${
      product.active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-lg sm:text-xl truncate ${
            product.active ? 'text-text-primary' : 'text-gray-400'
          }`}>
            {product.titleKo}
          </h3>
          {product.titleEn && (
            <p className={`text-sm sm:text-base truncate ${
              product.active ? 'text-text-muted' : 'text-gray-400'
            }`}>
              {product.titleEn}
            </p>
          )}
          <div className="mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              product.active 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-400'
            }`}>
              {product.category}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 ml-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            product.active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.active ? '활성' : '비활성'}
          </span>
          <span className="text-sm sm:text-base font-medium text-text-primary">
            ₩{product.price.toLocaleString()}
          </span>
        </div>
      </div>

      {product.description && (
        <p className="text-sm text-text-muted mb-4 line-clamp-2">
          {product.description}
        </p>
      )}

      {product.imageUrl && (
        <div className="mb-4">
          <img 
            src={product.imageUrl} 
            alt={product.titleKo}
            className="w-full h-32 object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* CRUD 버튼들 */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onEdit(product.id)}
          className="flex items-center justify-center gap-2 py-3 px-3 bg-text-primary text-white rounded-lg text-sm font-medium hover:bg-text-primary/90 transition-colors"
          title="편집"
        >
          <Icons.Edit className="w-4 h-4" />
          <span className="hidden sm:inline">편집</span>
        </button>
        <button
          onClick={() => onToggleActive(product.id, !product.active)}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-sm font-medium transition-colors ${
            product.active
              ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
              : 'bg-green-100 text-green-800 hover:bg-green-200'
          }`}
          title={product.active ? '비활성화' : '활성화'}
        >
          <Icons.Toggle className="w-4 h-4" />
          <span className="hidden sm:inline">{product.active ? '비활성화' : '활성화'}</span>
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="flex items-center justify-center gap-2 py-3 px-3 bg-red-100 text-red-800 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
          title="삭제"
        >
          <Icons.Delete className="w-4 h-4" />
          <span className="hidden sm:inline">삭제</span>
        </button>
      </div>
    </div>
  );
}

export function ProductDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product form data
  const [formData, setFormData] = useState({
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
    const unsubscribe = firebaseApi.subscribeToProducts((updatedProducts) => {
      setProducts(updatedProducts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      category: '',
      titleKo: '',
      titleEn: '',
      price: 0,
      description: '',
      imageUrl: '',
      active: true
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setFormData({
        category: product.category,
        titleKo: product.titleKo,
        titleEn: product.titleEn || '',
        price: product.price,
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        active: product.active
      });
      setEditingProduct(product);
      setShowForm(true);
    }
  };

  const handleDelete = async (id: string) => {
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
      const updatedProduct = await firebaseApi.toggleProductActive(id, active);
      if (updatedProduct) {
        setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
      alert('상품 상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleSave = async () => {
    if (!formData.titleKo.trim()) {
      alert('상품명(한글)을 입력해주세요.');
      return;
    }
    if (!formData.category.trim()) {
      alert('카테고리를 입력해주세요.');
      return;
    }
    if (formData.price <= 0) {
      alert('올바른 가격을 입력해주세요.');
      return;
    }

    try {
      if (editingProduct) {
        // 업데이트
        const updatedProduct = await firebaseApi.updateProduct(editingProduct.id, formData);
        if (updatedProduct) {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
        }
      } else {
        // 새로 생성
        const newProduct = await firebaseApi.createProduct(formData);
        setProducts(prev => [...prev, newProduct]);
      }
      resetForm();
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
            <div className="text-4xl mb-4">🏪</div>
            <p className="text-text-muted">상품 정보를 불러오는 중...</p>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">상품 관리</h1>
            <p className="text-text-muted">Shop 페이지에 표시될 상품들을 관리하세요</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-3 bg-text-primary text-white rounded-xl hover:bg-text-primary/90 transition-colors"
          >
            <Icons.Add className="w-5 h-5" />
            새 상품 추가
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-green-50 p-4 sm:p-6 rounded-xl">
            <div className="text-2xl sm:text-3xl font-bold text-green-600">
              {products.filter(p => p.active).length}
            </div>
            <div className="text-sm sm:text-base text-green-600">활성 상품</div>
          </div>
          <div className="bg-orange-50 p-4 sm:p-6 rounded-xl">
            <div className="text-2xl sm:text-3xl font-bold text-orange-600">
              {products.filter(p => !p.active).length}
            </div>
            <div className="text-sm sm:text-base text-orange-600">비활성 상품</div>
          </div>
          <div className="bg-blue-50 p-4 sm:p-6 rounded-xl">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              {products.length}
            </div>
            <div className="text-sm sm:text-base text-blue-600">전체 상품</div>
          </div>
        </div>

        {/* Product List */}
        <div className="space-y-6">
          <h2 className="text-lg sm:text-xl font-semibold text-text-primary">상품 목록</h2>
          {products.length === 0 ? (
            <div className="text-center py-12 sm:py-16 text-text-muted">
              <div className="text-4xl sm:text-6xl mb-4">🏪</div>
              <p className="text-lg sm:text-xl">등록된 상품이 없습니다.</p>
              <p className="text-sm sm:text-base">새 상품을 추가해보세요!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
                  {editingProduct ? '상품 편집' : '새 상품 추가'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  title="닫기"
                >
                  <Icons.Close className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      카테고리 *
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
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
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                      placeholder="원"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      상품명(한글) *
                    </label>
                    <input
                      type="text"
                      value={formData.titleKo}
                      onChange={(e) => handleInputChange('titleKo', e.target.value)}
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
                      value={formData.titleEn}
                      onChange={(e) => handleInputChange('titleEn', e.target.value)}
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
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
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
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={formData.imageUrl}
                        alt="미리보기"
                        className="w-24 h-24 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
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
                    상품 활성화
                  </label>
                </div>
              </div>

              {/* Form Actions */}
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