import { initializeApp, getApp } from 'firebase/app'
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyBN-BvY_-Qby5EG44p4kKiGqUoy9n84mj0',
  authDomain: 'parkqueues-app.firebaseapp.com',
  projectId: 'parkqueues-app',
  storageBucket: 'parkqueues-app.appspot.com',
  messagingSenderId: '881705509272',
  appId: '1:881705509272:web:7991c05b91dfd7dd81cbed',
  measurementId: 'G-GRK7FHQC4R'
}

const app = initializeApp(firebaseConfig)
// initialize Firebase Auth for that app immediately
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})

export { app, auth, getApp, getAuth }
