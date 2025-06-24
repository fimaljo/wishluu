export interface UserPremiumStatus {
  userId: string;
  isPremium: boolean;
  planType: 'free' | 'pro' | 'premium';
  subscriptionId?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  isPremium: boolean;
  requiredPlan: 'free' | 'pro' | 'premium';
}

class PremiumService {
  private static instance: PremiumService;
  private userStatusCache: Map<string, UserPremiumStatus> = new Map();

  private constructor() {}

  public static getInstance(): PremiumService {
    if (!PremiumService.instance) {
      PremiumService.instance = new PremiumService();
    }
    return PremiumService.instance;
  }

  /**
   * Get user's premium status (currently local, will be Firebase later)
   */
  async getUserPremiumStatus(userId: string): Promise<UserPremiumStatus | null> {
    try {
      // Check cache first
      if (this.userStatusCache.has(userId)) {
        return this.userStatusCache.get(userId)!;
      }

      // For now, check localStorage (will be replaced with Firebase)
      const storedStatus = localStorage.getItem(`premium_${userId}`);
      
      if (storedStatus) {
        const parsedStatus = JSON.parse(storedStatus);
        const premiumStatus: UserPremiumStatus = {
          ...parsedStatus,
          expiresAt: parsedStatus.expiresAt ? new Date(parsedStatus.expiresAt) : undefined,
          createdAt: new Date(parsedStatus.createdAt),
          updatedAt: new Date(parsedStatus.updatedAt),
        };

        this.userStatusCache.set(userId, premiumStatus);
        return premiumStatus;
      }

      // Create default user if doesn't exist
      const defaultStatus: UserPremiumStatus = {
        userId,
        isPremium: false,
        planType: 'free',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.createUserPremiumStatus(defaultStatus);
      this.userStatusCache.set(userId, defaultStatus);
      return defaultStatus;
    } catch (error) {
      console.error('Error getting user premium status:', error);
      return null;
    }
  }

  /**
   * Create or update user premium status
   */
  async createUserPremiumStatus(premiumStatus: UserPremiumStatus): Promise<void> {
    try {
      // For now, store in localStorage (will be replaced with Firebase)
      const statusToStore = {
        ...premiumStatus,
        expiresAt: premiumStatus.expiresAt?.toISOString(),
        createdAt: premiumStatus.createdAt.toISOString(),
        updatedAt: premiumStatus.updatedAt.toISOString(),
      };

      localStorage.setItem(`premium_${premiumStatus.userId}`, JSON.stringify(statusToStore));

      // Update cache
      this.userStatusCache.set(premiumStatus.userId, premiumStatus);
    } catch (error) {
      console.error('Error creating user premium status:', error);
      throw error;
    }
  }

  /**
   * Update user's premium status
   */
  async updateUserPremiumStatus(
    userId: string, 
    updates: Partial<UserPremiumStatus>
  ): Promise<void> {
    try {
      const currentStatus = this.userStatusCache.get(userId);
      if (!currentStatus) {
        throw new Error('User status not found');
      }

      const updatedStatus = { 
        ...currentStatus, 
        ...updates, 
        updatedAt: new Date() 
      };

      await this.createUserPremiumStatus(updatedStatus);
    } catch (error) {
      console.error('Error updating user premium status:', error);
      throw error;
    }
  }

  /**
   * Check if user has access to a specific feature
   */
  async hasFeatureAccess(
    userId: string, 
    featureId: string, 
    requiredPlan: 'free' | 'pro' | 'premium' = 'free'
  ): Promise<boolean> {
    try {
      const userStatus = await this.getUserPremiumStatus(userId);
      if (!userStatus) return false;

      const planHierarchy = { free: 0, pro: 1, premium: 2 };
      const userPlanLevel = planHierarchy[userStatus.planType];
      const requiredPlanLevel = planHierarchy[requiredPlan];

      return userPlanLevel >= requiredPlanLevel;
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  }

  /**
   * Upgrade user to premium plan
   */
  async upgradeUser(
    userId: string, 
    planType: 'pro' | 'premium', 
    subscriptionId?: string
  ): Promise<void> {
    try {
      const updates: Partial<UserPremiumStatus> = {
        isPremium: true,
        planType,
        updatedAt: new Date(),
      };

      if (subscriptionId) {
        updates.subscriptionId = subscriptionId;
      }

      await this.updateUserPremiumStatus(userId, updates);
    } catch (error) {
      console.error('Error upgrading user:', error);
      throw error;
    }
  }

  /**
   * Downgrade user to free plan
   */
  async downgradeUser(userId: string): Promise<void> {
    try {
      const updates: Partial<UserPremiumStatus> = {
        isPremium: false,
        planType: 'free',
        updatedAt: new Date(),
      };

      await this.updateUserPremiumStatus(userId, updates);
    } catch (error) {
      console.error('Error downgrading user:', error);
      throw error;
    }
  }

  /**
   * Clear cache for a specific user
   */
  clearUserCache(userId: string): void {
    this.userStatusCache.delete(userId);
  }

  /**
   * Clear all cache
   */
  clearAllCache(): void {
    this.userStatusCache.clear();
  }

  /**
   * TODO: Firebase Integration Methods
   * These methods will be implemented when Firebase is properly configured
   */
  
  // subscribeToPremiumStatus(userId: string, callback: (status: UserPremiumStatus | null) => void): () => void {
  //   // TODO: Implement Firebase real-time subscription
  //   return () => {};
  // }
}

export const premiumService = PremiumService.getInstance(); 