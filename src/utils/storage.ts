// 로컬 스토리지 유틸리티 함수들

export const storage = {
  // 데이터 저장
  set: <T>(key: string, value: T): void => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  // 데이터 가져오기
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue || null;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue || null;
    }
  },

  // 데이터 삭제
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  // 모든 데이터 삭제
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  // 키 존재 여부 확인
  exists: (key: string): boolean => {
    return localStorage.getItem(key) !== null;
  },
};

// 특정 키들
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  COFFEE_HISTORY: 'coffee_history',
  NFC_DATA: 'nfc_data',
  CART: 'cart',
  FAVORITES: 'favorites',
} as const; 