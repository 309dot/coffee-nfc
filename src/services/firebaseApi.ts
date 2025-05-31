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
  onSnapshot,
  addDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { CoffeeApiData } from './api';
import type { Product, FlavorNote } from '../types';

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

// 기본 샘플 풍미 노트 데이터
const initialFlavorNotes: Omit<FlavorNote, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    titleKo: "레몬 껍질",
    titleEn: "lemon peel",
    emoji: "🍋",
    description: "커피의 풍미를 더욱 풍부하게 해주는 레몬 껍질에 대해 알아보세요. 레몬 껍질은 커피에 상큼한 향을 더해주며, 커피의 쓴맛을 부드럽게 해주는 역할을 합니다. 특히, 레몬 껍질을 갈아서 커피에 첨가하면 새로운 맛의 조화를 경험할 수 있습니다. 비타민 C와 항산화 물질이 풍부한 레몬 껍질은 건강에도 이로운 선택이 될 것입니다.",
    category: "과일"
  },
  {
    titleKo: "초콜릿",
    titleEn: "chocolate",
    emoji: "🍫",
    description: "진한 초콜릿 향이 커피의 깊이를 더해줍니다. 카카오의 풍부한 향과 단맛이 커피의 쓴맛과 조화를 이루어 균형 잡힌 맛을 만들어냅니다. 특히 다크 초콜릿의 경우 커피의 바디감을 강화하며, 후미에 남는 달콤한 여운이 오래도록 지속됩니다.",
    category: "단맛"
  },
  {
    titleKo: "견과류",
    titleEn: "nutty",
    emoji: "🥜",
    description: "고소한 견과류 풍미는 커피에 따뜻하고 부드러운 느낌을 더해줍니다. 아몬드, 헤이즐넛, 피칸 등의 향이 커피의 마일드함을 강조하며, 특히 아침 커피로 마시기에 적합한 친숙하고 편안한 맛을 제공합니다.",
    category: "견과류"
  },
  {
    titleKo: "베리류",
    titleEn: "berry",
    emoji: "🫐",
    description: "상큼하고 달콤한 베리류 풍미는 커피에 과일의 신선함을 더해줍니다. 블루베리, 라즈베리, 블랙베리 등의 향이 커피의 산미와 어우러져 밝고 생동감 있는 맛을 만들어냅니다. 특히 스페셜티 커피에서 자주 발견되는 고급스러운 풍미입니다.",
    category: "과일"
  },
  {
    titleKo: "꽃향기",
    titleEn: "floral",
    emoji: "🌸",
    description: "은은한 꽃향기는 커피에 우아하고 섬세한 향을 더해줍니다. 라벤더, 재스민, 장미 등의 플로럴 노트가 커피의 복합적인 아로마를 한층 풍부하게 만들어주며, 특히 라이트 로스팅에서 두드러지게 나타나는 특별한 풍미입니다.",
    category: "플로럴"
  }
];

