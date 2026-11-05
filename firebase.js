import { Platform } from "react-native";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase web app config (Project settings > General > Your apps)
export const firebaseConfig = {
  apiKey: "AIzaSyBI7k8yQis9Fv4ww4NXeF7tlOhp8LFmbnQ",
  authDomain: "timepass-a394c.firebaseapp.com",
  projectId: "timepass-a394c",
  storageBucket: "timepass-a394c.firebasestorage.app",
  messagingSenderId: "420912206948",
  appId: "1:420912206948:web:73f5ae629f82df4a163b71",
  measurementId: "G-FNJFK8G7FZ",
};

const alreadyInitialised = getApps().length > 0;
export const app = alreadyInitialised ? getApp() : initializeApp(firebaseConfig);

// On phones the auth session is kept in AsyncStorage; on web the default persistence is used.
export const auth =
  Platform.OS === "web" || alreadyInitialised
    ? getAuth(app)
    : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
