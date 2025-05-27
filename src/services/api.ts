// Mock API 서비스

export interface CoffeeData {
  id: string;
  name: string;
  origin: string;
  description: string;
  badges: string[];
  price: number;
  roastLevel: 'light' | 'medium' | 'dark';
  processingMethod: string;
  altitude: string;
  farmer: string;
  harvestDate: string;
  tastingNotes: string[];
  image?: string;
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

// Mock 데이터
const mockCoffeeData: CoffeeData[] = [
  {
    id: 'eth-001',
    name: 'Addisu Hulichaye',
    origin: 'Sidamo, Ethiopia',
    description: 'A bright and floral coffee with citrus notes',
    badges: ['lemon peel', 'peach', 'orange', 'butter milk pudding'],
    price: 28000,
    roastLevel: 'light',
    processingMethod: 'Washed',
    altitude: '1,800-2,100m',
    farmer: 'Addisu Hulichaye',
    harvestDate: '2023-12',
    tastingNotes: ['citrus', 'floral', 'bright acidity', 'clean finish'],
  },
  {
    id: 'col-001',
    name: 'Colombian Supremo',
    origin: 'Huila, Colombia',
    description: 'Rich and balanced with chocolate undertones',
    badges: ['chocolate', 'caramel', 'medium roast'],
    price: 22000,
    roastLevel: 'medium',
    processingMethod: 'Washed',
    altitude: '1,500-1,800m',
    farmer: 'Carlos Rodriguez',
    harvestDate: '2023-11',
    tastingNotes: ['chocolate', 'caramel', 'nutty', 'balanced'],
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
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCoffeeData.find(coffee => coffee.id === id) || null;
  },

  // 모든 커피 데이터 가져오기
  getAllCoffees: async (): Promise<CoffeeData[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCoffeeData;
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
    return mockCoffeeData.find(coffee => coffee.id === coffeeId) || null;
  },
}; 