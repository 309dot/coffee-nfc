# 커피 앱 데이터 구조

## 첫 번째 페이지 (메인 페이지)

### 타이틀 영역
- **원두명 + 나라 (한글)**
  - 예시: `에티오피아 예가체프`
  - 타입: `string`
  - 필드명: `titleKo`

- **원두명 + 나라 (영문)**
  - 예시: `Ethiopia Yirgacheffe`
  - 타입: `string`
  - 필드명: `titleEn`

### Badge 영역
- **맛 노트**
  - 예시: `['플로럴', '시트러스', '초콜릿']`
  - 타입: `string[]`
  - 필드명: `flavorNotes`

### Master Comment 영역
- **사장님 설명**
  - 예시: `이 원두는 에티오피아 고원에서 자란 특별한 맛을 가지고 있습니다...`
  - 타입: `string`
  - 필드명: `masterComment`

---

## 두 번째 페이지 (상세 정보 페이지)

### 타이틀 영역
- **원두명 + 나라 (한글)**
  - 예시: `에티오피아 예가체프`
  - 타입: `string`
  - 필드명: `titleKo`

- **원두명 + 나라 (영문)**
  - 예시: `Ethiopia Yirgacheffe`
  - 타입: `string`
  - 필드명: `titleEn`

### 중간 영역 (상세 정보)
- **나라**
  - 예시: `에티오피아`
  - 타입: `string`
  - 필드명: `country`

- **농장**
  - 예시: `코체레 농장`
  - 타입: `string`
  - 필드명: `farm`

- **품종**
  - 예시: `헤이룸`
  - 타입: `string`
  - 필드명: `variety`

- **프로세스**
  - 예시: `워시드`
  - 타입: `string`
  - 필드명: `process`

- **지역**
  - 예시: `예가체프`
  - 타입: `string`
  - 필드명: `region`

- **고도**
  - 예시: `1,800 ~ 2,000m`
  - 타입: `string`
  - 필드명: `altitude`

### 본문 영역
- **원두 소개**
  - 예시: `에티오피아 예가체프는 커피의 원산지인 에티오피아에서 생산되는 최고급 아라비카 원두입니다. 높은 고도에서 자란 이 원두는...`
  - 타입: `string`
  - 필드명: `description`

---

## TypeScript 인터페이스 예시

```typescript
interface CoffeeData {
  // 공통 타이틀
  titleKo: string;
  titleEn: string;
  
  // 첫 번째 페이지
  flavorNotes: string[];
  masterComment: string;
  
  // 두 번째 페이지
  country: string;
  farm: string;
  variety: string;
  process: string;
  region: string;
  altitude: string;
  description: string;
}
```

## 샘플 데이터

```typescript
const sampleCoffeeData: CoffeeData = {
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
``` 