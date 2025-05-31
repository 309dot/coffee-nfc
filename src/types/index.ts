export interface Badge {
  id: string;
  label: string;
  color?: string;
}

export interface CoffeeProduct {
  id: string;
  name: string;
  origin: string;
  description: string;
  badges: Badge[];
  image?: string;
  price?: number;
}

export interface NavigationItem {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
}

export interface Product {
  id: string;
  category: string;
  titleKo: string;
  titleEn?: string;
  price: number;
  description?: string;
  imageUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// 풍미 노트 데이터베이스 인터페이스
export interface FlavorNote {
  id: string;
  titleKo: string;        // 한글 풍미명 (예: "레몬 껍질")
  titleEn: string;        // 영문 풍미명 (예: "lemon peel")
  emoji: string;          // 애플 스타일 이모지 (예: "🍋")
  imageUrl?: string;      // 관련 이미지 URL
  description: string;    // 한글 상세 설명
  category?: string;      // 풍미 카테고리 (예: "과일", "견과류", "향신료")
  active: boolean;        // 활성 상태
  createdAt: string;
  updatedAt: string;
} 