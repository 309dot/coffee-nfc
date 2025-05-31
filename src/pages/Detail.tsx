import { useState, useEffect } from 'react';
import { api, type CoffeeApiData } from '../services/api';

export function Detail() {
  const [coffee, setCoffee] = useState<CoffeeApiData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCoffeeData = async () => {
      setLoading(true);
      try {
        // URL에서 coffee ID 파라미터 확인
        const urlParams = new URLSearchParams(window.location.search);
        const coffeeId = urlParams.get('coffee') || 'eth-001'; // 기본값
        
        const data = await api.getCoffeeById(coffeeId);
        if (data && data.active) {
          setCoffee(data);
        } else {
          // 원두를 찾을 수 없으면 첫 번째 활성 원두로 폴백
          const allCoffees = await api.getAllCoffees();
          if (allCoffees.length > 0) {
            setCoffee(allCoffees[0]);
          }
        }
      } catch (error) {
        console.error('Error loading coffee data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCoffeeData();
    
    // 페이지 진입 시 상단으로 스크롤
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="bg-white flex-1 flex flex-col items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!coffee) {
    return (
      <div className="bg-white flex-1 flex flex-col items-center justify-center p-6">
        <p className="text-text-muted">커피 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white flex-1 flex flex-col overflow-y-auto">
      <div className="px-6 py-12 space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-primary leading-tight break-keep word-break-keep">
            {coffee.titleKo}
          </h1>
          <p className="text-base font-light text-text-primary break-keep word-break-keep">
            {coffee.titleEn}
          </p>
        </div>

        {/* Coffee Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-base text-text-muted break-keep word-break-keep">
              varieties
            </p>
            <p className="text-base font-semibold text-text-primary break-keep word-break-keep">
              {coffee.variety}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-base text-text-muted break-keep word-break-keep">
              process
            </p>
            <p className="text-base font-semibold text-text-primary break-keep word-break-keep">
              {coffee.process}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-base text-text-muted break-keep word-break-keep">
              region
            </p>
            <p className="text-base font-semibold text-text-primary break-keep word-break-keep">
              {coffee.region}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-base text-text-muted break-keep word-break-keep">
              altitude
            </p>
            <p className="text-base font-semibold text-text-primary break-keep word-break-keep">
              {coffee.altitude}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2.5 pb-6">
          <p className="text-base text-text-primary leading-relaxed whitespace-pre-line break-keep word-break-keep">
            {coffee.description}
          </p>
        </div>
      </div>
    </div>
  );
} 