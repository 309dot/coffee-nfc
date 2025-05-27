import { Badge } from '../components/ui/Badge';
import { StoreIcon } from '../components/icons';

interface Product {
  id: string;
  name: string;
  origin: string;
  price: number;
  badges: string[];
  image?: string;
}

export function Products() {
  const products: Product[] = [
    {
      id: '1',
      name: 'Ethiopian Yirgacheffe',
      origin: 'Sidamo, Ethiopia',
      price: 24000,
      badges: ['floral', 'citrus', 'light roast'],
    },
    {
      id: '2',
      name: 'Colombian Supremo',
      origin: 'Huila, Colombia',
      price: 22000,
      badges: ['chocolate', 'caramel', 'medium roast'],
    },
    {
      id: '3',
      name: 'Guatemalan Antigua',
      origin: 'Antigua, Guatemala',
      price: 26000,
      badges: ['spicy', 'smoky', 'dark roast'],
    },
  ];

  return (
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
              className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-text-primary text-lg">
                    {product.name}
                  </h3>
                  <p className="text-text-muted text-sm mt-1">
                    {product.origin}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-text-primary">
                    ₩{product.price.toLocaleString()}
                  </p>
                </div>
              </div>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.badges.map((badge, index) => (
                  <Badge key={index} variant="secondary">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 