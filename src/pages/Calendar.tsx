import { useState, useEffect } from 'react';
import { api, type CoffeeApiData } from '../services/api';

export function Calendar() {
  const [coffee, setCoffee] = useState<CoffeeApiData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 페이지 진입 시 상단으로 스크롤
    window.scrollTo(0, 0);

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
      <div className="bg-white flex-1 flex flex-col overflow-y-auto">
        <div className="px-6 py-12 space-y-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!coffee) {
    return (
      <div className="bg-white flex-1 flex flex-col overflow-y-auto">
        <div className="px-6 py-12 flex justify-center items-center">
          <p className="text-text-muted">커피 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const details = [
    { label: "country", value: coffee.country },
    { label: "farm", value: coffee.farm },
    { label: "variety", value: coffee.variety },
    { label: "process", value: coffee.process },
    { label: "region", value: coffee.region },
    { label: "altitude", value: coffee.altitude }
  ];

  return (
    <div className="bg-white flex-1 flex flex-col overflow-y-auto">
      <div className="px-6 py-12 space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-primary leading-tight">
            {coffee.titleKo}
          </h1>
          <p className="text-base font-light text-text-primary">
            {coffee.titleEn}
          </p>
        </div>

        {/* Coffee Details */}
        <div className="grid grid-cols-2 gap-4">
          {details.map((detail, index) => (
            <div key={index} className="space-y-1">
              <p className="text-base text-text-muted">
                {detail.label}
              </p>
              <p className="text-base font-semibold text-text-primary">
                {detail.value}
              </p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="space-y-2.5 pb-6">
          <p className="text-base text-text-primary leading-relaxed whitespace-pre-line">
            {coffee.description}
          </p>
        </div>
      </div>
    </div>
  );
} 