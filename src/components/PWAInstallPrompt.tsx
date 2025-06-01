import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // iOS 감지
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // 이미 PWA로 설치되어 있는지 확인
    const isInStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone ||
                          document.referrer.includes('android-app://');
    setIsStandalone(isInStandalone);

    // 설치 프롬프트 이벤트 리스너
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('사용자가 PWA 설치를 수락했습니다.');
      } else {
        console.log('사용자가 PWA 설치를 거부했습니다.');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // 이미 설치되어 있거나 이전에 거부한 경우 표시하지 않음
  if (isStandalone || localStorage.getItem('pwa-prompt-dismissed') === 'true') {
    return null;
  }

  return (
    <>
      {/* 일반 브라우저용 설치 프롬프트 */}
      {showPrompt && deferredPrompt && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-white rounded-lg shadow-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/favicon.svg" alt="M1CT Coffee" className="w-8 h-8" />
              <div>
                <h3 className="font-semibold text-gray-900">M1CT Coffee 설치</h3>
                <p className="text-sm text-gray-600">홈 화면에 추가하여 더 빠르게 접근하세요</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleDismiss}
                className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
              >
                닫기
              </button>
              <button
                onClick={handleInstallClick}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                설치
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Safari용 안내 */}
      {isIOS && !isStandalone && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-blue-50 rounded-lg border border-blue-200 p-4">
          <div className="flex items-start space-x-3">
            <div className="text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">홈 화면에 추가하기</h3>
              <p className="text-sm text-blue-800 mt-1">
                Safari 하단의 <span className="inline-flex items-center mx-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </span> 버튼을 누른 후 "홈 화면에 추가"를 선택하세요.
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-blue-600 hover:text-blue-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAInstallPrompt; 