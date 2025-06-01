import { useState, useEffect, useRef } from 'react';
import { firebaseApi } from '../services/firebaseApi';
import type { FlavorNote } from '../types';

interface FlavorNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  flavorNoteName: string;
}

export function FlavorNoteModal({ isOpen, onClose, flavorNoteName }: FlavorNoteModalProps) {
  const [flavorNote, setFlavorNote] = useState<FlavorNote | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    if (isOpen && flavorNoteName) {
      setIsVisible(true);
      loadFlavorNote();
    } else {
      setIsVisible(false);
    }
  }, [isOpen, flavorNoteName]);

  const loadFlavorNote = async () => {
    setLoading(true);
    try {
      const note = await firebaseApi.findFlavorNoteByName(flavorNoteName);
      setFlavorNote(note);
    } catch (error) {
      console.error('Error loading flavor note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startY.current = e.touches[0].clientY;
    currentY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    currentY.current = e.touches[0].clientY;
    const deltaY = Math.max(0, currentY.current - startY.current);
    setDragOffset(deltaY);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // 50% 이상 드래그하면 닫기
    if (dragOffset > 150) {
      handleClose();
    } else {
      setDragOffset(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startY.current = e.clientY;
    currentY.current = e.clientY;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    currentY.current = e.clientY;
    const deltaY = Math.max(0, currentY.current - startY.current);
    setDragOffset(deltaY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // 50% 이상 드래그하면 닫기
    if (dragOffset > 150) {
      handleClose();
    } else {
      setDragOffset(0);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setDragOffset(0);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 백드롭 */}
      <div 
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* 모달 컨테이너 */}
      <div 
        ref={modalRef}
        className={`fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          transform: `translateY(${isDragging ? dragOffset : isVisible ? 0 : '100%'}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        <div className="bg-white rounded-t-3xl shadow-2xl max-h-[80vh] flex flex-col">
          {/* 드래그 핸들 */}
          <div 
            className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
          >
            <div className={`w-10 h-1 bg-gray-300 rounded-full transition-colors ${
              isDragging ? 'bg-gray-400' : 'bg-gray-300'
            }`} />
          </div>
          
          {/* 헤더 */}
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">풍미 노트</h2>
            <button
              onClick={handleClose}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M18 6L6 18M6 6l12 12" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* 컨텐츠 */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-pulse text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
                </div>
              </div>
            ) : flavorNote ? (
              <div className="space-y-6">
                {/* 메인 정보 */}
                <div className="text-center">
                  <div className="text-6xl mb-4">{flavorNote.emoji}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {flavorNote.titleKo}
                  </h3>
                  <p className="text-lg text-gray-600 mb-1">
                    {flavorNote.titleEn}
                  </p>
                  {flavorNote.category && (
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {flavorNote.category}
                    </span>
                  )}
                </div>

                {/* 이미지 (있는 경우) */}
                {flavorNote.imageUrl && (
                  <div className="rounded-2xl overflow-hidden">
                    <img
                      src={flavorNote.imageUrl}
                      alt={flavorNote.titleKo}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* 설명 */}
                {flavorNote.description && (
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">설명</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {flavorNote.description}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="text-6xl mb-4">🤔</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  풍미 노트를 찾을 수 없습니다
                </h3>
                <p className="text-gray-600">
                  "{flavorNoteName}" 정보가 등록되지 않았습니다.
                </p>
              </div>
            )}
          </div>
          
          {/* 하단 여백 (safe area) */}
          <div className="pb-safe-bottom h-6" />
        </div>
      </div>
    </>
  );
} 