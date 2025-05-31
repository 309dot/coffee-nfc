import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { M1CTLogo, InstagramIcon, GlobeIcon } from '../components/icons';
import { api, type CoffeeApiData } from '../services/api';

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
  product: CoffeeApiData;
  onClick: () => void;
}

function ShopCard({ product, onClick }: ShopCardProps) {
  return (
    <div 
      className="flex flex-col gap-2 cursor-pointer hover:opacity-80 transition-opacity"
      onClick={onClick}
    >
      <div className="w-full h-44 bg-gray-100 rounded-lg overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
          <span className="text-3xl">☕</span>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-sm text-gray-600">coffee</p>
        <p className="text-base font-semibold text-gray-900">{product.titleKo}</p>
        <p className="text-base text-gray-900">{product.price ? `${product.price.toLocaleString()}원` : '가격 문의'}</p>
      </div>
    </div>
  );
}

export function Shop() {
  const [products, setProducts] = useState<CoffeeApiData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const coffees = await api.getAllCoffees();
        // 활성화된 커피만 필터링하고, 가격이 있는 항목을 우선적으로 표시
        const activeProducts = coffees.filter(coffee => coffee.active);
        setProducts(activeProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleProductClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-b-2xl flex-1 flex flex-col items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-b-2xl flex-1 flex flex-col">
        {/* Header - Logo와 버튼들 */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-gray-100">
          <div className="flex items-center">
            <M1CTLogo className="text-gray-900" />
          </div>
          <div className="flex items-center gap-2">
            <button className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
              <InstagramIcon size={20} className="text-white" />
            </button>
            <button className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
              <GlobeIcon size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Shop Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-4 gap-y-12">
              {products.map((product) => (
                <ShopCard
                  key={product.id}
                  product={product}
                  onClick={() => handleProductClick()}
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