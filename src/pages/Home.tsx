import { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { M1CTLogo, ArrowRightIcon } from '../components/icons';
import { FlavorNoteModal } from '../components/FlavorNoteModal';
import { api, type CoffeeApiData } from '../services/api';
import * as firebaseApi from '../services/firebaseApi';
import type { FlavorNote } from '../types';

export function Home() {
  const [coffee, setCoffee] = useState<CoffeeApiData | null>(null);
  const [flavorNotes, setFlavorNotes] = useState<FlavorNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFlavorNote, setSelectedFlavorNote] = useState<string>('');

  // 랜덤 아바타 이모지 배열
  const avatarEmojis = ['👨🏻', '👩🏻', '👨🏼', '👩🏼', '👨🏽', '👩🏽', '👨🏾', '👩🏾', '👨🏿', '👩🏿', '🧑🏻', '🧑🏼', '🧑🏽', '🧑🏾', '🧑🏿', '👶🏻', '👶🏼', '👶🏽', '👶🏾', '👶🏿', '🧒🏻', '🧒🏼', '🧒🏽', '🧒🏾', '🧒🏿'];
  const randomAvatar = avatarEmojis[Math.floor(Math.random() * avatarEmojis.length)];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 풍미노트 데이터 로드
        const flavorNotesData = await firebaseApi.getAllFlavorNotes();
        setFlavorNotes(flavorNotesData);

        // URL에서 coffee ID 파라미터 확인
        const urlParams = new URLSearchParams(window.location.search);
        const coffeeId = urlParams.get('coffee');
        
        if (coffeeId) {
          // 특정 원두 로드
          const coffeeData = await api.getCoffeeById(coffeeId);
          if (coffeeData && coffeeData.active) {
            setCoffee(coffeeData);
          } else {
            // 원두를 찾을 수 없으면 첫 번째 활성 원두로 폴백
            const allCoffees = await api.getAllCoffees();
            if (allCoffees.length > 0) {
              setCoffee(allCoffees[0]);
            }
          }
        } else {
          // 기본값: 첫 번째 활성 원두 데이터 로드
          const allCoffees = await api.getAllCoffees();
          if (allCoffees.length > 0) {
            setCoffee(allCoffees[0]);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 풍미노트 이름으로 실제 풍미노트 데이터 찾기
  const getFlavorNoteData = (noteName: string) => {
    const flavorNote = flavorNotes.find(note => note.titleKo === noteName);
    return {
      emoji: flavorNote?.emoji || '☕',
      name: noteName
    };
  };

  // 배지 색상 배열 (대시보드와 동일)
  const badgeColors = [
    'bg-blue-50 text-blue-700',
    'bg-purple-50 text-purple-700',
    'bg-green-50 text-green-700',
    'bg-yellow-50 text-yellow-700',
    'bg-pink-50 text-pink-700',
    'bg-indigo-50 text-indigo-700',
    'bg-red-50 text-red-700',
    'bg-orange-50 text-orange-700'
  ];

  const handleFlavorNoteClick = (flavorNote: string) => {
    setSelectedFlavorNote(flavorNote);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFlavorNote('');
  };

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
    <>
      <div className="flex flex-col gap-1 min-h-screen">
        {/* Title Section - Sticky with lower z-index */}
        <section className={`sticky top-0 z-1 bg-white rounded-b-2xl px-6 py-10 flex flex-col gap-2 flex-1 justify-center transition-shadow duration-300`}>
          <div className="mb-auto">
            <h1 className="text-4xl font-bold text-text-primary leading-tight tracking-tight break-keep word-break-keep">
              {coffee.titleKo}
            </h1>
            <p className="text-base font-light text-text-primary mt-2 tracking-tight break-keep word-break-keep">
              {coffee.titleEn}
            </p>
          </div>
          
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-2">
            {coffee.flavorNotes.map((note, index) => {
              const flavorData = getFlavorNoteData(note);
              return (
                <Badge 
                  key={index} 
                  className={`${badgeColors[index % badgeColors.length]} break-keep word-break-keep flex items-center gap-1`}
                  onClick={() => handleFlavorNoteClick(note)}
                >
                  <span className="text-xs">{flavorData.emoji}</span>
                  {flavorData.name}
                </Badge>
              );
            })}
          </div>
        </section>

        {/* Comment Card */}
        <section className="relative z-10 rounded-2xl p-6" style={{ backgroundColor: '#8A9FFF' }}>
          <div className="flex flex-col gap-2">
            {/* Avatar - Emoji Style */}
            <div className="w-8 h-8 flex items-center justify-center text-2xl">
              {randomAvatar}
            </div>
            
            {/* Text Content - Left Aligned */}
            <div className="flex flex-col items-start gap-10">
              <p className="text-sm text-text-muted font-normal break-keep word-break-keep">
                master comment
              </p>
              <p className="text-base font-bold text-text-primary break-keep word-break-keep">
                "{coffee.masterComment}"
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section - Higher z-index */}
        <section className="relative z-10 rounded-2xl p-6" style={{ backgroundColor: '#FFBF8A' }}>
          <div className="flex justify-between items-center gap-2">
            {/* Logo */}
            <M1CTLogo className="text-text-primary" />
            
            {/* Buy Button */}
            <div className="flex items-center gap-2 px-4 py-2 border border-dark-navy rounded-full">
              <span className="text-base font-bold text-text-primary break-keep word-break-keep">
                buy whole bean
              </span>
              <ArrowRightIcon size={24} />
            </div>
          </div>
        </section>
      </div>

      {/* Flavor Note Modal */}
      <FlavorNoteModal 
        isOpen={modalOpen}
        onClose={handleCloseModal}
        flavorNoteName={selectedFlavorNote}
      />
    </>
  );
} 