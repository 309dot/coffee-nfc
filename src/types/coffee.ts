/**
 * 커피 앱 데이터 타입 정의
 */

export interface CoffeeData {
  // 공통 타이틀 영역
  /** 원두명 + 나라 (한글) */
  titleKo: string;
  /** 원두명 + 나라 (영문) */
  titleEn: string;
  
  // 첫 번째 페이지 데이터
  /** 맛 노트 배지들 */
  flavorNotes: string[];
  /** 사장님 설명 */
  masterComment: string;
  
  // 두 번째 페이지 데이터
  /** 나라 */
  country: string;
  /** 농장 */
  farm: string;
  /** 품종 */
  variety: string;
  /** 프로세스 */
  process: string;
  /** 지역 */
  region: string;
  /** 고도 */
  altitude: string;
  /** 원두 소개 */
  description: string;
}

/**
 * 샘플 커피 데이터
 */
export const sampleCoffeeData: CoffeeData = {
  titleKo: "에티오피아 예가체프",
  titleEn: "Ethiopia Yirgacheffe",
  flavorNotes: ["플로럴", "시트러스", "초콜릿"],
  masterComment: "이 원두는 에티오피아 고원에서 자란 특별한 맛을 가지고 있습니다. 플로럴한 향과 밝은 산미가 특징입니다.",
  country: "에티오피아",
  farm: "코체레 농장",
  variety: "헤이룸",
  process: "워시드",
  region: "예가체프",
  altitude: "1,800 ~ 2,000m",
  description: "에티오피아 예가체프는 커피의 원산지인 에티오피아에서 생산되는 최고급 아라비카 원두입니다. 높은 고도에서 자란 이 원두는 독특한 플로럴 향과 밝은 산미를 자랑합니다."
}; 