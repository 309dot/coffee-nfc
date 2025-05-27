import { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { NFCReader } from '../components/ui/NFCReader';
import { ArrowRightIcon } from '../components/icons';
import { api } from '../services/api';
import { useAppStore } from '../store/useAppStore';

export function Home() {
  const [nfcCoffeeData, setNfcCoffeeData] = useState<any>(null);
  const [loadingNFC, setLoadingNFC] = useState(false);
  const { } = useAppStore();

  const badges = [
    { id: '1', label: 'lemon peel' },
    { id: '2', label: 'peach' },
    { id: '3', label: 'orange' },
    { id: '4', label: 'butter milk pudding' },
  ];

  const handleNFCRead = async (data: string) => {
    console.log('NFC Data:', data);
    setLoadingNFC(true);
    
    try {
      // NFC 데이터로 커피 정보 가져오기
      const coffeeData = await api.getCoffeeByNFC(data);
      if (coffeeData) {
        setNfcCoffeeData(coffeeData);
        alert(`${coffeeData.name} 정보를 불러왔습니다!`);
      } else {
        alert('해당 NFC 태그에 대한 커피 정보를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('Error processing NFC data:', error);
      alert('NFC 데이터 처리 중 오류가 발생했습니다.');
    } finally {
      setLoadingNFC(false);
    }
  };

  const handleViewDetails = () => {
    // 상세 페이지로 이동 (실제로는 라우터 사용)
    alert('상세 페이지로 이동합니다. (라우터 구현 필요)');
  };

  return (
    <div className="flex flex-col gap-1 pt-16 pb-20">
      {/* Title Section */}
      <section className="bg-white rounded-b-4 px-6 py-6 flex-1 flex flex-col justify-between gap-2">
        <div className="mb-2">
          <h1 className="text-4xl font-bold text-text-primary leading-tight tracking-tight">
            {nfcCoffeeData ? nfcCoffeeData.name : 'Addisu Hulichaye, Ethiopia'}
          </h1>
          <p className="text-base font-light text-text-primary mt-2 tracking-tight">
            {nfcCoffeeData ? nfcCoffeeData.origin : 'Addisu Hulichaye, Ethiopia'}
          </p>
        </div>
        
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-2">
          {(nfcCoffeeData ? nfcCoffeeData.badges : badges.map(b => b.label)).map((badge: string, index: number) => (
            <Badge key={index}>
              {badge}
            </Badge>
          ))}
        </div>
      </section>

      {/* Comment Card */}
      <section className="bg-comment-bg rounded-4 px-6 py-6">
        <div className="flex gap-2">
          <div className="flex flex-col justify-center items-center gap-2.5 flex-1">
          <p className="text-sm text-text-muted font-normal mb-2">
            {nfcCoffeeData ? 'NFC 스캔 결과' : 'master comment'}
          </p>
          <p className="text-base font-bold text-text-primary">
            {nfcCoffeeData 
              ? nfcCoffeeData.description
              : '"Addisu is a member of the Lalisaa Project, an initiative that aims to provide opportunity and resources for smallholder farmers in Sidamo."'
            }
          </p>
          </div>
        </div>
      </section>

      {/* NFC Reader Section */}
      <section className="mx-6 mt-4">
        {loadingNFC ? (
          <div className="bg-cta-bg rounded-2xl p-4 text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center mb-3">
                ⏳
              </div>
              <p className="text-text-primary text-sm">
                커피 정보를 불러오는 중...
              </p>
            </div>
          </div>
        ) : (
          <NFCReader onNFCRead={handleNFCRead} />
        )}
      </section>

      {/* NFC Result Section */}
      {nfcCoffeeData && (
        <section className="mx-6 mt-4">
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-text-primary">
                  스캔된 커피 정보
                </h3>
                <p className="text-text-muted text-sm">
                  ₩{nfcCoffeeData.price.toLocaleString()}
                </p>
              </div>
              <button
                onClick={handleViewDetails}
                className="bg-badge-bg text-badge-text px-4 py-2 rounded-full text-sm font-medium hover:bg-badge-bg/80 transition-colors"
              >
                자세히 보기
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-cta-bg rounded-4 px-6 py-6">
        <div className="flex justify-between items-center gap-2">
          {/* Logo */}
          <div className="text-base font-bold text-text-primary">M1CT</div>
          
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