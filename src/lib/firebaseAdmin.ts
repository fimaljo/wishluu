import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    // For development, we can use the client SDK config
    // In production, use service account credentials
    if (process.env.NODE_ENV === 'production') {
      // Production: Use service account
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(
        /\\n/g,
        '\n'
      );

      if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
          'Firebase Admin credentials not configured for production'
        );
      }

      const serviceAccount = {
        projectId,
        clientEmail,
        privateKey,
      };

      initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      // Development: Use emulator or client config
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      if (!projectId) {
        throw new Error('Firebase project ID not configured for development');
      }

      initializeApp({
        projectId,
      });
    }
  }
}

// Initialize Firebase Admin
initializeFirebaseAdmin();

// Export auth instance
export const adminAuth = getAuth();
