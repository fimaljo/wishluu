import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
  increment,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

// Collection names
const PREMIUM_COLLECTION = 'premium_users';
const USAGE_COLLECTION = 'user_usage';
const FEATURES_COLLECTION = 'premium_features';
const CREDIT_TRANSACTIONS_COLLECTION = 'credit_transactions';

// Premium user document interface
export interface PremiumUserDocument {
  userId: string;
  email: string;
  planType: 'free' | 'pro' | 'premium';
  isPremium: boolean;
  credits: number; // Available credits
  totalCreditsPurchased: number; // Total credits ever purchased
  subscriptionId?: string;
  expiresAt?: any; // Firestore timestamp
  createdAt: any; // Firestore timestamp
  updatedAt: any; // Firestore timestamp
  lastBillingDate?: any; // Firestore timestamp
  nextBillingDate?: any; // Firestore timestamp
  paymentMethod?: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
}

// Credit transaction interface
export interface CreditTransactionDocument {
  id: string;
  userId: string;
  type: 'purchase' | 'usage' | 'refund' | 'bonus' | 'monthly_login';
  amount: number; // Positive for credits added, negative for credits used
  description: string;
  featureUsed?: string; // What feature was used (e.g., 'premium_wish', 'hd_export')
  wishId?: string; // Associated wish if applicable
  createdAt: any; // Firestore timestamp
}

// Credit usage tracking interface (for analytics)
export interface UserUsageDocument {
  userId: string;
  month: string; // Format: "YYYY-MM"
  wishesCreated: number;
  wishesViewed: number;
  templatesUsed: number;
  premiumFeaturesUsed: number;
  creditsUsed: number;
  monthlyLoginBonusClaimed: boolean; // Track if monthly login bonus was claimed
  lastResetDate: any; // Firestore timestamp
  createdAt: any; // Firestore timestamp
  updatedAt: any; // Firestore timestamp
}

// Premium feature interface
export interface PremiumFeatureDocument {
  id: string;
  name: string;
  description: string;
  requiredPlan: 'free' | 'pro' | 'premium';
  isActive: boolean;
  createdAt: any; // Firestore timestamp
  updatedAt: any; // Firestore timestamp
}

// Service response types
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Plan limits interface
export interface PlanLimits {
  wishesPerMonth: number;
  templatesPerMonth: number;
  premiumFeatures: string[];
  customBackgrounds: boolean;
  unlimitedElements: boolean;
  prioritySupport: boolean;
  analytics: boolean;
}

// Credit cost configuration
export const CREDIT_COSTS = {
  premium_wish: 2, // Send a premium wish
  basic_wish: 1, // Send a basic wish
  premium_animation: 1, // Unlock premium animation
  premium_background: 0.5, // Use premium background
  premium_music: 0.5, // Use premium music
  hd_export: 1, // Export HD or watermark-free
  schedule_wish: 0.5, // Schedule a wish
  custom_elements: 0.5, // Use custom elements
  priority_template: 1, // Use priority template
  template_usage: 0, // Template usage cost (will be set dynamically based on template)
};

// Welcome bonus configuration
export const WELCOME_BONUS_CREDITS = parseInt(
  process.env.NEXT_PUBLIC_WELCOME_BONUS_CREDITS || '10',
  10
);

// Plan configuration (keeping for backward compatibility)
export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    wishesPerMonth: 2,
    templatesPerMonth: 5,
    premiumFeatures: [],
    customBackgrounds: false,
    unlimitedElements: false,
    prioritySupport: false,
    analytics: false,
  },
  pro: {
    wishesPerMonth: 20,
    templatesPerMonth: 50,
    premiumFeatures: ['custom_backgrounds', 'unlimited_elements'],
    customBackgrounds: true,
    unlimitedElements: true,
    prioritySupport: false,
    analytics: false,
  },
  premium: {
    wishesPerMonth: -1, // Unlimited
    templatesPerMonth: -1, // Unlimited
    premiumFeatures: [
      'custom_backgrounds',
      'unlimited_elements',
      'priority_support',
      'analytics',
    ],
    customBackgrounds: true,
    unlimitedElements: true,
    prioritySupport: true,
    analytics: true,
  },
};

/**
 * Firebase Premium Service
 * Handles all premium-related operations including user limitations and feature access
 */
export class FirebasePremiumService {
  private static premiumCollectionRef = collection(db, PREMIUM_COLLECTION);
  private static usageCollectionRef = collection(db, USAGE_COLLECTION);
  private static featuresCollectionRef = collection(db, FEATURES_COLLECTION);
  private static creditTransactionsRef = collection(
    db,
    CREDIT_TRANSACTIONS_COLLECTION
  );

