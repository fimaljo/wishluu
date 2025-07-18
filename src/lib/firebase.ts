// Firebase configuration
// This file will be used to initialize Firebase for the WishLuu app

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return { success: false, error };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error };
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Check if user is admin
export const isUserAdmin = (user: User | null): boolean => {
  if (!user) return false;

  // Check if user email is in admin list
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
  const userEmail = user.email || '';

  // If no admin emails are configured, no one is admin
  if (adminEmails.length === 0 || !process.env.NEXT_PUBLIC_ADMIN_EMAILS) {
    console.warn(
      'No admin emails configured. Set NEXT_PUBLIC_ADMIN_EMAILS environment variable.'
    );
    return false;
  }

  // Admin check logging (production-safe)
  if (process.env.NODE_ENV === 'development') {
    console.log('Admin check:', {
      userEmail,
      adminEmails,
      isAdmin: adminEmails.includes(userEmail),
    });
  }

  return adminEmails.includes(userEmail);
};

export default app;
