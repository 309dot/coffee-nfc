// PWA 설치 상태 확인
export const isPWAInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone ||
         document.referrer.includes('android-app://');
};

// iOS 감지
export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Android 감지
export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

// PWA 설치 가능 여부 확인
export const canInstallPWA = (): boolean => {
  return !isPWAInstalled() && ('serviceWorker' in navigator);
};

// 현재 URL 기반 manifest 동적 생성
export const updateManifestStartUrl = (url?: string): void => {
  const currentUrl = url || window.location.href;
  const manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
  
  if (manifestLink) {
    // 동적으로 manifest blob URL 생성
    fetch('/manifest.json')
      .then(response => response.json())
      .then(manifest => {
        // 현재 URL로 start_url 업데이트
        const updatedManifest = {
          ...manifest,
          start_url: currentUrl
        };
        
        // Blob URL 생성
        const manifestBlob = new Blob([JSON.stringify(updatedManifest, null, 2)], {
          type: 'application/json'
        });
        const manifestUrl = URL.createObjectURL(manifestBlob);
        
        // manifest link 업데이트
        manifestLink.href = manifestUrl;
        
        console.log('Manifest updated with start_url:', currentUrl);
      })
      .catch(error => {
        console.error('Failed to update manifest:', error);
      });
  }
};

// PWA 설치 프롬프트 관리
export class PWAInstallManager {
  private deferredPrompt: any = null;
  private installPromptShown = false;

  constructor() {
    window.addEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt.bind(this));
    window.addEventListener('appinstalled', this.handleAppInstalled.bind(this));
  }

  private handleBeforeInstallPrompt(e: Event): void {
    e.preventDefault();
    this.deferredPrompt = e;
    this.showInstallPrompt();
  }

  private handleAppInstalled(): void {
    this.deferredPrompt = null;
    this.installPromptShown = false;
    console.log('PWA가 성공적으로 설치되었습니다!');
  }

  private showInstallPrompt(): void {
    if (!this.installPromptShown) {
      this.installPromptShown = true;
      // 커스텀 설치 프롬프트 표시 이벤트 발생
      window.dispatchEvent(new CustomEvent('pwa-install-available', {
        detail: { canInstall: true }
      }));
    }
  }

  public async install(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('사용자가 PWA 설치를 승인했습니다.');
        return true;
      } else {
        console.log('사용자가 PWA 설치를 거부했습니다.');
        return false;
      }
    } catch (error) {
      console.error('PWA 설치 중 오류 발생:', error);
      return false;
    } finally {
      this.deferredPrompt = null;
    }
  }

  public canInstall(): boolean {
    return this.deferredPrompt !== null;
  }
}

// URL 파라미터 기반 앱 상태 복원
export const restoreAppState = (): void => {
  const urlParams = new URLSearchParams(window.location.search);
  const source = urlParams.get('source');
  
  if (source === 'pwa') {
    console.log('PWA에서 실행됨');
    
    // PWA에서 실행될 때 추가 설정
    if (isPWAInstalled()) {
      // 풀스크린 모드 요청 (지원되는 경우)
      if (document.documentElement.requestFullscreen) {
        document.addEventListener('click', () => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(console.log);
          }
        }, { once: true });
      }
    }
  }
};

// 스플래시 스크린 관리
export const hideSplashScreen = (): void => {
  // PWA 스플래시 스크린이 끝난 후 호출
  setTimeout(() => {
    const splashElement = document.getElementById('splash-screen');
    if (splashElement) {
      splashElement.style.display = 'none';
    }
  }, 1000);
}; 