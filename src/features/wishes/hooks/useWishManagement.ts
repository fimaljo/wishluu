'use client';

import { useState, useCallback } from 'react';
import { Wish, WishFormData } from '@/types';
import { useWishContext } from '@/contexts/WishContext';

// Custom hook for wish management (similar to Angular services)
export function useWishManagement() {
  const { addWish, updateWish, deleteWish, setLoading, setError } = useWishContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setLocalError] = useState<string | null>(null);

  // Create a new wish
  const createWish = useCallback(async (wishData: WishFormData): Promise<Wish | null> => {
    setIsLoading(true);
    setLocalError(null);
    
    try {
      // Simulate API call (replace with actual Firebase call)
      const newWish: Wish = {
        id: `wish_${Date.now()}`,
        recipientName: wishData.recipientName,
        occasion: wishData.occasion,
        message: wishData.message,
        theme: wishData.theme,
        animation: wishData.animation,
        createdAt: new Date().toISOString(),
        isPublic: true,
        views: 0,
        likes: 0,
        ...(wishData.senderName && { senderName: wishData.senderName }),
        ...(wishData.senderEmail && { senderEmail: wishData.senderEmail }),
        ...(wishData.elements && { elements: wishData.elements }),
        ...(wishData.customBackgroundColor && { customBackgroundColor: wishData.customBackgroundColor }),
      };

      // Add to global state
      addWish(newWish);
      
      return newWish;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create wish';
      setLocalError(errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [addWish, setError]);

  // Update an existing wish
  const editWish = useCallback(async (id: string, updates: Partial<Wish>): Promise<boolean> => {
    setIsLoading(true);
    setLocalError(null);
    
    try {
      // Simulate API call (replace with actual Firebase call)
      updateWish(id, updates);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update wish';
      setLocalError(errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [updateWish, setError]);

  // Delete a wish
  const removeWish = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setLocalError(null);
    
    try {
      // Simulate API call (replace with actual Firebase call)
      deleteWish(id);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete wish';
      setLocalError(errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [deleteWish, setError]);

  // Duplicate a wish
  const duplicateWish = useCallback(async (wish: Wish): Promise<Wish | null> => {
    setIsLoading(true);
    setLocalError(null);
    
    try {
      const duplicatedWish: Wish = {
        ...wish,
        id: `wish_${Date.now()}`,
        recipientName: `${wish.recipientName} (Copy)`,
        createdAt: new Date().toISOString(),
        views: 0,
        likes: 0,
      };

      addWish(duplicatedWish);
      return duplicatedWish;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to duplicate wish';
      setLocalError(errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [addWish, setError]);

  // Share a wish
  const shareWish = useCallback(async (wish: Wish): Promise<string> => {
    try {
      // Generate share URL
      const shareUrl = `${window.location.origin}/wish/${wish.id}`;
      
      // Copy to clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
      
      return shareUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to share wish';
      setLocalError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Like a wish
  const likeWish = useCallback(async (id: string, currentLikes: number): Promise<boolean> => {
    try {
      // Simulate API call (replace with actual Firebase call)
      updateWish(id, { likes: currentLikes + 1 } as Partial<Wish>);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to like wish';
      setLocalError(errorMessage);
      return false;
    }
  }, [updateWish]);

  return {
    // State
    isLoading,
    error,
    
    // Actions
    createWish,
    editWish,
    removeWish,
    duplicateWish,
    shareWish,
    likeWish,
    
    // Utilities
    clearError: () => setLocalError(null),
  };
} 