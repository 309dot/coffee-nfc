# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
# 최종 연동 완료
# flavorNotes와 story 필드 완전 구현

# Coffee NFC App

NFC 코스터를 활용한 커피 정보 제공 및 관리 시스템입니다.

## 🚀 주요 기능

### 고객용 기능
- **커피 상세 정보**: NFC 태그를 통해 커피 정보 즉시 확인
- **아름다운 UI**: 모바일 최적화된 직관적인 인터페이스
- **실시간 데이터**: 구글 시트와 연동된 최신 커피 정보

### 관리자 기능 (Menu > NFC 관리)
- **📊 구글 시트 동기화**: 커피 데이터를 구글 시트에서 실시간 동기화
- **☕ 원두 관리**: 등록된 커피 원두 목록 관리 및 활성화/비활성화
- **🔗 URL 관리**: 커피별 고유 URL 생성 및 QR 코드 제공
- **📈 분석 대시보드**: 조회수, 인기 커피, 디바이스별 통계 제공

## 🛠 기술 스택

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: CSS Variables, Tailwind-like utilities
- **State Management**: Zustand
- **Data Source**: Google Sheets API
- **Analytics**: Custom analytics service
- **Storage**: LocalStorage

## 📋 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd coffee-coaster-app
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경변수 설정
```bash
cp .env.example .env
```

`.env` 파일에서 다음 값들을 설정하세요:
```env
REACT_APP_GOOGLE_SHEETS_API_KEY=your_api_key_here
REACT_APP_GOOGLE_SHEET_ID=your_sheet_id_here
REACT_APP_BASE_URL=http://localhost:3000
```

### 4. 개발 서버 실행
```bash
npm run dev
```

## 📊 구글 시트 설정

### 필요한 컬럼 구조
| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ID | Name | Origin | Description | Farmer | Altitude | Processing | Roast | Harvest | Price | Badges | Tasting | Active | Created | Reserved |

### 예시 데이터
```
eth-001 | Addisu Hulichaye | Sidamo, Ethiopia | 에티오피아 시다모... | Addisu Hulichaye | 1,800-2,000m | Natural | Medium | 2024년 1월 | 25000 | Single Origin,Natural Process | Blueberry,Chocolate,Wine | TRUE | 2024-01-01 |
```

### API 키 발급
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. Google Sheets API 활성화
4. API 키 생성 (제한 설정 권장)

## 🎯 사용 방법

### 고객 사용
1. NFC 코스터를 스마트폰으로 태그
2. 자동으로 해당 커피 정보 페이지 열림
3. 커피 상세 정보, 테이스팅 노트 등 확인

### 관리자 사용
1. 앱 실행 후 Menu 탭 이동
2. "NFC 관리" 탭 선택
3. 각 관리 기능 활용:
   - **구글 시트 동기화**: 최신 데이터 가져오기
   - **원두 관리**: 커피 목록 확인 및 상태 관리
   - **URL 관리**: 새 커피 URL 생성 및 QR 코드 다운로드
   - **분석 대시보드**: 사용 통계 및 인기 커피 확인

## 📱 주요 화면

### 홈 화면
- 등록된 모든 커피 목록
- 각 커피별 기본 정보 및 링크

### 커피 상세 화면
- 커피 이름, 원산지, 농장주 정보
- 가공 방식, 로스팅 레벨, 수확 시기
- 테이스팅 노트 및 특징 배지
- 장바구니 추가 및 즐겨찾기 기능

### 관리 화면
- 탭 기반 인터페이스로 일반 메뉴와 NFC 관리 분리
- 각 관리 기능별 독립적인 컴포넌트
- 실시간 데이터 동기화 및 상태 표시

## 🔧 개발 정보

### 프로젝트 구조
```
src/
├── components/
│   ├── admin/          # 관리자 컴포넌트
│   ├── icons/          # 아이콘 컴포넌트
│   └── ui/             # UI 컴포넌트
├── pages/              # 페이지 컴포넌트
├── services/           # API 및 비즈니스 로직
├── store/              # 상태 관리
└── styles/             # 스타일 파일
```

### 주요 서비스
- **googleSheetsService**: 구글 시트 API 연동
- **urlGeneratorService**: URL 생성 및 관리
- **analyticsService**: 사용자 행동 분석
- **api**: 커피 데이터 API

## 🚀 배포

### Vercel 배포
```bash
npm run build
vercel --prod
```

### 환경변수 설정
Vercel 대시보드에서 다음 환경변수 설정:
- `REACT_APP_GOOGLE_SHEETS_API_KEY`
- `REACT_APP_GOOGLE_SHEET_ID`
- `REACT_APP_BASE_URL`

## 📈 분석 기능

### 추적 데이터
- 페이지 조회수
- 고유 방문자 수
- 인기 커피 순위
- 일별 통계
- 디바이스별 접속 현황

### 데이터 저장
- LocalStorage 기반 클라이언트 저장
- 세션 기반 방문자 구분
- 30일 데이터 보관

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 생성해 주세요.
