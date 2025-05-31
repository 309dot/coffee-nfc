import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  updateDoc,
  setDoc,
  deleteDoc,
  query, 
  where, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { CoffeeApiData } from './api';
import type { Product } from '../types';

// Collections
const COFFEES_COLLECTION = 'coffees';
const PRODUCTS_COLLECTION = 'products';

// ID 생성 헬퍼 함수
const generateCoffeeId = (titleEn: string): string => {
  const prefix = titleEn.toLowerCase()
    .split(' ')[0]
    .substring(0, 3);
  const timestamp = Date.now().toString().slice(-3);
  return `${prefix}-${timestamp}`;
};

const generateProductId = (category: string): string => {
  const prefix = category.substring(0, 2);
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}-${timestamp}`;
};

// 초기 데이터
const initialCoffeeData: Omit<CoffeeApiData, 'id'>[] = [
  {
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

// 초기 상품 데이터
const initialProductData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    category: '드립백',
    titleKo: '에티오피아 예가체프 드립백',
    titleEn: 'Ethiopia Yirgacheffe Drip Bag',
    price: 12000,
    description: '과일향이 풍부한 에티오피아 스페셜티 원두를 편리한 드립백으로 만나보세요.',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
    active: true
  },
  {
    category: '원두',
    titleKo: '콜롬비아 후일라',
    titleEn: 'Colombia Huila',
    price: 28000,
    description: '달콤하고 부드러운 맛의 콜롬비아 스페셜티 원두입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=300&fit=crop',
    active: true
  },
  {
    category: '굿즈',
    titleKo: 'M1CT 텀블러',
    titleEn: 'M1CT Tumbler',
    price: 18000,
    description: '매장 로고가 새겨진 스테인리스 텀블러입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1554048612-b6a482b224ec?w=400&h=300&fit=crop',
    active: true
  },
  {
    category: '디저트',
    titleKo: '수제 마들렌',
    titleEn: 'Handmade Madeleines',
    price: 8000,
    description: '커피와 완벽한 조화를 이루는 수제 마들렌입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    active: true
  }
];

// 초기 데이터 설정
export const initializeData = async (): Promise<void> => {
  try {
    // 커피 데이터 초기화
    const coffeesSnapshot = await getDocs(collection(db, COFFEES_COLLECTION));
    
    if (coffeesSnapshot.empty) {
      console.log('Initializing coffee data...');
      for (const coffeeData of initialCoffeeData) {
        const customId = generateCoffeeId(coffeeData.titleEn);
        await setDoc(doc(db, COFFEES_COLLECTION, customId), {
          id: customId,
          ...coffeeData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    // 상품 데이터 초기화
    const productsSnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    
    if (productsSnapshot.empty) {
      console.log('Initializing product data...');
      for (const productData of initialProductData) {
        const customId = generateProductId(productData.category);
        await setDoc(doc(db, PRODUCTS_COLLECTION, customId), {
          id: customId,
          ...productData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

export const firebaseApi = {
  // 커피 데이터 가져오기
  getCoffeeById: async (id: string): Promise<CoffeeApiData | null> => {
    try {
      // 먼저 ID로 직접 조회
      const docRef = doc(db, COFFEES_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as CoffeeApiData;
      }
      
      // ID로 찾지 못하면 id 필드로 쿼리
      const q = query(collection(db, COFFEES_COLLECTION), where('id', '==', id));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as CoffeeApiData;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting coffee:', error);
      return null;
    }
  },

  // 모든 활성 커피 데이터 가져오기
  getAllCoffees: async (): Promise<CoffeeApiData[]> => {
    try {
      const q = query(
        collection(db, COFFEES_COLLECTION), 
        where('active', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CoffeeApiData[];
    } catch (error) {
      console.error('Error getting all coffees:', error);
      return [];
    }
  },

  // 관리용: 모든 커피 데이터 가져오기
  getAllCoffeesAdmin: async (): Promise<CoffeeApiData[]> => {
    try {
      const q = query(collection(db, COFFEES_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CoffeeApiData[];
    } catch (error) {
      console.error('Error getting all coffees for admin:', error);
      return [];
    }
  },

  // 실시간 커피 데이터 구독
  subscribeToCoffees: (callback: (coffees: CoffeeApiData[]) => void): (() => void) => {
    const q = query(collection(db, COFFEES_COLLECTION), orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const coffees = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CoffeeApiData[];
      
      callback(coffees);
    }, (error) => {
      console.error('Error in coffee subscription:', error);
    });
  },

  // 새 커피 생성
  createCoffee: async (coffeeData: Omit<CoffeeApiData, 'id'>): Promise<CoffeeApiData> => {
    try {
      const customId = generateCoffeeId(coffeeData.titleEn);
      const newCoffee = {
        id: customId,
        ...coffeeData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // setDoc을 사용해서 커스텀 ID로 확실히 문서 생성
      await setDoc(doc(db, COFFEES_COLLECTION, customId), newCoffee);
      
      return newCoffee as CoffeeApiData;
    } catch (error) {
      console.error('Error creating coffee:', error);
      throw error;
    }
  },

  // 커피 데이터 업데이트
  updateCoffee: async (id: string, updateData: Partial<CoffeeApiData>): Promise<CoffeeApiData | null> => {
    try {
      // 먼저 실제 문서 ID 찾기
      let docRef = doc(db, COFFEES_COLLECTION, id);
      let docSnap = await getDoc(docRef);
      
      // 직접 ID로 찾지 못하면 id 필드로 쿼리
      if (!docSnap.exists()) {
        const q = query(collection(db, COFFEES_COLLECTION), where('id', '==', id));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          docRef = querySnapshot.docs[0].ref;
          docSnap = querySnapshot.docs[0];
        } else {
          console.error(`Document with id ${id} not found`);
          return null;
        }
      }
      
      const updatedData = {
        ...updateData,
        updatedAt: new Date()
      };
      
      await updateDoc(docRef, updatedData);
      
      const updatedDoc = await getDoc(docRef);
      if (updatedDoc.exists()) {
        return { id: updatedDoc.id, ...updatedDoc.data() } as CoffeeApiData;
      }
      
      return null;
    } catch (error) {
      console.error('Error updating coffee:', error);
      throw error;
    }
  },

  // 커피 삭제 (소프트 삭제)
  deleteCoffee: async (id: string): Promise<boolean> => {
    try {
      // 먼저 실제 문서 ID 찾기
      let docRef = doc(db, COFFEES_COLLECTION, id);
      let docSnap = await getDoc(docRef);
      
      // 직접 ID로 찾지 못하면 id 필드로 쿼리
      if (!docSnap.exists()) {
        const q = query(collection(db, COFFEES_COLLECTION), where('id', '==', id));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          docRef = querySnapshot.docs[0].ref;
        } else {
          console.error(`Document with id ${id} not found`);
          return false;
        }
      }
      
      await updateDoc(docRef, { 
        active: false,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error deleting coffee:', error);
      return false;
    }
  },

  // 커피 활성화
  activateCoffee: async (id: string): Promise<boolean> => {
    try {
      // 먼저 실제 문서 ID 찾기
      let docRef = doc(db, COFFEES_COLLECTION, id);
      let docSnap = await getDoc(docRef);
      
      // 직접 ID로 찾지 못하면 id 필드로 쿼리
      if (!docSnap.exists()) {
        const q = query(collection(db, COFFEES_COLLECTION), where('id', '==', id));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          docRef = querySnapshot.docs[0].ref;
        } else {
          console.error(`Document with id ${id} not found`);
          return false;
        }
      }
      
      await updateDoc(docRef, { 
        active: true,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error activating coffee:', error);
      return false;
    }
  },

  // NFC 데이터로 커피 정보 가져오기
  getCoffeeByNFC: async (nfcData: string): Promise<CoffeeApiData | null> => {
    // NFC 데이터를 파싱하여 커피 ID 추출
    const coffeeId = nfcData.includes('eth') ? 'eth-001' : 
                     nfcData.includes('col') ? 'col-001' : 
                     nfcData.includes('gua') ? 'gua-001' : 'eth-001';
    return firebaseApi.getCoffeeById(coffeeId);
  },

  // ===== 상품 관련 API =====

  // 상품 ID로 단일 상품 가져오기
  getProductById: async (id: string): Promise<Product | null> => {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
      }
      
      // ID로 찾지 못하면 id 필드로 쿼리
      const q = query(collection(db, PRODUCTS_COLLECTION), where('id', '==', id));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Product;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting product:', error);
      return null;
    }
  },

  // 모든 활성 상품 가져오기
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('active', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error('Error getting all products:', error);
      return [];
    }
  },

  // 관리용: 모든 상품 가져오기 (활성/비활성 포함)
  getAllProductsAdmin: async (): Promise<Product[]> => {
    try {
      const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error('Error getting all products for admin:', error);
      return [];
    }
  },

  // 실시간 상품 데이터 구독
  subscribeToProducts: (callback: (products: Product[]) => void): (() => void) => {
    const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      callback(products);
    }, (error) => {
      console.error('Error in product subscription:', error);
    });
  },

  // 새 상품 생성
  createProduct: async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    try {
      const customId = generateProductId(productData.category);
      const newProduct = {
        id: customId,
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, PRODUCTS_COLLECTION, customId), newProduct);
      
      return newProduct as Product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // 상품 데이터 업데이트
  updateProduct: async (id: string, updateData: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product | null> => {
    try {
      let docRef = doc(db, PRODUCTS_COLLECTION, id);
      let docSnap = await getDoc(docRef);
      
      // 직접 ID로 찾지 못하면 id 필드로 쿼리
      if (!docSnap.exists()) {
        const q = query(collection(db, PRODUCTS_COLLECTION), where('id', '==', id));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          docRef = querySnapshot.docs[0].ref;
          docSnap = querySnapshot.docs[0];
        } else {
          console.error(`Product with id ${id} not found`);
          return null;
        }
      }
      
      const updatedData = {
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(docRef, updatedData);
      
      const updatedDoc = await getDoc(docRef);
      if (updatedDoc.exists()) {
        return { id: updatedDoc.id, ...updatedDoc.data() } as Product;
      }
      
      return null;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // 상품 삭제 (완전 삭제)
  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      let docRef = doc(db, PRODUCTS_COLLECTION, id);
      let docSnap = await getDoc(docRef);
      
      // 직접 ID로 찾지 못하면 id 필드로 쿼리
      if (!docSnap.exists()) {
        const q = query(collection(db, PRODUCTS_COLLECTION), where('id', '==', id));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          docRef = querySnapshot.docs[0].ref;
        } else {
          console.error(`Product with id ${id} not found`);
          return false;
        }
      }
      
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  },

  // 상품 활성/비활성 토글
  toggleProductActive: async (id: string, active: boolean): Promise<Product | null> => {
    try {
      return await firebaseApi.updateProduct(id, { active });
    } catch (error) {
      console.error('Error toggling product status:', error);
      return null;
    }
  },
}; 