// 초기 데이터 설정
export const initializeData = async () => {
  try {
    // 커피 데이터 초기화
    const coffeesSnapshot = await getDocs(collection(db, 'coffees'));
    if (coffeesSnapshot.empty) {
      console.log('Initializing coffee data...');
      for (const coffee of initialCoffeeData) {
        await addDoc(collection(db, 'coffees'), {
          ...coffee,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      console.log('Coffee data initialized');
    }

    // 상품 데이터 초기화
    const productsSnapshot = await getDocs(collection(db, 'products'));
    if (productsSnapshot.empty) {
      console.log('Initializing product data...');
      for (const product of initialProductData) {
        await addDoc(collection(db, 'products'), {
          ...product,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      console.log('Product data initialized');
    }

    // 풍미 노트 데이터 초기화
    const flavorNotesSnapshot = await getDocs(collection(db, 'flavorNotes'));
    if (flavorNotesSnapshot.empty) {
      console.log('Initializing flavor notes data...');
      for (const flavorNote of initialFlavorNotes) {
        await addDoc(collection(db, 'flavorNotes'), {
          ...flavorNote,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      console.log('Flavor notes data initialized');
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

// ===== 풍미 노트 관련 함수들 =====

// 풍미 노트 ID 생성

// 모든 풍미 노트 가져오기
export const getAllFlavorNotes = async (): Promise<FlavorNote[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'flavorNotes'));
    
    const flavorNotes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FlavorNote[];
    
    return flavorNotes;
  } catch (error) {
    console.error('Error fetching flavor notes:', error);
    return [];
  }
};

// 관리자용 모든 풍미 노트 가져오기
export const getAllFlavorNotesAdmin = async (): Promise<FlavorNote[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'flavorNotes'));
    
    const flavorNotes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FlavorNote[];
    
    return flavorNotes;
  } catch (error) {
    console.error('Error fetching flavor notes (admin):', error);
    return [];
  }
};

// 특정 풍미 노트 가져오기
export const getFlavorNoteById = async (id: string): Promise<FlavorNote | null> => {
  try {
    const docRef = doc(db, 'flavorNotes', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as FlavorNote;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching flavor note:', error);
    return null;
  }
};

// 풍미 노트명으로 검색 (한글/영문 모두 지원)
export const findFlavorNoteByName = async (name: string): Promise<FlavorNote | null> => {
  try {
    // 한글명으로 검색
    let querySnapshot = await getDocs(
      query(
        collection(db, 'flavorNotes'), 
        where('titleKo', '==', name)
      )
    );
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as FlavorNote;
    }
    
    // 영문명으로 검색
    querySnapshot = await getDocs(
      query(
        collection(db, 'flavorNotes'), 
        where('titleEn', '==', name.toLowerCase())
      )
    );
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as FlavorNote;
    }
    
    return null;
  } catch (error) {
    console.error('Error finding flavor note:', error);
    return null;
  }
};

// 풍미 노트 실시간 구독
export const subscribeToFlavorNotes = (callback: (flavorNotes: FlavorNote[]) => void) => {
  const q = query(collection(db, 'flavorNotes'));
  
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
    const flavorNoteData = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'flavorNotes'), flavorNoteData);
    
    return {
      id: docRef.id,
      ...flavorNoteData
    };
  } catch (error) {
    console.error('Error creating flavor note:', error);
    throw error;
  }
};

// 풍미 노트 수정
export const updateFlavorNote = async (id: string, data: Partial<Omit<FlavorNote, 'id' | 'createdAt'>>): Promise<FlavorNote | null> => {
  try {
    const docRef = doc(db, 'flavorNotes', id);
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(docRef, updateData);
    
    const updatedDoc = await getDoc(docRef);
    if (updatedDoc.exists()) {
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as FlavorNote;
    }
    
    return null;
  } catch (error) {
    console.error('Error updating flavor note:', error);
    throw error;
  }
};

// 풍미 노트 삭제
export const deleteFlavorNote = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'flavorNotes', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting flavor note:', error);
    throw error;
  }
};

export const firebaseApi = {
  // 커피 관련
  getAllCoffees: async (): Promise<CoffeeApiData[]> => {
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
      console.error('Error getting all coffees:', error);
      return [];
    }
  },
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
  toggleCoffeeActive: async (id: string, active: boolean): Promise<boolean> => {
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
        active,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error toggling coffee status:', error);
      return false;
    }
  },
  
  // 상품 관련
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
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
  subscribeToProducts: (callback: (products: Product[]) => void): (() => void) => {
    const q = query(collection(db, PRODUCTS_COLLECTION));
    
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
  toggleProductActive: async (id: string, active: boolean): Promise<Product | null> => {
    try {
      return await firebaseApi.updateProduct(id, { active });
    } catch (error) {
      console.error('Error toggling product status:', error);
      return null;
    }
  },
  
  // 풍미 노트 관련
  getAllFlavorNotes,
  getAllFlavorNotesAdmin,
  getFlavorNoteById,
  findFlavorNoteByName,
  subscribeToFlavorNotes,
  createFlavorNote,
  updateFlavorNote,
  deleteFlavorNote,
  
  // 초기화
  initializeData
}; 