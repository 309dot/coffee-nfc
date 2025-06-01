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
    console.log('📝 커피 업데이트 시작:', id, data);
    
    const docRef = doc(db, COFFEES_COLLECTION, id);
    
    // 업데이트 전 문서 존재 확인
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.log('⚠️ 업데이트할 문서가 존재하지 않음:', id);
      throw new Error('업데이트할 커피가 존재하지 않습니다.');
    }
    
    console.log('📄 업데이트 전 문서 데이터:', docSnap.data());
    
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(docRef, updateData);
    console.log('✅ 업데이트 완료:', id);
    
    // 업데이트된 데이터 반환
    const updatedDoc = await getDoc(docRef);
    if (updatedDoc.exists()) {
      const result = { id: updatedDoc.id, ...updatedDoc.data() } as CoffeeApiData;
      console.log('📄 업데이트된 문서 데이터:', result);
      return result;
    }
    return null;
  } catch (error) {
    console.error('❌ 커피 업데이트 중 오류:', error);
    
    // 권한 오류인지 확인
    if (error instanceof Error && error.message.includes('permission')) {
      throw new Error('수정 권한이 없습니다. Firebase 규칙을 확인하세요.');
    }
    
    throw error;
  }
};

// 커피 삭제
export const deleteCoffee = async (id: string): Promise<void> => {
  try {
    console.log('🗑️ 커피 삭제 시작:', id);
    
    // 삭제 전 문서 존재 확인
    const docRef = doc(db, COFFEES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.log('⚠️ 삭제할 문서가 존재하지 않음:', id);
      throw new Error('삭제할 커피가 존재하지 않습니다.');
    }
    
    console.log('📄 삭제 전 문서 데이터:', docSnap.data());
    
    // 실제 삭제 실행
    await deleteDoc(docRef);
    console.log('✅ 삭제 완료:', id);
    
    // 삭제 후 확인 (재시도 로직)
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 500)); // 0.5초 대기
      const checkDoc = await getDoc(docRef);
      
      if (!checkDoc.exists()) {
        console.log('✅ 삭제 확인 완료:', id);
        return;
      }
      
      retryCount++;
      console.log(`🔄 삭제 재시도 ${retryCount}/${maxRetries}:`, id);
      
      if (retryCount < maxRetries) {
        try {
          await deleteDoc(docRef);
        } catch (retryError) {
          console.error('재시도 중 오류:', retryError);
        }
      }
    }
    
    if (retryCount === maxRetries) {
      console.error('❌ 삭제 실패 - 최대 재시도 초과:', id);
      throw new Error('삭제에 실패했습니다. 관리자에게 문의하세요.');
    }
    
  } catch (error) {
    console.error('❌ 커피 삭제 중 오류:', error);
    
    // 권한 오류인지 확인
    if (error instanceof Error && error.message.includes('permission')) {
      throw new Error('삭제 권한이 없습니다. Firebase 규칙을 확인하세요.');
    }
    
    // 네트워크 오류인지 확인
    if (error instanceof Error && error.message.includes('network')) {
      throw new Error('네트워크 오류가 발생했습니다. 연결을 확인하세요.');
    }
    
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