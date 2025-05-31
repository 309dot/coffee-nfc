import { firebaseApi, initializeData } from './firebaseApi';
import type { Product } from '../types';

// 기존 인터페이스들은 유지
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

export interface CoffeeData {
  titleKo: string;
  titleEn: string;
  flavorNotes: string[];
  masterComment: string;
  country: string;
  farm: string;
  variety: string;
  process: string;
  region: string;
  altitude: string;
  description: string;
  imageUrl?: string;
}

export interface CoffeeApiData extends CoffeeData {
  id: string;
  active: boolean;
  price?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// 앱 시작시 초기화
const initializeApp = async () => {
  try {
    await initializeData();
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
};

// 앱 시작시 자동 초기화
initializeApp();

// Firebase API를 기존 API로 export
export const api = firebaseApi;

// Product API functions
export const productApi = {
  // Get all products
  getAllProducts: async (): Promise<Product[]> => {
    const data = localStorage.getItem('shop_products');
    if (!data) return [];
    
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error parsing products from localStorage:', error);
      return [];
    }
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product | null> => {
    const products = await productApi.getAllProducts();
    return products.find(product => product.id === id) || null;
  },

  // Create new product
  createProduct: async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const products = await productApi.getAllProducts();
    const newProduct: Product = {
      ...productData,
      id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    localStorage.setItem('shop_products', JSON.stringify(products));
    return newProduct;
  },

  // Update product
  updateProduct: async (id: string, productData: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product | null> => {
    const products = await productApi.getAllProducts();
    const index = products.findIndex(product => product.id === id);
    
    if (index === -1) return null;
    
    const updatedProduct = {
      ...products[index],
      ...productData,
      updatedAt: new Date().toISOString()
    };
    
    products[index] = updatedProduct;
    localStorage.setItem('shop_products', JSON.stringify(products));
    return updatedProduct;
  },

  // Delete product
  deleteProduct: async (id: string): Promise<boolean> => {
    const products = await productApi.getAllProducts();
    const filteredProducts = products.filter(product => product.id !== id);
    
    if (filteredProducts.length === products.length) return false;
    
    localStorage.setItem('shop_products', JSON.stringify(filteredProducts));
    return true;
  },

  // Toggle product active status
  toggleProductActive: async (id: string, active: boolean): Promise<Product | null> => {
    return productApi.updateProduct(id, { active });
  }
}; 