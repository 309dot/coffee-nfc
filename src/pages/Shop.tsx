import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { productApi } from '../services/api';
import type { Product } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ProductModal({ isOpen, onClose }: ProductModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-6">
      <div className="bg-white rounded-2xl w-full max-w-sm max-h-[620px] flex flex-col overflow-hidden">
        {/* Modal Header with Close Button */}
        <div className="relative">
          <div className="w-full h-72 bg-gray-100 rounded-t-2xl overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
              <span className="text-4xl">☕</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex flex-col h-full gap-8">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-600">notice</p>
              <h2 className="text-2xl font-bold text-gray-900">🙏</h2>
              <h3 className="text-2xl font-bold text-gray-900">매장 카운터에서 상품을 주문해주세요</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                현재 온라인 스토어를 운영하고 있지 않습니다. 구매를 원하신다면 카운터에서 상품을 다시 한번 문의 부탁드립니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ShopCardProps {
  product: Product;
  onClick: () => void;
}

function ShopCard({ product, onClick }: ShopCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* 상품 이미지 */}
      <div className="w-full h-40 bg-gray-100 rounded-xl mb-4 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.titleKo}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.jpg'; // fallback image
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-4xl">📦</div>
          </div>
        )}
      </div>

      {/* 카테고리 */}
      <div className="mb-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {product.category}
        </span>
      </div>

      {/* 상품명 */}
      <h3 className="font-bold text-lg text-text-primary mb-1 line-clamp-1">
        {product.titleKo}
      </h3>
      
      {product.titleEn && (
        <p className="text-sm text-text-muted mb-3 line-clamp-1">
          {product.titleEn}
        </p>
      )}

      {/* 가격 */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-text-primary">
          ₩{product.price.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await productApi.getAllProducts();
      // 활성 상품만 표시
      setProducts(productsData.filter(product => product.active));
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product: Product) => {
    // 상품 클릭 처리 (모달 등)
    console.log('Product clicked:', product);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🏪</div>
            <p className="text-text-muted">상품을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-b-2xl flex-1 flex flex-col">
        {/* Shop Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-4 gap-y-12">
              {products.map((product) => (
                <ShopCard
                  key={product.id}
                  product={product}
                  onClick={() => handleProductClick(product)}
                />
              ))}
            </div>
            
            {products.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <span className="text-4xl mb-4">☕</span>
                <p>등록된 상품이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
} 