import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (isOpen && flavorNoteName) {
      loadFlavorNote();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/55 backdrop-blur-sm p-6">
      <div className="bg-white rounded-2xl w-full max-w-sm h-[620px] flex flex-col overflow-hidden shadow-2xl">
        {/* Top Section with Image and Close Button */}
        <div className="relative flex-shrink-0">
          {/* Background Image */}
          <div 
            className="w-full h-[281px] bg-gray-200 rounded-t-2xl relative"
            style={{
              backgroundImage: flavorNote?.imageUrl ? `url(${flavorNote.imageUrl})` : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-6 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M18 6L6 18M6 6l12 12" 
                  stroke="rgba(15, 19, 36, 0.6)" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Container - 고정 높이와 스크롤 처리 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          ) : flavorNote ? (
            <div className="space-y-2">
              {/* Category */}
              <p 
                className="text-sm font-normal leading-relaxed break-keep word-break-keep"
                style={{
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  lineHeight: '1.4285714285714286em',
                  letterSpacing: '-0.7142857249294009%',
                  color: 'rgba(13, 17, 38, 0.4)'
                }}
              >
                taste note
              </p>

              {/* Emoji */}
              <h2 
                className="font-bold break-keep word-break-keep"
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  fontSize: '24px',
                  lineHeight: '1.3333333333333333em',
                  letterSpacing: '-1.2500000496705375%',
                  color: '#14151A'
                }}
              >
                {flavorNote.emoji}
              </h2>

              {/* Title */}
              <h3 
                className="font-bold break-keep word-break-keep"
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  fontSize: '24px',
                  lineHeight: '1.3333333333333333em',
                  letterSpacing: '-1.2500000496705375%',
                  color: '#14151A'
                }}
              >
                {flavorNote.titleEn}
              </h3>

              {/* Description */}
              <p 
                className="font-normal leading-relaxed break-keep word-break-keep"
                style={{
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  lineHeight: '1.4285714285714286em',
                  letterSpacing: '-0.7142857249294009%',
                  color: '#14151A'
                }}
              >
                {flavorNote.description}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="text-4xl mb-4">🤔</div>
              <p className="text-lg font-semibold text-text-primary break-keep word-break-keep">
                풍미 노트를 찾을 수 없습니다
              </p>
              <p className="text-sm text-text-muted mt-2 break-keep word-break-keep">
                "{flavorNoteName}" 정보가 등록되지 않았습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 