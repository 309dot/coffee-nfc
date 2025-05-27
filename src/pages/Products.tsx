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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl w-[327px] h-[620px] flex flex-col gap-4 p-4 pb-6 shadow-lg">
        {/* Top Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path 
                d="M14.6967 14.6967C14.8897 14.8897 14.8897 15.2026 14.6967 15.3956C14.5037 15.5886 14.1908 15.5886 13.9978 15.3956L10 11.3978L6.00224 15.3956C5.80924 15.5886 5.49635 15.5886 5.30335 15.3956C5.11035 15.2026 5.11035 14.8897 5.30335 14.6967L9.30113 10.6989L5.30335 6.70112C5.11035 6.50812 5.11035 6.19523 5.30335 6.00223C5.49635 5.80923 5.80924 5.80923 6.00224 6.00223L10 10L13.9978 6.00223C14.1908 5.80923 14.5037 5.80923 14.6967 6.00223C14.8897 6.19523 14.8897 6.50812 14.6967 6.70112L10.6989 10.6989L14.6967 14.6967Z" 
                fill="rgba(15, 19, 36, 0.6)"
              />
            </svg>
          </button>
        </div>

        {/* Container */}
        <div className="flex flex-col gap-6 flex-1">
          {/* Product Info */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-normal text-text-muted leading-[1.43] tracking-[-0.007em]">
              {product.origin}
            </span>
            <h2 className="text-2xl font-bold text-text-primary leading-[1.33] tracking-[-0.0125em]">
              {product.name}
            </h2>
            <p className="text-base font-normal text-text-primary leading-[1.5] tracking-[-0.0125em]">
              ₩{product.price.toLocaleString()}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {product.badges.map((badge, index) => (
                <Badge key={index}>
                  {badge}
                </Badge>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="flex-1 bg-gray-200 rounded-lg bg-cover bg-center overflow-hidden">
            <img
              src="/images/modal_img_sample.jpg"
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Purchase Button */}
          <button className="bg-badge-bg text-badge-text px-6 py-3 rounded-full font-medium hover:bg-badge-bg/80 transition-colors">
            구매하기
          </button>
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
  ];

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="bg-white rounded-b-2xl flex-1 flex flex-col">
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

        {/* Products List */}
        <section className="px-6 flex-1 overflow-y-auto">
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-text-primary text-lg">
                          {product.name}
                        </h3>
                        <p className="text-text-muted text-sm">
                          {product.origin}
                        </p>
                      </div>
                      <p className="font-bold text-text-primary">
                        ₩{product.price.toLocaleString()}
                      </p>
                    </div>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-1">
                      {product.badges.map((badge, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
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