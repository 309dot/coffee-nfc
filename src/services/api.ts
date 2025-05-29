import { firebaseApi, initializeData } from './firebaseApi';

// 기존 인터페이스들은 유지
export interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'cupping' | 'workshop' | 'tasting';
  available: boolean;
  maxParticipants: number;
  currentParticipants: number;
}

export interface CoffeeData {
  titleKo: string;
  titleEn: string;
  flavorNotes: string[];
  masterComment: string;
  country: string;
  farm: string;
  variety: string;
  process: string;
  region: string;
  altitude: string;
  description: string;
}

export interface CoffeeApiData extends CoffeeData {
  id: string;
  active: boolean;
  price?: number;
}

// 앱 시작시 초기화
const initializeApp = async () => {
  try {
    await initializeData();
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
};

// 앱 시작시 자동 초기화
initializeApp();

// Firebase API를 기존 API로 export
export const api = firebaseApi; 