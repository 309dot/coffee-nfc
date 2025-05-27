import { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { StoreIcon } from '../components/icons';

interface Product {
  id: string;
  name: string;
  origin: string;
  price: number;
  badges: string[];
  image: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

function ProductModal({ isOpen, onClose, product }: ModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm mx-auto flex flex-col shadow-lg">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 pb-4">
          <h2 className="text-xl font-bold text-text-primary">
            상품 상세
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-6 pb-6 flex flex-col gap-4">
          {/* Product Image */}
          <div className="w-full h-48 rounded-xl overflow-hidden">
            <img
              src="/images/modal_img_sample.jpg"
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-bold text-text-primary">
                {product.name}
              </h3>
              <p className="text-sm text-text-muted">
                {product.origin}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.badges.map((badge, index) => (
                <Badge key={index} variant="secondary">
                  {badge}
                </Badge>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-xl font-bold text-text-primary">
                ₩{product.price.toLocaleString()}
              </span>
              <button className="bg-badge-bg text-badge-text px-6 py-2 rounded-full font-medium hover:bg-badge-bg/80 transition-colors">
                구매하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Products() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products: Product[] = [
    {
      id: '1',
      name: 'Ethiopian Yirgacheffe',
      origin: 'Sidamo, Ethiopia',
      price: 24000,
      badges: ['floral', 'citrus', 'light roast'],
      image: '/images/shop_img_sample.jpg',
    },
    {
      id: '2',
      name: 'Colombian Supremo',
      origin: 'Huila, Colombia',
      price: 22000,
      badges: ['chocolate', 'caramel', 'medium roast'],
      image: '/images/shop_img_sample.jpg',
    },
    {
      id: '3',
      name: 'Guatemalan Antigua',
      origin: 'Antigua, Guatemala',
      price: 26000,
      badges: ['spicy', 'smoky', 'dark roast'],
      image: '/images/shop_img_sample.jpg',
    },
    {
      id: '4',
      name: 'Brazilian Santos',
      origin: 'Santos, Brazil',
      price: 20000,
      badges: ['nutty', 'sweet', 'medium roast'],
      image: '/images/shop_img_sample.jpg',
    },
  ];

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="bg-white min-h-screen flex flex-col">
        {/* Header */}
        <section className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <StoreIcon size={24} className="text-badge-text" />
            <h1 className="text-2xl font-bold text-text-primary">
              Coffee Products
            </h1>
          </div>
          <p className="text-text-muted text-sm">
            프리미엄 원두를 만나보세요
          </p>
        </section>

        {/* Products Grid - 2단 레이아웃 */}
        <section className="px-6 flex-1">
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="bg-white border border-gray-200 rounded-2xl p-3 hover:shadow-md transition-all cursor-pointer"
              >
                {/* Product Image */}
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Product Info */}
                <div className="space-y-1">
                  <h3 className="font-bold text-text-primary text-sm leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-text-muted text-xs">
                    {product.origin}
                  </p>
                  <p className="font-bold text-text-primary text-sm">
                    ₩{product.price.toLocaleString()}
                  </p>
                  
                  {/* Badges - 최대 2개만 표시 */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.badges.slice(0, 2).map((badge, index) => (
                      <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Modal */}
      <ProductModal 
        isOpen={!!selectedProduct} 
        onClose={handleCloseModal} 
        product={selectedProduct}
      />
    </>
  );
} 