import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBpqxuMQCk85f9jL76cSRF0wQlV1O6JeWg",
  authDomain: "mobile-lanjut-p9.firebaseapp.com",
  projectId: "mobile-lanjut-p9",
  storageBucket: "mobile-lanjut-p9.firebasestorage.app",
  messagingSenderId: "390141719380",
  appId: "1:390141719380:web:c0d794523e317b284a8ec1",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});