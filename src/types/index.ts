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