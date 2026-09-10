import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD_oHUozGMgXLDIvqo9p3lZOk6PLAETn9c",
  authDomain: "time-blocking-calendar.firebaseapp.com",
  projectId: "time-blocking-calendar",
  storageBucket: "time-blocking-calendar.firebasestorage.app",
  messagingSenderId: "278787850584",
  appId: "1:278787850584:web:28aef7c76e29f48782e52d",
  measurementId: "G-M829D1R41G"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
