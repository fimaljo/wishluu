import { db } from './firebase';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';

export interface CommentData {
  name: string;
  message: string;
  isAnonymous: boolean;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface CommentDocument extends CommentData {
  id: string;
  wishId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  spamScore?: number;
  isSpam?: boolean;
}

export interface CreateCommentResult {
  success: boolean;
  commentId?: string;
  error?: string;
}

export interface CommentsStats {
  total: number;
  anonymous: number;
  named: number;
}

export class FirebaseCommentService {
  private collectionName = 'comments';

  /**
   * Create a new comment with spam prevention
   */
  async createComment(
    wishId: string,
    commentData: CommentData
  ): Promise<CreateCommentResult> {
    console.log('Service: Creating comment with wishId:', wishId);
    console.log('Service: Comment data:', commentData);

    try {
      // Basic spam prevention
      const spamScore = await this.calculateSpamScore(wishId, commentData);
      console.log('Service: Spam score:', spamScore);

      if (spamScore > 0.7) {
        console.log('Service: Comment flagged as spam');
        return {
          success: false,
          error: 'Comment flagged as spam',
        };
      }

      const comment = {
        ...commentData,
        wishId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        spamScore,
        isSpam: spamScore > 0.5,
      };

      console.log('Service: Final comment object:', comment);
      console.log('Service: Adding to collection:', this.collectionName);

      const docRef = await addDoc(collection(db, this.collectionName), comment);

      console.log('Service: Document created with ID:', docRef.id);

      return {
        success: true,
        commentId: docRef.id,
      };
    } catch (error) {
      console.error('Service: Error creating comment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get comments for a wish with pagination
   */
  async getComments(
    wishId: string,
    pageSize: number = 20,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{
    comments: CommentDocument[];
    lastDoc?: QueryDocumentSnapshot<DocumentData>;
  }> {
    console.log('Service: Getting comments for wishId:', wishId);

    try {
      // Simple query without orderBy to avoid index requirements
      const q = query(
        collection(db, this.collectionName),
        where('wishId', '==', wishId)
      );

      const querySnapshot = await getDocs(q);
      console.log('Service: Query snapshot size:', querySnapshot.size);

      const comments: CommentDocument[] = [];

      querySnapshot.forEach(doc => {
        const data = doc.data();
        console.log('Service: Document data:', {
          id: doc.id,
          wishId: data.wishId,
          isSpam: data.isSpam,
        });
        // Filter out spam comments on the client side
        if (!data.isSpam) {
          comments.push({
            id: doc.id,
            ...data,
          } as CommentDocument);
        }
      });

      console.log('Service: Non-spam comments found:', comments.length);

      // Sort by createdAt on client side (newest first)
      comments.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

      // Apply pagination on client side
      const paginatedComments = comments.slice(0, pageSize);

      const result: {
        comments: CommentDocument[];
        lastDoc?: QueryDocumentSnapshot<DocumentData>;
      } = {
        comments: paginatedComments,
      };

      console.log('Service: Returning comments:', result.comments.length);
      return result;
    } catch (error) {
      console.error('Service: Error getting comments:', error);
      return { comments: [] };
    }
  }

  /**
   * Delete a comment (only by the comment author or wish owner)
   */
  async deleteComment(commentId: string, userId?: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, this.collectionName, commentId));
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  }

  /**
   * Get comment statistics for a wish
   */
  async getCommentStats(wishId: string): Promise<CommentsStats> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('wishId', '==', wishId)
      );

      const querySnapshot = await getDocs(q);
      const stats: CommentsStats = {
        total: 0,
        anonymous: 0,
        named: 0,
      };

      querySnapshot.forEach(doc => {
        const data = doc.data();
        // Only count non-spam comments
        if (!data.isSpam) {
          stats.total++;
          if (data.isAnonymous) {
            stats.anonymous++;
          } else {
            stats.named++;
          }
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting comment stats:', error);
      return { total: 0, anonymous: 0, named: 0 };
    }
  }

  /**
   * Calculate spam score for a comment
   */
  private async calculateSpamScore(
    wishId: string,
    commentData: CommentData
  ): Promise<number> {
    let score = 0;

    // Check for repeated comments from same user
    if (commentData.userId) {
      const userComments = await this.getUserComments(
        wishId,
        commentData.userId
      );
      if (userComments.length >= 5) {
        score += 0.3; // Multiple comments from same user
      }
    }

    // Check for suspicious patterns
    if (commentData.message.length < 3) {
      score += 0.2; // Very short comments
    }

    if (commentData.message.length > 500) {
      score += 0.2; // Very long comments
    }

    // Check for repeated words
    const words = commentData.message.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    if (words.length > 0 && uniqueWords.size / words.length < 0.3) {
      score += 0.3; // Many repeated words
    }

    // Check for all caps
    const capsRatio =
      (commentData.message.match(/[A-Z]/g) || []).length /
      commentData.message.length;
    if (capsRatio > 0.7) {
      score += 0.2; // Too many capital letters
    }

    // Check for excessive punctuation
    const punctRatio =
      (
        commentData.message.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) ||
        []
      ).length / commentData.message.length;
    if (punctRatio > 0.3) {
      score += 0.2; // Too much punctuation
    }

    return Math.min(score, 1.0);
  }

  /**
   * Get comments by a specific user for a wish
   */
  private async getUserComments(
    wishId: string,
    userId: string
  ): Promise<CommentDocument[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('wishId', '==', wishId),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const comments: CommentDocument[] = [];

      querySnapshot.forEach(doc => {
        const data = doc.data();
        // Filter out spam comments
        if (!data.isSpam) {
          comments.push({
            id: doc.id,
            ...data,
          } as CommentDocument);
        }
      });

      // Sort by createdAt on client side
      comments.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

      return comments;
    } catch (error) {
      console.error('Error getting user comments:', error);
      return [];
    }
  }
}

export const firebaseCommentService = new FirebaseCommentService();
