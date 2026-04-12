import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
const firebaseConfig = {
  apiKey: "AIzaSyAXbuZENYVGRPox-Fcftclo6WlR0-VK5GE",
  authDomain: "eduvault-b705c.firebaseapp.com",
  projectId: "eduvault-b705c",
  storageBucket: "eduvault-b705c.firebasestorage.app",
  messagingSenderId: "791533601638",
  appId: "1:791533601638:web:fd8af861059593a565fea7",
  measurementId: "G-1JGFYCH8P6"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});