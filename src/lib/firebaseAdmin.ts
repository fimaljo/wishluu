import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK
// Using project ID for both development and production
function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) {
      throw new Error('Firebase project ID not configured');
    }

    initializeApp({
      projectId,
    });
  }
}

// Initialize Firebase Admin
initializeFirebaseAdmin();

// Export auth instance
export const adminAuth = getAuth();
