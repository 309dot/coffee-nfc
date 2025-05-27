import { MenuIcon, CoffeeIcon } from '../components/icons';
import { Badge } from '../components/ui/Badge';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'espresso' | 'drip' | 'cold';
  available: boolean;
}

export function Menu() {
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Espresso',
      description: '진한 에스프레소 샷',
      price: 4500,
      category: 'espresso',
      available: true,
    },
    {
      id: '2',
      name: 'Americano',
      description: '에스프레소 + 뜨거운 물',
      price: 5000,
      category: 'espresso',
      available: true,
    },
    {
      id: '3',
      name: 'Hand Drip',
      description: '핸드드립 원두 커피',
      price: 8000,
      category: 'drip',
      available: true,
    },
    {
      id: '4',
      name: 'Cold Brew',
      description: '차가운 콜드브루',
      price: 6500,
      category: 'cold',
      available: false,
    },
  ];

  const categories = [
    { id: 'espresso', name: 'Espresso', icon: '☕' },
    { id: 'drip', name: 'Hand Drip', icon: '💧' },
    { id: 'cold', name: 'Cold Brew', icon: '🧊' },
  ];

  return (
    <div className="bg-white rounded-b-2xl flex-1 flex flex-col">
      {/* Header - 텍스트 영역 */}
      <section className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <MenuIcon size={24} className="text-badge-text" />
          <h1 className="text-2xl font-bold text-text-primary">
            Coffee Menu
          </h1>
        </div>
        <p className="text-text-muted text-sm">
          오늘의 커피 메뉴를 확인하세요
        </p>
      </section>

      {/* Categories - Badge 영역 */}
      <section className="px-6 mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Badge key={category.id} className="whitespace-nowrap">
              {category.icon} {category.name}
            </Badge>
          ))}
        </div>
      </section>

      {/* Menu Items */}
      <section className="px-6 flex-1 overflow-y-auto">
        <div className="space-y-3">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`bg-gray-50 rounded-2xl p-4 transition-colors ${
                item.available 
                  ? 'hover:bg-gray-100 cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CoffeeIcon size={16} className="text-badge-text" />
                    <h3 className="font-bold text-text-primary">
                      {item.name}
                    </h3>
                    {!item.available && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        품절
                      </span>
                    )}
                  </div>
                  <p className="text-text-muted text-sm">
                    {item.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-text-primary">
                    ₩{item.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 