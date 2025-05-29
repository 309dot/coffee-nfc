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

// 임시 데이터 - 여러 원두 추가
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
  {
    id: 'col-001',
    titleKo: '콜롬비아 후일라',
    titleEn: 'Colombia Huila',
    flavorNotes: ['초콜릿', '캐러멜', '견과류', '균형잡힌'],
    masterComment: '콜롬비아 후일라 지역의 고품질 아라비카 원두입니다. 풍부한 바디감과 달콤한 초콜릿 향이 특징이며, 균형 잡힌 맛으로 많은 사랑을 받고 있습니다.',
    country: '콜롬비아',
    farm: '라 에스페란자 농장',
    variety: '카투라, 카스티요',
    process: '워시드',
    region: '후일라',
    altitude: '1,600 ~ 1,900m',
    description: '콜롬비아 후일라는 안데스 산맥의 비옥한 화산토에서 재배되는 프리미엄 커피입니다. 전통적인 습식가공을 통해 깔끔하고 밝은 산미를 유지하면서도 풍부한 바디감과 달콤함을 자랑합니다.',
    active: true,
    price: 26000,
  },
  {
    id: 'gua-001',
    titleKo: '과테말라 안티구아',
    titleEn: 'Guatemala Antigua',
    flavorNotes: ['스모키', '스파이시', '다크초콜릿', '풀바디'],
    masterComment: '과테말라 안티구아의 화산토에서 자란 독특한 스모키 풍미의 원두입니다. 진한 바디감과 복잡한 향미가 에스프레소에 특히 적합합니다.',
    country: '과테말라',
    farm: '엘 펄카르 농장',
    variety: '부르본, 카투라',
    process: '풀워시드',
    region: '안티구아',
    altitude: '1,500 ~ 1,700m',
    description: '과테말라 안티구아는 세계적으로 유명한 커피 산지 중 하나입니다. 활화산 지대의 미네랄이 풍부한 토양에서 자란 이 원두는 독특한 스모키 향과 진한 바디감, 복잡한 풍미를 자랑합니다.',
    active: true,
    price: 32000,
  }
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

// ID 생성 헬퍼 함수
const generateCoffeeId = (titleEn: string): string => {
  const prefix = titleEn.toLowerCase()
    .split(' ')[0]
    .substring(0, 3);
  const timestamp = Date.now().toString().slice(-3);
  return `${prefix}-${timestamp}`;
};

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

  // 관리용: 비활성 포함 모든 커피 가져오기
  getAllCoffeesAdmin: async (): Promise<CoffeeApiData[]> => {
    // 실제 API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...mockCoffeeData];
  },

  // 새 커피 생성
  createCoffee: async (coffeeData: Omit<CoffeeApiData, 'id'>): Promise<CoffeeApiData> => {
    // 실제 API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const newCoffee: CoffeeApiData = {
      ...coffeeData,
      id: generateCoffeeId(coffeeData.titleEn),
    };
    
    mockCoffeeData.push(newCoffee);
    return newCoffee;
  },

  // 커피 데이터 업데이트
  updateCoffee: async (id: string, updateData: Partial<CoffeeApiData>): Promise<CoffeeApiData | null> => {
    // 실제 API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const coffeeIndex = mockCoffeeData.findIndex(coffee => coffee.id === id);
    if (coffeeIndex === -1) {
      return null;
    }
    
    // 데이터 업데이트
    mockCoffeeData[coffeeIndex] = {
      ...mockCoffeeData[coffeeIndex],
      ...updateData,
      id, // ID는 변경되지 않도록 보장
    };
    
    return mockCoffeeData[coffeeIndex];
  },

  // 커피 삭제 (소프트 삭제 - active: false)
  deleteCoffee: async (id: string): Promise<boolean> => {
    // 실제 API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const coffeeIndex = mockCoffeeData.findIndex(coffee => coffee.id === id);
    if (coffeeIndex === -1) {
      return false;
    }
    
    // 소프트 삭제
    mockCoffeeData[coffeeIndex].active = false;
    return true;
  },

  // 커피 활성화
  activateCoffee: async (id: string): Promise<boolean> => {
    // 실제 API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const coffeeIndex = mockCoffeeData.findIndex(coffee => coffee.id === id);
    if (coffeeIndex === -1) {
      return false;
    }
    
    mockCoffeeData[coffeeIndex].active = true;
    return true;
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
    const coffeeId = nfcData.includes('eth') ? 'eth-001' : 
                     nfcData.includes('col') ? 'col-001' : 
                     nfcData.includes('gua') ? 'gua-001' : 'eth-001';
    return api.getCoffeeById(coffeeId);
  },
}; 