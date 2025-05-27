
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
    <div className="bg-white rounded-b-2xl flex-1 flex flex-col pt-20 pb-24">
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

      {/* Products Grid */}
      <section className="px-6 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col gap-2 w-[155.5px] cursor-pointer"
            >
              {/* Image */}
              <div className="w-full h-[180px] bg-gray-200 rounded-lg bg-cover bg-center" />
              
              {/* Text Content */}
              <div className="flex flex-col">
                <span className="text-sm font-normal text-text-muted leading-[1.43] tracking-[-0.007em]">
                  coffee
                </span>
                <span className="text-base font-semibold text-text-primary leading-[1.5] tracking-[-0.0125em]">
                  {product.name}
                </span>
                <span className="text-base font-normal text-text-primary leading-[1.5] tracking-[-0.0125em]">
                  ₩{product.price.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 