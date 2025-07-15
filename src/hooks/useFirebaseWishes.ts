import { useState, useEffect, useCallback } from 'react';
import {
  FirebaseWishService,
  WishData,
  ServiceResponse,
} from '@/lib/firebaseWishService';
import { useAuth } from '@/contexts/AuthContext';

export interface Wish {
  id: string;
  title: string;
  recipientName: string;
  message: string;
  elements: any[];
  stepSequence: string[][];
  theme: string;
  customBackgroundColor?: string;
  shareId: string;
  isPublic: boolean;
  createdAt: any;
  updatedAt: any;
  createdBy: string;
  viewCount: number;
  likeCount: number;
}

interface UseFirebaseWishesOptions {
  autoLoad?: boolean;
  userId?: string;
}

export function useFirebaseWishes(options: UseFirebaseWishesOptions = {}) {
  const { autoLoad = true, userId } = options;
  const { user } = useAuth();

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user's wishes
  const loadUserWishes = useCallback(
    async (targetUserId?: string) => {
      const targetUser = targetUserId || user?.uid;
      if (!targetUser) {
        setError('No user ID provided');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await FirebaseWishService.getWishesByUserId(targetUser);
        if (result.success && result.data) {
          setWishes(result.data);
        } else {
          setError(result.error || 'Failed to load wishes');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    },
    [user?.uid]
  );

  // Create a new wish
  const createWish = useCallback(
    async (wishData: WishData): Promise<ServiceResponse<Wish>> => {
      if (!user?.uid) {
        return {
          success: false,
          error: 'User not authenticated',
        };
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await FirebaseWishService.createWish(wishData, user.uid);
        if (result.success && result.data) {
          setWishes(prev => [result.data, ...prev]);
        }
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [user?.uid]
  );

  // Update a wish
  const updateWish = useCallback(
    async (
      wishId: string,
      updates: Partial<WishData>
    ): Promise<ServiceResponse<Wish>> => {
      if (!user?.uid) {
        return {
          success: false,
          error: 'User not authenticated',
        };
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await FirebaseWishService.updateWish(
          wishId,
          updates,
          user.uid
        );
        if (result.success && result.data) {
          setWishes(prev =>
            prev.map(wish => (wish.id === wishId ? result.data : wish))
          );
        }
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [user?.uid]
  );

  // Delete a wish
  const deleteWish = useCallback(
    async (wishId: string): Promise<ServiceResponse<boolean>> => {
      if (!user?.uid) {
        return {
          success: false,
          error: 'User not authenticated',
        };
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await FirebaseWishService.deleteWish(wishId, user.uid);
        if (result.success) {
          setWishes(prev => prev.filter(wish => wish.id !== wishId));
        }
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [user?.uid]
  );

  // Get wish by share ID
  const getWishByShareId = useCallback(
    async (shareId: string): Promise<ServiceResponse<Wish>> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await FirebaseWishService.getWishByShareId(shareId);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Like a wish
  const likeWish = useCallback(
    async (wishId: string): Promise<ServiceResponse<boolean>> => {
      if (!user?.uid) {
        return {
          success: false,
          error: 'User not authenticated',
        };
      }

      try {
        const result = await FirebaseWishService.toggleWishLike(
          wishId,
          user.uid
        );
        if (result.success) {
          setWishes(prev =>
            prev.map(wish =>
              wish.id === wishId
                ? { ...wish, likeCount: wish.likeCount + 1 }
                : wish
            )
          );
        }
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [user?.uid]
  );

  // Upsert user data
  const upsertUser = useCallback(
    async (userData: {
      id: string;
      email: string;
      displayName?: string;
      photoURL?: string;
      isAdmin?: boolean;
    }): Promise<ServiceResponse<any>> => {
      try {
        return await FirebaseWishService.upsertUser(userData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    []
  );

  // Auto-load wishes when component mounts
  useEffect(() => {
    if (autoLoad && user?.uid) {
      loadUserWishes(userId);
    }
  }, [autoLoad, user?.uid, userId, loadUserWishes]);

  return {
    wishes,
    isLoading,
    error,
    createWish,
    updateWish,
    deleteWish,
    getWishByShareId,
    likeWish,
    upsertUser,
    loadUserWishes,
    refreshWishes: () => loadUserWishes(userId),
  };
}
