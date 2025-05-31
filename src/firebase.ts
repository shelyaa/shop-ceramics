import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAAI1UOYUPuUbmUodIVKhfwLAqIT4nqFKY",
  authDomain: "shop-ceramics.firebaseapp.com",
  projectId: "shop-ceramics",
  storageBucket: "shop-ceramics.firebasestorage.app",
  messagingSenderId: "365777456578",
  appId: "1:365777456578:web:87f64d8137691f75495a5b",
};

export const getFirebaseApp = () => {
  if (typeof window === "undefined") return null; 
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
};
