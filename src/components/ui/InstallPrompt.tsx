import { useState, useEffect } from 'react';

interface InstallPromptProps {
  onClose: () => void;
}

export function InstallPrompt({ onClose }: InstallPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // iOS 기기 감지
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /ipad|iphone|ipod/.test(userAgent);
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator.standalone);
    
    // 이미 홈 화면에 추가되어 있거나 이전에 닫았으면 표시하지 않음
    const hasBeenClosed = localStorage.getItem('install-prompt-closed');
    const shouldShow = isIOSDevice && !isInStandaloneMode && !hasBeenClosed;
    
    setShowPrompt(shouldShow);
  }, []);

  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem('install-prompt-closed', 'true');
    onClose();
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('URL이 복사되었습니다!');
    } catch (error) {
      // 클립보드 API가 지원되지 않는 경우
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('URL이 복사되었습니다!');
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50 p-4 rounded-t-2xl">
      <div className="max-w-sm mx-auto">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">☕</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">M1CT Coffee</h3>
              <p className="text-sm text-gray-600">홈 화면에 추가</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="bg-blue-50 rounded-xl p-4 mb-4">
          <p className="text-sm text-blue-800 mb-3">
            사파리에서 홈 화면에 추가하면 앱처럼 사용할 수 있어요!
          </p>
          
          <div className="space-y-2 text-xs text-blue-700">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-200 rounded-md flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <span>사파리 하단의 공유 버튼을 탭하세요</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-200 rounded-md flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span>"홈 화면에 추가"를 선택하세요</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-200 rounded-md flex items-center justify-center">
                <span className="text-xs">✓</span>
              </div>
              <span>"추가" 버튼을 눌러주세요</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={copyUrl}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            URL 복사
          </button>
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            알겠어요
          </button>
        </div>
      </div>
    </div>
  );
} 