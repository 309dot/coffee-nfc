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

  const closeModal = () => {
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
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-text-primary">
                  {selectedProduct.name}
                </h2>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Modal Image */}
              <div className="w-full h-48 rounded-xl overflow-hidden mb-4">
                <img
                  src="/images/modal_img_sample.jpg"
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Modal Content */}
              <div className="space-y-4">
                <div>
                  <p className="text-text-muted text-sm mb-1">원산지</p>
                  <p className="text-text-primary font-medium">
                    {selectedProduct.origin}
                  </p>
                </div>

                <div>
                  <p className="text-text-muted text-sm mb-2">특징</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.badges.map((badge, index) => (
                      <Badge key={index}>
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-text-primary">
                      ₩{selectedProduct.price.toLocaleString()}
                    </span>
                    <button className="bg-badge-bg text-badge-text px-6 py-2 rounded-full font-medium hover:bg-badge-bg/80 transition-colors">
                      구매하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 