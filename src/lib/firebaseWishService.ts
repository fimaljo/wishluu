import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { WishElement } from '@/types/templates';

// Collection names
const WISHES_COLLECTION = 'wishes';
const USERS_COLLECTION = 'users';

// Wish document interface for Firestore
export interface WishDocument {
  id: string;
  title: string;
  recipientName: string;
  message: string;
  elements: string; // JSON string of WishElement[]
  stepSequence: string; // JSON string of string[][]
  theme: string;
  customBackgroundColor?: string;
  shareId: string; // Unique shareable ID
  isPublic: boolean;
  createdAt: any; // Firestore timestamp
  updatedAt: any; // Firestore timestamp
  createdBy: string; // User ID who created the wish
  viewCount: number;
  likeCount: number;
}

// User document interface for Firestore
export interface UserDocument {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isAdmin: boolean;
  createdAt: any; // Firestore timestamp
  updatedAt: any; // Firestore timestamp
  lastLoginAt: any; // Firestore timestamp
}

// Service response types
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Wish creation/update interface
export interface WishData {
  title: string;
  recipientName: string;
  message: string;
  elements: WishElement[];
  stepSequence: string[][];
  theme: string;
  customBackgroundColor?: string;
  isPublic?: boolean;
}

/**
 * Firebase Wish Service
 * Handles all CRUD operations for wishes stored in Firestore
 */
export class FirebaseWishService {
  private static wishesCollectionRef = collection(db, WISHES_COLLECTION);
  private static usersCollectionRef = collection(db, USERS_COLLECTION);

  /**
   * Generate a unique shareable ID
   */
  private static generateShareId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  /**
   * Convert Firestore document to Wish
   */
  private static documentToWish(doc: QueryDocumentSnapshot<DocumentData>): any {
    const data = doc.data() as WishDocument;
    return {
      id: doc.id,
      title: data.title,
      recipientName: data.recipientName,
      message: data.message,
      elements: data.elements ? JSON.parse(data.elements) : [],
      stepSequence: data.stepSequence ? JSON.parse(data.stepSequence) : [],
      theme: data.theme,
      customBackgroundColor: data.customBackgroundColor,
      shareId: data.shareId,
      isPublic: data.isPublic,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: data.createdBy,
      viewCount: data.viewCount || 0,
      likeCount: data.likeCount || 0,
    };
  }

