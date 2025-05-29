// Mock API 서비스
import type { CoffeeData } from '../types/coffee';

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

// 확장된 CoffeeData (API 전용)
export interface CoffeeApiData extends CoffeeData {
  id: string;
  active: boolean;
  price?: number;
}

// 임시 데이터
const mockCoffeeData: CoffeeApiData[] = [
  {
    id: 'eth-001',
    titleKo: '에티오피아 예가체프',
    titleEn: 'Ethiopia Yirgacheffe',
    flavorNotes: ['플로럴', '시트러스', '차같은', '밝은'],
    masterComment: '에티오피아 예가체프 지역의 특별한 원두로, 밝고 깔끔한 산미와 꽃향기가 특징입니다. 자연건조 방식으로 가공되어 과일 같은 단맛이 느껴집니다.',
    country: '에티오피아',
    farm: '고롤차 농장',
    variety: '헤이룸, 쿠루메, 웰리초',
    process: '내추럴',
    region: '시다모, 예가체프',
    altitude: '2,100m',
    description: '에티오피아 예가체프는 커피의 원산지인 에티오피아에서 생산되는 최고급 아라비카 원두입니다. 높은 고도에서 자란 이 원두는 독특한 플로럴 향과 밝은 산미를 자랑하며, 자연건조 방식으로 가공되어 과일 같은 단맛과 복합적인 풍미를 선사합니다.',
    active: true,
    price: 28000,
  },
];

const mockEvents: EventData[] = [
  {
    id: 'event-001',
    title: 'Ethiopian Coffee Cupping',
    description: 'Taste and learn about Ethiopian coffee varieties',
    date: '2024-01-15',
    time: '14:00',
    type: 'cupping',
    available: true,
    maxParticipants: 8,
    currentParticipants: 3,
  },
  {
    id: 'event-002',
    title: 'Latte Art Workshop',
    description: 'Learn basic latte art techniques',
    date: '2024-01-18',
    time: '16:00',
    type: 'workshop',
    available: true,
    maxParticipants: 6,
    currentParticipants: 2,
  },
];

// API 함수들
export const api = {
  // 커피 데이터 가져오기
  getCoffeeById: async (id: string): Promise<CoffeeApiData | null> => {
    // 실제 API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCoffeeData.find(coffee => coffee.id === id) || null;
  },

  // 모든 커피 데이터 가져오기
  getAllCoffees: async (): Promise<CoffeeApiData[]> => {
    // 실제 API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCoffeeData.filter(coffee => coffee.active);
  },

  // 이벤트 데이터 가져오기
  getEvents: async (): Promise<EventData[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockEvents;
  },

  // 이벤트 예약
  bookEvent: async (eventId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const event = mockEvents.find(e => e.id === eventId);
    if (event && event.available && event.currentParticipants < event.maxParticipants) {
      event.currentParticipants += 1;
      return true;
    }
    return false;
  },

  // NFC 데이터로 커피 정보 가져오기
  getCoffeeByNFC: async (nfcData: string): Promise<CoffeeApiData | null> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    // NFC 데이터를 파싱하여 커피 ID 추출 (예시)
    const coffeeId = nfcData.includes('eth') ? 'eth-001' : 'col-001';
    return api.getCoffeeById(coffeeId);
  },
}; 