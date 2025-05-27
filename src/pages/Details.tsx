import { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { ArrowRightIcon } from '../components/icons';
import { api, type CoffeeData } from '../services/api';
import { useAppStore } from '../store/useAppStore';

interface DetailsProps {
  coffeeId?: string;
}

export function Details({ coffeeId = 'eth-001' }: DetailsProps) {
  const [coffee, setCoffee] = useState<CoffeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, addToFavorites, favorites } = useAppStore();

  useEffect(() => {
    const loadCoffeeData = async () => {
      setLoading(true);
      try {
        const data = await api.getCoffeeById(coffeeId);
        setCoffee(data);
      } catch (error) {
        console.error('Error loading coffee data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCoffeeData();
  }, [coffeeId]);

  const handleAddToCart = () => {
    if (coffee) {
      addToCart({
        id: coffee.id,
        name: coffee.name,
        price: coffee.price,
        quantity: 1,
      });
      alert('장바구니에 추가되었습니다!');
    }
  };

  const handleAddToFavorites = () => {
    if (coffee) {
      addToFavorites(coffee.id);
      alert('즐겨찾기에 추가되었습니다!');
    }
  };

  const isFavorite = coffee ? favorites.includes(coffee.id) : false;

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

  if (!coffee) {
    return (
      <div className="bg-white rounded-b-2xl flex-1 flex flex-col items-center justify-center p-6">
        <p className="text-text-muted">커피 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-b-2xl flex-1 flex flex-col">
      {/* Header */}
      <section className="px-6 pt-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-text-primary leading-tight">
            {coffee.name}
          </h1>
          <p className="text-base font-light text-text-primary mt-1">
            {coffee.origin}
          </p>
        </div>
        
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {coffee.badges.map((badge, index) => (
            <Badge key={index}>
              {badge}
            </Badge>
          ))}
        </div>
      </section>

      {/* Coffee Details */}
      <section className="px-6 flex-1 overflow-y-auto">
        <div className="space-y-4">
          {/* Description */}
          <div className="bg-comment-bg rounded-2xl p-4">
            <h3 className="font-bold text-text-primary mb-2">설명</h3>
            <p className="text-text-primary text-sm">
              {coffee.description}
            </p>
          </div>

          {/* Coffee Info */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-bold text-text-primary mb-3">커피 정보</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-text-muted">농부</p>
                <p className="font-medium text-text-primary">{coffee.farmer}</p>
              </div>
              <div>
                <p className="text-text-muted">고도</p>
                <p className="font-medium text-text-primary">{coffee.altitude}</p>
              </div>
              <div>
                <p className="text-text-muted">가공 방식</p>
                <p className="font-medium text-text-primary">{coffee.processingMethod}</p>
              </div>
              <div>
                <p className="text-text-muted">로스팅</p>
                <p className="font-medium text-text-primary">{coffee.roastLevel}</p>
              </div>
              <div>
                <p className="text-text-muted">수확 시기</p>
                <p className="font-medium text-text-primary">{coffee.harvestDate}</p>
              </div>
              <div>
                <p className="text-text-muted">가격</p>
                <p className="font-bold text-text-primary">₩{coffee.price.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Tasting Notes */}
          <div className="bg-cta-bg rounded-2xl p-4">
            <h3 className="font-bold text-text-primary mb-3">테이스팅 노트</h3>
            <div className="flex flex-wrap gap-2">
              {coffee.tastingNotes.map((note, index) => (
                <span
                  key={index}
                  className="bg-white text-text-primary px-3 py-1 rounded-full text-sm font-medium"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="px-6 py-4 border-t border-gray-100">
        <div className="flex gap-3">
          <button
            onClick={handleAddToFavorites}
            disabled={isFavorite}
            className={`flex-1 py-3 rounded-full font-medium transition-colors ${
              isFavorite
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-badge-bg text-badge-text hover:bg-badge-bg/80'
            }`}
          >
            {isFavorite ? '즐겨찾기 완료' : '즐겨찾기 추가'}
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-text-primary text-white py-3 rounded-full font-medium hover:bg-text-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            장바구니 담기
            <ArrowRightIcon size={16} />
          </button>
        </div>
      </section>
    </div>
  );
} 