  /**
   * Convert Wish to Firestore document
   */
  private static wishToDocument(
    wish: WishData,
    userId: string
  ): Omit<WishDocument, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      title: wish.title,
      recipientName: wish.recipientName,
      message: wish.message,
      elements: JSON.stringify(wish.elements),
      stepSequence: JSON.stringify(wish.stepSequence),
      theme: wish.theme,
      ...(wish.customBackgroundColor && {
        customBackgroundColor: wish.customBackgroundColor,
      }),
      shareId: this.generateShareId(),
      isPublic: wish.isPublic ?? true,
      createdBy: userId,
      viewCount: 0,
      likeCount: 0,
    };
  }

  /**
   * Create or update user document
   */
  static async upsertUser(userData: {
    id: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    isAdmin?: boolean;
  }): Promise<ServiceResponse<UserDocument>> {
    try {
      const docRef = doc(this.usersCollectionRef, userData.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Update existing user
        await updateDoc(docRef, {
          email: userData.email,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          isAdmin: userData.isAdmin ?? false,
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        });
      } else {
        // Create new user
        await setDoc(docRef, {
          email: userData.email,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          isAdmin: userData.isAdmin ?? false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        });
      }

      const updatedDocSnap = await getDoc(docRef);
      const userDoc = updatedDocSnap.data() as UserDocument;

      return {
        success: true,
        data: { ...userDoc, id: userData.id },
        message: 'User updated successfully',
      };
    } catch (error) {
      console.error('Error upserting user:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(
    userId: string
  ): Promise<ServiceResponse<UserDocument>> {
    try {
      const docRef = doc(this.usersCollectionRef, userId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      const userData = docSnap.data() as UserDocument;
      return {
        success: true,
        data: { ...userData, id: userId },
        message: 'User retrieved successfully',
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Create a new wish
   */
  static async createWish(
    wish: WishData,
    userId: string
  ): Promise<ServiceResponse<any>> {
    try {
      // Validate required fields
      if (!wish.title || !wish.recipientName) {
        return {
          success: false,
          error: 'Title and recipient name are required',
        };
      }

      const wishDoc = this.wishToDocument(wish, userId);
      const docRef = await addDoc(this.wishesCollectionRef, {
        ...wishDoc,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const newWish = {
        id: docRef.id,
        ...wish,
        shareId: wishDoc.shareId,
        isPublic: wishDoc.isPublic,
        createdBy: userId,
        viewCount: 0,
        likeCount: 0,
      };

      return {
        success: true,
        data: newWish,
        message: 'Wish created successfully',
      };
    } catch (error) {
      console.error('Error creating wish:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get wish by ID
   */
  static async getWishById(wishId: string): Promise<ServiceResponse<any>> {
    try {
      const docRef = doc(this.wishesCollectionRef, wishId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Wish not found',
        };
      }

      const wish = this.documentToWish(docSnap);
      return {
        success: true,
        data: wish,
        message: 'Wish retrieved successfully',
      };
    } catch (error) {
      console.error('Error fetching wish:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get wish by share ID
   */
  static async getWishByShareId(
    shareId: string
  ): Promise<ServiceResponse<any>> {
    try {
      console.log('Firebase: Getting wish by shareId:', shareId);

      const q = query(
        this.wishesCollectionRef,
        where('shareId', '==', shareId),
        where('isPublic', '==', true)
      );
      const querySnapshot = await getDocs(q);

      console.log(
        'Firebase: Query result - empty:',
        querySnapshot.empty,
        'docs count:',
        querySnapshot.docs.length
      );

      if (querySnapshot.empty) {
        return {
          success: false,
          error: 'Wish not found or not public',
        };
      }

      const doc = querySnapshot.docs[0];
      if (!doc) {
        return {
          success: false,
          error: 'Wish not found',
        };
      }

      console.log('Firebase: Raw document data:', doc.data());
      const wish = this.documentToWish(doc);
      console.log('Firebase: Processed wish data:', wish);

      // Increment view count
      await updateDoc(doc.ref, {
        viewCount: (wish.viewCount || 0) + 1,
      });

      const result = {
        success: true,
        data: { ...wish, viewCount: (wish.viewCount || 0) + 1 },
        message: 'Wish retrieved successfully',
      };

      console.log('Firebase: Returning result:', result);
      return result;
    } catch (error) {
      console.error('Error fetching wish by share ID:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get wishes by user ID
   */
  static async getWishesByUserId(
    userId: string
  ): Promise<ServiceResponse<any[]>> {
    try {
      const q = query(
        this.wishesCollectionRef,
        where('createdBy', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const wishes = querySnapshot.docs.map(doc => this.documentToWish(doc));

      return {
        success: true,
        data: wishes,
        message: `Retrieved ${wishes.length} wishes`,
      };
    } catch (error) {
      console.error('Error fetching user wishes:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Update a wish
   */
  static async updateWish(
    wishId: string,
    updates: Partial<WishData>,
    userId: string
  ): Promise<ServiceResponse<any>> {
    try {
      const docRef = doc(this.wishesCollectionRef, wishId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Wish not found',
        };
      }

      const existingData = docSnap.data() as WishDocument;

      // Check if user has permission to update this wish
      if (existingData.createdBy !== userId) {
        return {
          success: false,
          error: 'You do not have permission to update this wish',
        };
      }

      // Prepare update data
      const updateData: any = {
        updatedAt: serverTimestamp(),
      };

      // Only update provided fields
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.recipientName !== undefined)
        updateData.recipientName = updates.recipientName;
      if (updates.message !== undefined) updateData.message = updates.message;
      if (updates.elements !== undefined)
        updateData.elements = JSON.stringify(updates.elements);
      if (updates.stepSequence !== undefined)
        updateData.stepSequence = JSON.stringify(updates.stepSequence);
      if (updates.theme !== undefined) updateData.theme = updates.theme;
      if (updates.customBackgroundColor !== undefined)
        updateData.customBackgroundColor = updates.customBackgroundColor;
      if (updates.isPublic !== undefined)
        updateData.isPublic = updates.isPublic;

      await updateDoc(docRef, updateData);

      // Get updated wish
      const updatedDocSnap = await getDoc(docRef);
      if (!updatedDocSnap.exists()) {
        return {
          success: false,
          error: 'Failed to retrieve updated wish',
        };
      }
      const updatedWish = this.documentToWish(
        updatedDocSnap as QueryDocumentSnapshot<DocumentData>
      );

      return {
        success: true,
        data: updatedWish,
        message: 'Wish updated successfully',
      };
    } catch (error) {
      console.error('Error updating wish:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Delete a wish
   */
  static async deleteWish(
    wishId: string,
    userId: string
  ): Promise<ServiceResponse<boolean>> {
    try {
      const docRef = doc(this.wishesCollectionRef, wishId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Wish not found',
        };
      }

      const wishData = docSnap.data() as WishDocument;

      // Check if user has permission to delete this wish
      if (wishData.createdBy !== userId) {
        return {
          success: false,
          error: 'You do not have permission to delete this wish',
        };
      }

      await deleteDoc(docRef);

      return {
        success: true,
        data: true,
        message: 'Wish deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting wish:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Like/unlike a wish
   */
  static async toggleWishLike(
    wishId: string,
    userId: string
  ): Promise<ServiceResponse<boolean>> {
    try {
      const docRef = doc(this.wishesCollectionRef, wishId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Wish not found',
        };
      }

      const wishData = docSnap.data() as WishDocument;
      const currentLikes = wishData.likeCount || 0;

      // For now, just increment likes (in a real app, you'd track individual user likes)
      await updateDoc(docRef, {
        likeCount: (currentLikes as number) + 1,
      });

      return {
        success: true,
        data: true,
        message: 'Wish liked successfully',
      };
    } catch (error) {
      console.error('Error toggling wish like:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get public wishes (for discovery)
   */
  static async getPublicWishes(
    limitCount: number = 20
  ): Promise<ServiceResponse<any[]>> {
    try {
      const q = query(
        this.wishesCollectionRef,
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);

      const wishes = querySnapshot.docs.map(doc => this.documentToWish(doc));

      return {
        success: true,
        data: wishes,
        message: `Retrieved ${wishes.length} public wishes`,
      };
    } catch (error) {
      console.error('Error fetching public wishes:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}