  /**
   * Get current month string in YYYY-MM format
   */
  private static getCurrentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  /**
   * Convert Firestore document to PremiumUser
   */
  private static documentToPremiumUser(doc: any): PremiumUserDocument {
    const data = doc.data();
    return {
      userId: doc.id,
      email: data.email,
      planType: data.planType || 'free',
      isPremium: data.isPremium || false,
      credits: data.credits || 0,
      totalCreditsPurchased: data.totalCreditsPurchased || 0,
      subscriptionId: data.subscriptionId,
      expiresAt: data.expiresAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      lastBillingDate: data.lastBillingDate,
      nextBillingDate: data.nextBillingDate,
      paymentMethod: data.paymentMethod,
      status: data.status || 'active',
    };
  }

  /**
   * Convert Firestore document to UserUsage
   */
  private static documentToUserUsage(doc: any): UserUsageDocument {
    const data = doc.data();
    return {
      userId: data.userId,
      month: data.month,
      wishesCreated: data.wishesCreated || 0,
      wishesViewed: data.wishesViewed || 0,
      templatesUsed: data.templatesUsed || 0,
      premiumFeaturesUsed: data.premiumFeaturesUsed || 0,
      creditsUsed: data.creditsUsed || 0,
      monthlyLoginBonusClaimed: data.monthlyLoginBonusClaimed || false,
      lastResetDate: data.lastResetDate,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  /**
   * Get or create premium user document
   */
  static async getPremiumUser(
    userId: string,
    email: string
  ): Promise<ServiceResponse<PremiumUserDocument>> {
    try {
      const docRef = doc(this.premiumCollectionRef, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const premiumUser = this.documentToPremiumUser(docSnap);
        return {
          success: true,
          data: premiumUser,
          message: 'Premium user found',
        };
      } else {
        // Create default free user with welcome credits
        const defaultUser: Omit<
          PremiumUserDocument,
          'createdAt' | 'updatedAt'
        > = {
          userId,
          email,
          planType: 'free',
          isPremium: false,
          credits: WELCOME_BONUS_CREDITS, // Give new users welcome credits
          totalCreditsPurchased: 0,
          status: 'active',
        };

        await setDoc(docRef, {
          ...defaultUser,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Create a credit transaction record for the welcome bonus
        try {
          const transactionDoc = {
            userId,
            type: 'bonus' as const,
            amount: WELCOME_BONUS_CREDITS,
            description: `Welcome bonus - ${WELCOME_BONUS_CREDITS} credits for new users`,
            createdAt: serverTimestamp(),
          };

          await addDoc(this.creditTransactionsRef, transactionDoc);
        } catch (error) {
          console.warn(
            'Failed to create welcome bonus transaction record:',
            error
          );
          // Don't fail the user creation if transaction record fails
        }

        const newDocSnap = await getDoc(docRef);
        const newPremiumUser = this.documentToPremiumUser(newDocSnap);

        return {
          success: true,
          data: newPremiumUser,
          message: `New premium user created with ${WELCOME_BONUS_CREDITS} welcome credits`,
        };
      }
    } catch (error) {
      console.error('Error getting premium user:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get or create user usage document for current month
   */
  static async getUserUsage(
    userId: string
  ): Promise<ServiceResponse<UserUsageDocument>> {
    try {
      const currentMonth = this.getCurrentMonth();
      const usageId = `${userId}_${currentMonth}`;
      const docRef = doc(this.usageCollectionRef, usageId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userUsage = this.documentToUserUsage(docSnap);
        return {
          success: true,
          data: userUsage,
          message: 'User usage found',
        };
      } else {
        // Create new usage document for current month
        const defaultUsage: Omit<UserUsageDocument, 'createdAt' | 'updatedAt'> =
          {
            userId,
            month: currentMonth,
            wishesCreated: 0,
            wishesViewed: 0,
            templatesUsed: 0,
            premiumFeaturesUsed: 0,
            creditsUsed: 0,
            monthlyLoginBonusClaimed: false,
            lastResetDate: serverTimestamp(),
          };

        await setDoc(docRef, {
          ...defaultUsage,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        const newDocSnap = await getDoc(docRef);
        const newUserUsage = this.documentToUserUsage(newDocSnap);

        return {
          success: true,
          data: newUserUsage,
          message: 'New user usage created',
        };
      }
    } catch (error) {
      console.error('Error getting user usage:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Check if user can create a new wish
   */
  static async canCreateWish(userId: string): Promise<
    ServiceResponse<{
      canCreate: boolean;
      reason?: string;
      limit?: number;
      used?: number;
    }>
  > {
    try {
      // Get premium user status
      const premiumUserResult = await this.getPremiumUser(userId, '');
      if (!premiumUserResult.success || !premiumUserResult.data) {
        return {
          success: false,
          error: 'Failed to get premium user status',
        };
      }

      const premiumUser = premiumUserResult.data;
      const planLimits = PLAN_LIMITS[premiumUser.planType];

      // Premium users have unlimited wishes
      if (premiumUser.planType === 'premium') {
        return {
          success: true,
          data: { canCreate: true },
        };
      }

      // Get current usage
      const usageResult = await this.getUserUsage(userId);
      if (!usageResult.success || !usageResult.data) {
        return {
          success: false,
          error: 'Failed to get user usage',
        };
      }

      const usage = usageResult.data;
      const canCreate = usage.wishesCreated < (planLimits?.wishesPerMonth || 2);

      return {
        success: true,
        data: {
          canCreate,
          ...(canCreate ? {} : { reason: 'Monthly wish limit reached' }),
          limit: planLimits?.wishesPerMonth || 2,
          used: usage.wishesCreated,
        },
      };
    } catch (error) {
      console.error('Error checking wish creation permission:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Increment wish creation count
   */
  static async incrementWishCreated(
    userId: string
  ): Promise<ServiceResponse<void>> {
    try {
      const currentMonth = this.getCurrentMonth();
      const usageId = `${userId}_${currentMonth}`;
      const docRef = doc(this.usageCollectionRef, usageId);

      await updateDoc(docRef, {
        wishesCreated: increment(1),
        updatedAt: serverTimestamp(),
      });

      return {
        success: true,
        message: 'Wish creation count incremented',
      };
    } catch (error) {
      console.error('Error incrementing wish creation count:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Check if user has access to a specific feature
   */
  static async hasFeatureAccess(
    userId: string,
    featureId: string
  ): Promise<ServiceResponse<{ hasAccess: boolean; reason?: string }>> {
    try {
      const premiumUserResult = await this.getPremiumUser(userId, '');
      if (!premiumUserResult.success || !premiumUserResult.data) {
        return {
          success: false,
          error: 'Failed to get premium user status',
        };
      }

      const premiumUser = premiumUserResult.data;
      const planLimits = PLAN_LIMITS[premiumUser.planType];

      // Check if feature is available in user's plan
      const hasAccess =
        planLimits?.premiumFeatures?.includes(featureId) || false;

      return {
        success: true,
        data: {
          hasAccess,
          ...(hasAccess
            ? {}
            : { reason: 'Feature not available in current plan' }),
        },
      };
    } catch (error) {
      console.error('Error checking feature access:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Upgrade user to premium plan
   */
  static async upgradeUser(
    userId: string,
    email: string,
    planType: 'pro' | 'premium',
    subscriptionId?: string
  ): Promise<ServiceResponse<PremiumUserDocument>> {
    try {
      const docRef = doc(this.premiumCollectionRef, userId);
      const now = new Date();
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month from now

      const updates: Partial<PremiumUserDocument> = {
        planType,
        isPremium: true,
        status: 'active',
        updatedAt: serverTimestamp(),
        lastBillingDate: serverTimestamp(),
        nextBillingDate: expiresAt,
      };

      if (subscriptionId) {
        updates.subscriptionId = subscriptionId;
      }

      await updateDoc(docRef, updates);

      const updatedDocSnap = await getDoc(docRef);
      const updatedUser = this.documentToPremiumUser(updatedDocSnap);

      return {
        success: true,
        data: updatedUser,
        message: 'User upgraded successfully',
      };
    } catch (error) {
      console.error('Error upgrading user:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Downgrade user to free plan
   */
  static async downgradeUser(
    userId: string
  ): Promise<ServiceResponse<PremiumUserDocument>> {
    try {
      const docRef = doc(this.premiumCollectionRef, userId);

      const updates: Partial<PremiumUserDocument> = {
        planType: 'free',
        isPremium: false,
        status: 'cancelled',
        updatedAt: serverTimestamp(),
      };

      await updateDoc(docRef, updates);

      const updatedDocSnap = await getDoc(docRef);
      const updatedUser = this.documentToPremiumUser(updatedDocSnap);

      return {
        success: true,
        data: updatedUser,
        message: 'User downgraded successfully',
      };
    } catch (error) {
      console.error('Error downgrading user:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get user's current plan limits
   */
  static async getUserPlanLimits(
    userId: string
  ): Promise<ServiceResponse<PlanLimits>> {
    try {
      const premiumUserResult = await this.getPremiumUser(userId, '');
      if (!premiumUserResult.success || !premiumUserResult.data) {
        return {
          success: false,
          error: 'Failed to get premium user status',
        };
      }

      const premiumUser = premiumUserResult.data;
      const planLimits = PLAN_LIMITS[premiumUser.planType];

      if (!planLimits) {
        return {
          success: false,
          error: 'Plan limits not found',
        };
      }

      return {
        success: true,
        data: planLimits,
        message: 'Plan limits retrieved successfully',
      };
    } catch (error) {
      console.error('Error getting user plan limits:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get user's current usage statistics
   */
  static async getUserUsageStats(
    userId: string
  ): Promise<
    ServiceResponse<{ usage: UserUsageDocument; limits: PlanLimits }>
  > {
    try {
      const [usageResult, limitsResult] = await Promise.all([
        this.getUserUsage(userId),
        this.getUserPlanLimits(userId),
      ]);

      if (!usageResult.success || !limitsResult.success) {
        return {
          success: false,
          error: 'Failed to get usage statistics',
        };
      }

      return {
        success: true,
        data: {
          usage: usageResult.data!,
          limits: limitsResult.data!,
        },
        message: 'Usage statistics retrieved successfully',
      };
    } catch (error) {
      console.error('Error getting user usage stats:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Check if user has enough credits for a feature
   */
  static async hasEnoughCredits(
    userId: string,
    feature: keyof typeof CREDIT_COSTS
  ): Promise<
    ServiceResponse<{
      hasEnough: boolean;
      required: number;
      available: number;
      reason?: string;
    }>
  > {
    try {
      const premiumUserResult = await this.getPremiumUser(userId, '');

      if (!premiumUserResult.success || !premiumUserResult.data) {
        return {
          success: false,
          error: 'Failed to get premium user status',
        };
      }

      const premiumUser = premiumUserResult.data;
      const requiredCredits = CREDIT_COSTS[feature];
      const hasEnough = premiumUser.credits >= requiredCredits;

      return {
        success: true,
        data: {
          hasEnough,
          required: requiredCredits,
          available: premiumUser.credits,
          ...(hasEnough
            ? {}
            : {
                reason: `Insufficient credits. Need ${requiredCredits}, have ${premiumUser.credits}`,
              }),
        },
      };
    } catch (error) {
      console.error('Error checking credits:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Use credits for a feature
   */
  static async useCredits(
    userId: string,
    feature: keyof typeof CREDIT_COSTS,
    description: string,
    wishId?: string
  ): Promise<ServiceResponse<void>> {
    try {
      const creditCheck = await this.hasEnoughCredits(userId, feature);

      if (!creditCheck.success || !creditCheck.data?.hasEnough) {
        return {
          success: false,
          error: creditCheck.data?.reason || 'Insufficient credits',
        };
      }

      const requiredCredits = CREDIT_COSTS[feature];
      const docRef = doc(this.premiumCollectionRef, userId);

      // Update user credits
      await updateDoc(docRef, {
        credits: increment(-requiredCredits),
        updatedAt: serverTimestamp(),
      });

      // Record transaction
      await addDoc(this.creditTransactionsRef, {
        userId,
        type: 'usage',
        amount: -requiredCredits,
        description,
        featureUsed: feature,
        wishId,
        createdAt: serverTimestamp(),
      });

      return {
        success: true,
        message: `Used ${requiredCredits} credits for ${feature}`,
      };
    } catch (error) {
      console.error('Error using credits:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Use credits for template usage (dynamic cost based on template)
   */
  static async useTemplateCredits(
    userId: string,
    templateCost: number,
    description: string,
    templateId?: string
  ): Promise<ServiceResponse<void>> {
    try {
      // Check if user has enough credits
      const premiumUserResult = await this.getPremiumUser(userId, '');

      if (!premiumUserResult.success || !premiumUserResult.data) {
        return {
          success: false,
          error: 'Failed to get premium user status',
        };
      }

      const premiumUser = premiumUserResult.data;
      const hasEnough = premiumUser.credits >= templateCost;

      if (!hasEnough) {
        return {
          success: false,
          error: `Insufficient credits. Need ${templateCost}, have ${premiumUser.credits}`,
        };
      }

      const docRef = doc(this.premiumCollectionRef, userId);

      // Update user credits
      await updateDoc(docRef, {
        credits: increment(-templateCost),
        updatedAt: serverTimestamp(),
      });

      // Record transaction
      await addDoc(this.creditTransactionsRef, {
        userId,
        type: 'usage',
        amount: -templateCost,
        description,
        featureUsed: 'template_usage',
        wishId: templateId,
        createdAt: serverTimestamp(),
      });

      return {
        success: true,
        message: `Used ${templateCost} credits for template`,
      };
    } catch (error) {
      console.error('Error using template credits:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Add credits to user account
   */
  static async addCredits(
    userId: string,
    amount: number,
    description: string,
    type: 'purchase' | 'bonus' | 'refund' | 'monthly_login' = 'purchase'
  ): Promise<ServiceResponse<void>> {
    try {
      const docRef = doc(this.premiumCollectionRef, userId);

      // Update user credits
      await updateDoc(docRef, {
        credits: increment(amount),
        totalCreditsPurchased: increment(amount),
        updatedAt: serverTimestamp(),
      });

      // Record transaction
      await addDoc(this.creditTransactionsRef, {
        userId,
        type,
        amount,
        description,
        createdAt: serverTimestamp(),
      });

      return {
        success: true,
        message: `Added ${amount} credits to account`,
      };
    } catch (error) {
      console.error('Error adding credits:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get user's credit transaction history
   */
  static async getCreditHistory(
    userId: string
  ): Promise<ServiceResponse<CreditTransactionDocument[]>> {
    try {
      const q = query(
        this.creditTransactionsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const transactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as CreditTransactionDocument[];

      return {
        success: true,
        data: transactions,
        message: 'Credit history retrieved successfully',
      };
    } catch (error) {
      console.error('Error getting credit history:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Reset monthly usage (called by admin or cron job)
   */
  static async resetMonthlyUsage(): Promise<ServiceResponse<number>> {
    try {
      const currentMonth = this.getCurrentMonth();
      const usageQuery = query(
        this.usageCollectionRef,
        where('month', '!=', currentMonth)
      );

      const querySnapshot = await getDocs(usageQuery);
      let resetCount = 0;

      const batch = writeBatch(db);
      querySnapshot.forEach(doc => {
        batch.update(doc.ref, {
          wishesCreated: 0,
          wishesViewed: 0,
          templatesUsed: 0,
          premiumFeaturesUsed: 0,
          creditsUsed: 0,
          monthlyLoginBonusClaimed: false, // Reset monthly login bonus flag
          lastResetDate: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        resetCount++;
      });

      await batch.commit();

      return {
        success: true,
        data: resetCount,
        message: `Reset usage for ${resetCount} users`,
      };
    } catch (error) {
      console.error('Error resetting monthly usage:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Claim monthly login bonus (2 credits per month)
   */
  static async claimMonthlyLoginBonus(
    userId: string
  ): Promise<
    ServiceResponse<{ claimed: boolean; creditsAdded: number; message: string }>
  > {
    try {
      // Get user usage for current month
      const usageResult = await this.getUserUsage(userId);
      if (!usageResult.success || !usageResult.data) {
        return {
          success: false,
          error: 'Failed to get user usage',
        };
      }

      const usage = usageResult.data;

      // Check if bonus already claimed this month
      if (usage.monthlyLoginBonusClaimed) {
        return {
          success: true,
          data: {
            claimed: false,
            creditsAdded: 0,
            message:
              "You've already claimed your monthly login bonus! Come back next month for more credits.",
          },
        };
      }

      // Add 2 credits to user account
      const addCreditsResult = await this.addCredits(
        userId,
        2,
        'Monthly login bonus',
        'monthly_login'
      );

      if (!addCreditsResult.success) {
        return {
          success: false,
          error: 'Failed to add credits',
        };
      }

      // Mark bonus as claimed for this month
      const currentMonth = this.getCurrentMonth();
      const usageId = `${userId}_${currentMonth}`;
      const docRef = doc(this.usageCollectionRef, usageId);

      await updateDoc(docRef, {
        monthlyLoginBonusClaimed: true,
        updatedAt: serverTimestamp(),
      });

      return {
        success: true,
        data: {
          claimed: true,
          creditsAdded: 2,
          message:
            'Monthly login bonus claimed! +2 credits added to your account.',
        },
      };
    } catch (error) {
      console.error('Error claiming monthly login bonus:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

// Export singleton instance
export const firebasePremiumService = FirebasePremiumService;
