import { initializeApp } from "firebase/app";
// Give me Firebase’s engine so I can start it
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
// From firebase give me the authentication service
import AsyncStorage from '@react-native-async-storage/async-storage'

const firebaseConfig = {
  apiKey: "AIzaSyCRvL_XXbyotngwjLcR4niaY_bXM-eVg14",
  authDomain: "rn-auth-template.firebaseapp.com",
  projectId: "rn-auth-template",
  storageBucket: "rn-auth-template.appspot.com",
  messagingSenderId: "977101964024",
  appId: "1:977101964024:web:db262f8294e69c6577b10d"
};
// This is my firebase project's address

const app = initializeApp(firebaseConfig);
// Firebase, wake up and connect my app to this project
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
// auth is now an object that can:
// log users in, log users out, tell if user is logged in

// Why not just getAuth(app) ?
// Web
// getAuth(app); // browser has localStorage

// React Native ❌
// getAuth(app); // NO storage → session lost

// Persistence tells Firebase where and how to store auth state.