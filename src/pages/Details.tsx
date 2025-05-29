import { useState, useEffect } from 'react';
import { api, type CoffeeApiData } from '../services/api';

export function Details() {
  const [coffee, setCoffee] = useState<CoffeeApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCoffee = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // URL에서 coffee ID 파라미터 가져오기
        const urlParams = new URLSearchParams(window.location.search);
        const coffeeId = urlParams.get('coffee');
        
        if (coffeeId) {
          // 특정 원두 로드
          const coffeeData = await api.getCoffeeById(coffeeId);
          if (coffeeData && coffeeData.active) {
            setCoffee(coffeeData);
          } else {
            setError('요청하신 원두를 찾을 수 없습니다.');
          }
        } else {
          // 기본값: 첫 번째 활성 원두 로드
          const allCoffees = await api.getAllCoffees();
          if (allCoffees.length > 0) {
            setCoffee(allCoffees[0]);
          } else {
            setError('등록된 원두가 없습니다.');
          }
        }
      } catch (err) {
        console.error('Error loading coffee:', err);
        setError('원두 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadCoffee();
  }, []);

  if (loading) {
    return (
      <div className="bg-white flex-1 flex flex-col items-center justify-center p-6">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (error || !coffee) {
    return (
      <div className="bg-white flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-4">☕</div>
        <h2 className="text-xl font-bold text-text-primary mb-2">원두를 찾을 수 없습니다</h2>
        <p className="text-text-muted mb-4">{error}</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 bg-text-primary text-white rounded-lg hover:bg-text-primary/90"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white flex-1 flex flex-col overflow-y-auto">
      <div className="px-6 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-text-primary">
            {coffee.titleKo}
          </h1>
          <p className="text-text-muted">
            {coffee.titleEn}
          </p>
        </div>

        {/* Detailed Information */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h2 className="text-lg font-semibold text-text-primary border-b pb-2">
              원두 상세 정보
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-text-muted font-medium">나라</span>
                <span className="text-text-primary font-semibold">{coffee.country}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-text-muted font-medium">농장</span>
                <span className="text-text-primary font-semibold">{coffee.farm}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-text-muted font-medium">품종</span>
                <span className="text-text-primary font-semibold">{coffee.variety}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-text-muted font-medium">프로세스</span>
                <span className="text-text-primary font-semibold">{coffee.process}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-text-muted font-medium">지역</span>
                <span className="text-text-primary font-semibold">{coffee.region}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-text-muted font-medium">고도</span>
                <span className="text-text-primary font-semibold">{coffee.altitude}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-text-primary">원두 소개</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-text-primary leading-relaxed">
                {coffee.description}
              </p>
            </div>
          </div>

          {/* Flavor Notes */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-text-primary">맛 노트</h2>
            <div className="flex flex-wrap gap-2">
              {coffee.flavorNotes.map((note: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-badge-bg text-badge-text rounded-full text-sm font-medium"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Price */}
          {coffee.price && (
            <div className="bg-text-primary/5 p-4 rounded-lg text-center">
              <span className="text-sm text-text-muted">가격</span>
              <div className="text-2xl font-bold text-text-primary">
                ₩{coffee.price.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center pt-6 border-t">
          <button
            onClick={() => {
              const urlParams = new URLSearchParams(window.location.search);
              const coffeeId = urlParams.get('coffee');
              window.location.href = coffeeId ? `/?coffee=${coffeeId}` : '/';
            }}
            className="px-6 py-2 bg-text-primary text-white rounded-lg hover:bg-text-primary/90"
          >
            메인으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
} 