import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyB8dCMRF-coffee-demo-key",
  authDomain: "coffee-coaster-demo.firebaseapp.com",
  projectId: "coffee-coaster-demo",
  storageBucket: "coffee-coaster-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:coffee-demo-app-id"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firestore 데이터베이스 초기화
export const db = getFirestore(app);

// 개발 환경에서 에뮬레이터 연결 (선택사항)
if (import.meta.env.DEV && !import.meta.env.VITE_USE_FIREBASE_PROD) {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('Connected to Firestore emulator');
  } catch (error) {
    console.log('Firestore emulator connection failed, using production');
  }
}

export default app; 