import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { firebaseApi } from '../services/firebaseApi';
import type { Product } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ProductModal({ isOpen, onClose }: ProductModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/55 backdrop-blur-sm p-6">
      <div className="bg-white rounded-2xl w-full max-w-sm max-h-[620px] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header with Close Button */}
        <div className="relative">
          <div 
            className="w-full h-72 bg-gray-100 overflow-hidden"
            style={{ borderRadius: '16px' }}
          >
            <img
              src="/modal-product-image.png"
              alt="Product"
              className="w-full h-full object-cover"
              style={{ borderRadius: '16px' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center" style="border-radius: 16px"><span class="text-4xl">☕</span></div>';
                }
              }}
            />
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
              <h3 className="text-2xl font-bold text-gray-900 break-keep word-break-keep">매장 카운터에서 상품을 주문해주세요</h3>
              <p className="text-sm text-gray-600 leading-relaxed break-keep word-break-keep">
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

// Figma 디자인과 정확히 일치하는 ShopCard 컴포넌트
function ShopCard({ product, onClick }: ShopCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col gap-2 cursor-pointer"
    >
      {/* 상품 이미지 - Figma: 180px 높이, 8px border-radius */}
      <div 
        className="bg-gray-100 rounded-lg overflow-hidden w-full"
        style={{ height: '180px', borderRadius: '8px' }}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.titleKo}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.jpg';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-4xl">📦</div>
          </div>
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className="flex flex-col gap-0">
        {/* 카테고리 - Figma: Inter 400, 14px, opacity 40% */}
        <p 
          className="text-sm font-normal leading-tight tracking-tight break-keep word-break-keep"
          style={{ 
            color: 'rgba(13, 17, 38, 0.4)',
            fontSize: '14px',
            lineHeight: '1.43em',
            letterSpacing: '-0.71%'
          }}
        >
          {product.category}
        </p>
        
        {/* 제목 - Figma: Inter 600, 16px */}
        <h3 
          className="font-semibold leading-tight tracking-tight break-keep word-break-keep"
          style={{ 
            color: '#14151A',
            fontSize: '16px',
            lineHeight: '1.5em',
            letterSpacing: '-1.25%'
          }}
        >
          {product.titleKo}
        </h3>
        
        {/* 가격 - Figma: Inter 400, 16px */}
        <p 
          className="font-normal leading-tight tracking-tight break-keep word-break-keep"
          style={{ 
            color: '#14151A',
            fontSize: '16px',
            lineHeight: '1.5em',
            letterSpacing: '-1.25%'
          }}
        >
          {product.price.toLocaleString()}원
        </p>
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
    
    // URL에서 product ID 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    
    if (productId) {
      // 특정 상품이 지정된 경우 처리
      console.log('Loading product from URL:', productId);
      // 여기서 특정 상품을 하이라이트하거나 모달을 열 수 있습니다
    }
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await firebaseApi.getAllProducts();
      // 활성 상품만 표시
      setProducts(productsData.filter(product => product.active));
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (_product: Product) => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-b-2xl flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">🏪</div>
              <p>상품을 불러오는 중...</p>
            </div>
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
          {/* Figma 디자인: 24px 패딩, 48px 갭 */}
          <div className="p-6" style={{ padding: '24px', gap: '48px' }}>
            {/* Product Grid - Figma: 2열 그리드 */}
            <div 
              className="grid grid-cols-2 gap-y-12 gap-x-4"
            >
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