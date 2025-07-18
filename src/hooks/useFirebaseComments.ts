import { useState, useEffect } from 'react';
import {
  firebaseCommentService,
  CommentData,
  CommentDocument,
} from '@/lib/firebaseCommentService';
import { useAuth } from '@/contexts/AuthContext';

interface UseFirebaseCommentsReturn {
  comments: CommentDocument[];
  isLoading: boolean;
  error: string | null;
  createComment: (
    commentData: CommentData
  ) => Promise<{ success: boolean; error?: string }>;
  deleteComment: (commentId: string) => Promise<boolean>;
  stats: {
    total: number;
    anonymous: number;
    named: number;
  };
}

export function useFirebaseComments(wishId: string): UseFirebaseCommentsReturn {
  const [comments, setComments] = useState<CommentDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, anonymous: 0, named: 0 });
  const { user } = useAuth();

  // Load comments when wishId changes
  useEffect(() => {
    if (!wishId) {
      setComments([]);
      setStats({ total: 0, anonymous: 0, named: 0 });
      return;
    }

    loadComments();
    loadStats();
  }, [wishId]);

  const loadComments = async () => {
    if (!wishId) return;

    console.log('Hook: Loading comments for wishId:', wishId);
    setIsLoading(true);
    setError(null);

    try {
      const result = await firebaseCommentService.getComments(wishId);
      console.log('Hook: Comments loaded:', result.comments);
      setComments(result.comments);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load comments';
      setError(errorMessage);
      console.error('Hook: Error loading comments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    if (!wishId) return;

    try {
      const commentStats = await firebaseCommentService.getCommentStats(wishId);
      setStats(commentStats);
    } catch (err) {
      console.error('Error loading comment stats:', err);
    }
  };

  const createComment = async (
    commentData: CommentData
  ): Promise<{ success: boolean; error?: string }> => {
    if (!wishId) {
      console.error('No wishId provided for comment creation');
      return { success: false, error: 'No wish ID provided' };
    }

    console.log('Hook: Creating comment with wishId:', wishId);
    console.log('Hook: Original comment data:', commentData);
    console.log('Hook: Current user:', user);

    try {
      // Add user info if available
      const enrichedCommentData: CommentData = {
        ...commentData,
        ...(user?.uid && { userId: user.uid }),
        ...(user?.email && { userEmail: user.email }),
      };

      console.log('Hook: Enriched comment data:', enrichedCommentData);

      const result = await firebaseCommentService.createComment(
        wishId,
        enrichedCommentData
      );

      console.log('Hook: Service result:', result);

      if (result.success) {
        // Reload comments and stats
        await loadComments();
        await loadStats();
      }

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create comment';
      console.error('Hook: Error creating comment:', err);
      return { success: false, error: errorMessage };
    }
  };

  const deleteComment = async (commentId: string): Promise<boolean> => {
    try {
      const success = await firebaseCommentService.deleteComment(
        commentId,
        user?.uid
      );

      if (success) {
        // Reload comments and stats
        await loadComments();
        await loadStats();
      }

      return success;
    } catch (err) {
      console.error('Error deleting comment:', err);
      return false;
    }
  };

  return {
    comments,
    isLoading,
    error,
    createComment,
    deleteComment,
    stats,
  };
}
