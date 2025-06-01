import * as firebaseApi from '../services/firebaseApi';

const sampleCoffees = [
  {
    titleKo: '에티오피아 예가체프 G1',
    titleEn: 'Ethiopia Yirgacheffe G1',
    flavorNotes: ['플로럴', '시트러스', '베리'],
    masterComment: '밝고 화사한 산미와 꽃향기가 어우러진 에티오피아의 대표 원두입니다.',
    country: '에티오피아',
    farm: '코케 워시드 스테이션',
    variety: '헤이룸',
    process: '워시드',
    region: '예가체프',
    altitude: '1,800m',
    description: '에티오피아 예가체프 지역의 고지대에서 재배된 프리미엄 원두로, 밝은 산미와 복합적인 풍미가 특징입니다.',
    price: 18000,
    active: true
  },
  {
    titleKo: '콜롬비아 수프레모',
    titleEn: 'Colombia Supremo',
    flavorNotes: ['초콜릿', '카라멜', '견과류'],
    masterComment: '균형 잡힌 바디감과 부드러운 단맛이 인상적인 콜롬비아의 클래식한 맛입니다.',
    country: '콜롬비아',
    farm: '라 에스페란자 농장',
    variety: '카투라',
    process: '워시드',
    region: '우일라',
    altitude: '1,600m',
    description: '콜롬비아 안데스 산맥의 고지대에서 자란 수프레모 등급의 원두로, 풍부한 바디와 깔끔한 후미가 특징입니다.',
    price: 16000,
    active: true
  },
  {
    titleKo: '브라질 세하도 미나스',
    titleEn: 'Brazil Cerrado Mineiro',
    flavorNotes: ['넛', '다크초콜릿', '카라멜'],
    masterComment: '진한 바디감과 깊은 풍미를 가진 브라질 스페셜티 커피의 대표작입니다.',
    country: '브라질',
    farm: '파젠다 바우',
    variety: '문도노보',
    process: '내추럴',
    region: '세하도 미나스',
    altitude: '1,200m',
    description: '브라질 미나스제라이스 주의 세하도 지역에서 내추럴 가공 방식으로 처리된 원두로, 진한 바디와 단맛이 특징입니다.',
    price: 14000,
    active: true
  },
  {
    titleKo: '과테말라 안티구아',
    titleEn: 'Guatemala Antigua',
    flavorNotes: ['스파이시', '훈제', '다크초콜릿'],
    masterComment: '화산재 토양에서 자란 특별한 풍미를 가진 과테말라의 명품 커피입니다.',
    country: '과테말라',
    farm: '엘 인헤르토 농장',
    variety: '부르봉',
    process: '워시드',
    region: '안티구아',
    altitude: '1,500m',
    description: '과테말라 안티구아 화산 지역의 비옥한 토양에서 자란 원두로, 스모키한 풍미와 진한 바디감이 특징입니다.',
    price: 17000,
    active: true
  }
];

export const addSampleCoffees = async () => {
  try {
    console.log('샘플 커피 추가 시작...');
    
    for (const coffee of sampleCoffees) {
      try {
        const newCoffee = await firebaseApi.createCoffee(coffee);
        console.log(`추가 완료: ${coffee.titleKo} (ID: ${newCoffee.id})`);
      } catch (error) {
        console.error(`${coffee.titleKo} 추가 실패:`, error);
      }
    }
    
    console.log('모든 샘플 커피 추가 완료!');
    return true;
  } catch (error) {
    console.error('샘플 커피 추가 중 오류:', error);
    return false;
  }
};

// 개발 환경에서만 실행 가능하도록 설정
if (import.meta.env.DEV) {
  // @ts-ignore - 개발 도구용
  window.addSampleCoffees = addSampleCoffees;
} 