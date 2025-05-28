// Mock API 서비스

export interface CoffeeData {
  id: string;
  name: string;
  origin: string;
  description: string;
  farmer: string;
  altitude: string;
  processingMethod: string;
  roastLevel: string;
  harvestDate: string;
  price: number;
  badges: string[];
  tastingNotes: string[];
  active: boolean;
}

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

// 임시 데이터
const mockCoffeeData: CoffeeData[] = [
  {
    id: 'eth-001',
    name: 'Addisu Hulichaye',
    origin: 'Ethiopia',
    description: '에티오피아 예가체프 지역의 특별한 원두로, 밝고 깔끔한 산미와 꽃향기가 특징입니다.',
    farmer: 'Addisu Hulichaye',
    altitude: '2,100m',
    processingMethod: 'Natural',
    roastLevel: 'Light Medium',
    harvestDate: '2024년 1월',
    price: 28000,
    badges: ['Single Origin', 'Natural Process', 'High Altitude'],
    tastingNotes: ['Floral', 'Citrus', 'Tea-like', 'Bright'],
    active: true,
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
  getCoffeeById: async (id: string): Promise<CoffeeData | null> => {
    // 실제 API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCoffeeData.find(coffee => coffee.id === id) || null;
  },

  // 모든 커피 데이터 가져오기
  getAllCoffees: async (): Promise<CoffeeData[]> => {
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
  getCoffeeByNFC: async (nfcData: string): Promise<CoffeeData | null> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    // NFC 데이터를 파싱하여 커피 ID 추출 (예시)
    const coffeeId = nfcData.includes('eth') ? 'eth-001' : 'col-001';
    return api.getCoffeeById(coffeeId);
  },
}; 