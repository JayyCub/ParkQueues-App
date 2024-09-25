import { initializeApp, getApp } from 'firebase/app'
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

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
let auth

if (Platform.OS !== 'web') {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  })
} else {
  auth = getAuth(app) // Use standard Firebase auth for web
}

export { app, auth, getApp, getAuth }
