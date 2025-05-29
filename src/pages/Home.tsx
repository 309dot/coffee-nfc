import { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { M1CTLogo, ArrowRightIcon } from '../components/icons';
import { api, type CoffeeData } from '../services/api';

export function Home() {
  const [coffee, setCoffee] = useState<CoffeeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCoffeeData = async () => {
      setLoading(true);
      try {
        // 첫 번째 활성 원두 데이터 로드
        const allCoffees = await api.getAllCoffees();
        if (allCoffees.length > 0) {
          setCoffee(allCoffees[0]);
        }
      } catch (error) {
        console.error('Error loading coffee data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCoffeeData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-1 min-h-screen justify-center items-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!coffee) {
    return (
      <div className="flex flex-col gap-1 min-h-screen justify-center items-center">
        <p className="text-text-muted">커피 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 min-h-screen justify-between">
      {/* Title Section */}
      <section className="bg-white rounded-b-2xl px-6 py-10 flex flex-col gap-2 flex-1 justify-center">
        <div className="mb-auto">
          <h1 className="text-4xl font-bold text-text-primary leading-tight tracking-tight">
            {coffee.name}
          </h1>
          <p className="text-base font-light text-text-primary mt-2 tracking-tight">
            {coffee.origin}
          </p>
        </div>
        
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-2">
          {coffee.badges.map((badge, index) => (
            <Badge key={index}>
              {badge}
            </Badge>
          ))}
        </div>
      </section>

      {/* Comment Card */}
      <section className="bg-comment-bg rounded-2xl p-6">
        <div className="flex flex-col gap-2.5">
          <p className="text-sm text-text-muted font-normal mb-2">
            master comment
          </p>
          <p className="text-base font-bold text-text-primary">
            "{coffee.description}"
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-cta-bg rounded-2xl p-6">
        <div className="flex justify-between items-center gap-2">
          {/* Logo */}
          <M1CTLogo className="text-text-primary" />
          
          {/* Buy Button */}
          <div className="flex items-center gap-2 px-4 py-2 border border-dark-navy rounded-full">
            <span className="text-base font-bold text-text-primary">
              buy whole bean
            </span>
            <ArrowRightIcon size={24} />
          </div>
        </div>
      </section>
    </div>
  );
} 