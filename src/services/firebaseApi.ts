import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  updateDoc,
  deleteDoc,
  query, 
  orderBy,
  onSnapshot,
  addDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { CoffeeApiData } from './api';
import type { Product, FlavorNote } from '../types';

// Collections
const COFFEES_COLLECTION = 'coffees';
const PRODUCTS_COLLECTION = 'products';
const FLAVOR_NOTES_COLLECTION = 'flavorNotes';

// ===== 커피 관련 함수들 =====

// 모든 커피 가져오기
export const getAllCoffees = async (): Promise<CoffeeApiData[]> => {
  try {
    const q = query(
      collection(db, COFFEES_COLLECTION), 
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CoffeeApiData[];
  } catch (error) {
    console.error('Error fetching coffees:', error);
    return [];
  }
};

// 특정 커피 가져오기
export const getCoffeeById = async (id: string): Promise<CoffeeApiData | null> => {
  try {
    const docRef = doc(db, COFFEES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as CoffeeApiData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching coffee:', error);
    return null;
  }
};

// 커피 실시간 구독
export const subscribeToCoffees = (callback: (coffees: CoffeeApiData[]) => void) => {
  const q = query(
    collection(db, COFFEES_COLLECTION), 
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const coffees = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CoffeeApiData[];
    
    callback(coffees);
  });
};

// 커피 생성
export const createCoffee = async (data: Omit<CoffeeApiData, 'id' | 'createdAt' | 'updatedAt'>): Promise<CoffeeApiData> => {
  try {
    const docRef = await addDoc(collection(db, COFFEES_COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      id: docRef.id,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating coffee:', error);
    throw error;
  }
};

// 커피 업데이트
export const updateCoffee = async (id: string, data: Partial<Omit<CoffeeApiData, 'id' | 'createdAt'>>): Promise<CoffeeApiData | null> => {
  try {
    const docRef = doc(db, COFFEES_COLLECTION, id);
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(docRef, updateData);
    
    // 업데이트된 데이터 반환
    const updatedDoc = await getDoc(docRef);
    if (updatedDoc.exists()) {
      return { id: updatedDoc.id, ...updatedDoc.data() } as CoffeeApiData;
    }
    return null;
  } catch (error) {
    console.error('Error updating coffee:', error);
    return null;
  }
};

// 커피 삭제
export const deleteCoffee = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COFFEES_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting coffee:', error);
    throw error;
  }
};

// ===== 상품 관련 함수들 =====

// 모든 상품 가져오기
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    
    return products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// 상품 실시간 구독
export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    
    callback(products);
  });
};

// 상품 생성
export const createProduct = async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      id: docRef.id,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// 상품 업데이트
export const updateProduct = async (id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product | null> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(docRef, updateData);
    
    // 업데이트된 데이터 반환
    const updatedDoc = await getDoc(docRef);
    if (updatedDoc.exists()) {
      return { id: updatedDoc.id, ...updatedDoc.data() } as Product;
    }
    return null;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

// 상품 삭제
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// 상품 활성/비활성 토글
export const toggleProductActive = async (id: string, active: boolean): Promise<Product | null> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const updateData = {
      active,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(docRef, updateData);
    
    // 업데이트된 데이터 반환
    const updatedDoc = await getDoc(docRef);
    if (updatedDoc.exists()) {
      return { id: updatedDoc.id, ...updatedDoc.data() } as Product;
    }
    return null;
  } catch (error) {
    console.error('Error toggling product active:', error);
    return null;
  }
};

// ===== 풍미 노트 관련 함수들 =====

// 모든 풍미 노트 가져오기
export const getAllFlavorNotes = async (): Promise<FlavorNote[]> => {
  try {
    const q = query(
      collection(db, FLAVOR_NOTES_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FlavorNote[];
  } catch (error) {
    console.error('Error fetching flavor notes:', error);
    return [];
  }
};

// 풍미 노트 실시간 구독
export const subscribeToFlavorNotes = (callback: (flavorNotes: FlavorNote[]) => void) => {
  const q = query(
    collection(db, FLAVOR_NOTES_COLLECTION),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const flavorNotes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FlavorNote[];
    
    callback(flavorNotes);
  });
};

// 풍미 노트 생성
export const createFlavorNote = async (data: Omit<FlavorNote, 'id' | 'createdAt' | 'updatedAt'>): Promise<FlavorNote> => {
  try {
    const docRef = await addDoc(collection(db, FLAVOR_NOTES_COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      id: docRef.id,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating flavor note:', error);
    throw error;
  }
};

// 풍미 노트 업데이트
export const updateFlavorNote = async (id: string, data: Partial<Omit<FlavorNote, 'id' | 'createdAt'>>): Promise<FlavorNote | null> => {
  try {
    const docRef = doc(db, FLAVOR_NOTES_COLLECTION, id);
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(docRef, updateData);
    
    // 업데이트된 데이터 반환
    const updatedDoc = await getDoc(docRef);
    if (updatedDoc.exists()) {
      return { id: updatedDoc.id, ...updatedDoc.data() } as FlavorNote;
    }
    return null;
  } catch (error) {
    console.error('Error updating flavor note:', error);
    return null;
  }
};

// 풍미 노트 삭제
export const deleteFlavorNote = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, FLAVOR_NOTES_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting flavor note:', error);
    throw error;
  }
};

// 풍미 노트명으로 검색
export const findFlavorNoteByName = async (name: string): Promise<FlavorNote | null> => {
  try {
    const querySnapshot = await getDocs(collection(db, FLAVOR_NOTES_COLLECTION));
    const flavorNotes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FlavorNote[];
    
    // 한글명이나 영문명으로 검색
    const found = flavorNotes.find(note => 
      note.titleKo === name || 
      note.titleEn === name ||
      note.titleKo?.toLowerCase() === name.toLowerCase() ||
      note.titleEn?.toLowerCase() === name.toLowerCase()
    );
    
    return found || null;
  } catch (error) {
    console.error('Error finding flavor note by name:', error);
    return null;
  }
};

// ===== 기타 함수들 =====

// 초기화 함수 (빈 함수로 구현)
export const initializeData = async (): Promise<void> => {
  console.log('Firebase initialized');
};

// 기존 firebaseApi 객체 형태로 내보내기 (호환성을 위해)
export const firebaseApi = {
  getAllCoffees,
  getCoffeeById,
  subscribeToCoffees,
  createCoffee,
  updateCoffee,
  deleteCoffee,
  getAllProducts,
  subscribeToProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductActive,
  getAllFlavorNotes,
  subscribeToFlavorNotes,
  createFlavorNote,
  updateFlavorNote,
  deleteFlavorNote,
  findFlavorNoteByName
}; 