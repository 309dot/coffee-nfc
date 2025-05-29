import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase 설정 - 실제 프로젝트 설정
const firebaseConfig = {
  apiKey: "AIzaSyA-bDvcTV5t47jY9qWA66D0VNibZPsurpo",
  authDomain: "coffee-nfc.firebaseapp.com",
  projectId: "coffee-nfc",
  storageBucket: "coffee-nfc.firebasestorage.app",
  messagingSenderId: "1032793136121",
  appId: "1:1032793136121:web:12b39cbb3b83ef5e1b3b28",
  measurementId: "G-ZMZWMBGSQ5"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firestore 데이터베이스 초기화
export const db = getFirestore(app);

// 개발 환경에서 에뮬레이터 연결 (선택사항)
// 실제 프로덕션 사용을 위해 주석 처리
/*
if (import.meta.env.DEV && !import.meta.env.VITE_USE_FIREBASE_PROD) {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('Connected to Firestore emulator');
  } catch (error) {
    console.log('Firestore emulator connection failed, using production');
  }
}
*/

export default app; 