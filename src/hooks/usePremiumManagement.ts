import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  firebasePremiumService,
  PremiumUserDocument,
  UserUsageDocument,
  PlanLimits,
  ServiceResponse,
} from '@/lib/firebasePremiumService';

export interface PremiumStatus {
  user: PremiumUserDocument | null;
  usage: UserUsageDocument | null;
  limits: PlanLimits | null;
  isLoading: boolean;
  error: string | null;
}

export interface PremiumActions {
  canCreateWish: () => Promise<{
    canCreate: boolean;
    reason?: string;
    limit?: number;
    used?: number;
  }>;
  incrementWishCreated: () => Promise<void>;
  hasFeatureAccess: (
    featureId: string
  ) => Promise<{ hasAccess: boolean; reason?: string }>;
  upgradeUser: (
    planType: 'pro' | 'premium',
    subscriptionId?: string
  ) => Promise<void>;
  downgradeUser: () => Promise<void>;
  refreshStatus: () => Promise<void>;
  claimMonthlyLoginBonus: () => Promise<{
    claimed: boolean;
    creditsAdded: number;
    message: string;
  }>;
}

export function usePremiumManagement(): PremiumStatus & PremiumActions {
  const { user } = useAuth();
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({
    user: null,
    usage: null,
    limits: null,
    isLoading: true,
    error: null,
  });

  const loadPremiumStatus = useCallback(async () => {
    if (!user?.uid || !user?.email) {
      setPremiumStatus(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      setPremiumStatus(prev => ({ ...prev, isLoading: true, error: null }));

      // Get premium user status
      const userResult = await firebasePremiumService.getPremiumUser(
        user.uid,
        user.email
      );
      if (!userResult.success) {
        throw new Error(userResult.error || 'Failed to load premium status');
      }

      // Get usage statistics
      const usageResult = await firebasePremiumService.getUserUsageStats(
        user.uid
      );
      if (!usageResult.success) {
        throw new Error(usageResult.error || 'Failed to load usage statistics');
      }

      setPremiumStatus({
        user: userResult.data || null,
        usage: usageResult.data?.usage || null,
        limits: usageResult.data?.limits || null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error loading premium status:', error);
      setPremiumStatus(prev => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      }));
    }
  }, [user?.uid, user?.email]);

  const canCreateWish = useCallback(async () => {
    if (!user?.uid) {
      return { canCreate: false, reason: 'User not authenticated' };
    }

    const result = await firebasePremiumService.canCreateWish(user.uid);
    if (!result.success) {
      return {
        canCreate: false,
        reason: result.error || 'Failed to check wish creation permission',
      };
    }

    return result.data || { canCreate: false, reason: 'Unknown error' };
  }, [user?.uid]);

  const incrementWishCreated = useCallback(async () => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    const result = await firebasePremiumService.incrementWishCreated(user.uid);
    if (!result.success) {
      throw new Error(result.error || 'Failed to increment wish count');
    }

    // Refresh status after incrementing
    await loadPremiumStatus();
  }, [user?.uid, loadPremiumStatus]);

  const hasFeatureAccess = useCallback(
    async (featureId: string) => {
      if (!user?.uid) {
        return { hasAccess: false, reason: 'User not authenticated' };
      }

      const result = await firebasePremiumService.hasFeatureAccess(
        user.uid,
        featureId
      );
      if (!result.success) {
        return {
          hasAccess: false,
          reason: result.error || 'Failed to check feature access',
        };
      }

      return result.data || { hasAccess: false, reason: 'Unknown error' };
    },
    [user?.uid]
  );

  const upgradeUser = useCallback(
    async (planType: 'pro' | 'premium', subscriptionId?: string) => {
      if (!user?.uid || !user?.email) {
        throw new Error('User not authenticated');
      }

      const result = await firebasePremiumService.upgradeUser(
        user.uid,
        user.email,
        planType,
        subscriptionId
      );
      if (!result.success) {
        throw new Error(result.error || 'Failed to upgrade user');
      }

      // Refresh status after upgrade
      await loadPremiumStatus();
    },
    [user?.uid, user?.email, loadPremiumStatus]
  );

  const downgradeUser = useCallback(async () => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    const result = await firebasePremiumService.downgradeUser(user.uid);
    if (!result.success) {
      throw new Error(result.error || 'Failed to downgrade user');
    }

    // Refresh status after downgrade
    await loadPremiumStatus();
  }, [user?.uid, loadPremiumStatus]);

  const refreshStatus = useCallback(async () => {
    await loadPremiumStatus();
  }, [loadPremiumStatus]);

  const claimMonthlyLoginBonus = useCallback(async () => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    const result = await firebasePremiumService.claimMonthlyLoginBonus(
      user.uid
    );
    if (!result.success) {
      throw new Error(result.error || 'Failed to claim monthly login bonus');
    }

    // Refresh status after claiming bonus
    await loadPremiumStatus();

    return (
      result.data || {
        claimed: false,
        creditsAdded: 0,
        message: 'Failed to claim bonus',
      }
    );
  }, [user?.uid, loadPremiumStatus]);

  // Load premium status when user changes
  useEffect(() => {
    loadPremiumStatus();
  }, [loadPremiumStatus]);

  return {
    ...premiumStatus,
    canCreateWish,
    incrementWishCreated,
    hasFeatureAccess,
    upgradeUser,
    downgradeUser,
    refreshStatus,
    claimMonthlyLoginBonus,
  };
}

// Convenience hook for checking if user can create wishes
export function useWishCreationPermission() {
  const { user } = useAuth();
  const [canCreate, setCanCreate] = useState<{
    canCreate: boolean;
    reason?: string;
    limit?: number;
    used?: number;
  }>({ canCreate: false });
  const [isLoading, setIsLoading] = useState(true);

  const checkPermission = useCallback(async () => {
    if (!user?.uid) {
      setCanCreate({ canCreate: false, reason: 'User not authenticated' });
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const result = await firebasePremiumService.canCreateWish(user.uid);
      if (result.success && result.data) {
        setCanCreate(result.data);
      } else {
        setCanCreate({
          canCreate: false,
          reason: result.error || 'Failed to check permission',
        });
      }
    } catch (error) {
      setCanCreate({ canCreate: false, reason: 'Error checking permission' });
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return { ...canCreate, isLoading, refresh: checkPermission };
}

// Convenience hook for checking feature access
export function useFeatureAccess(featureId: string) {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState<{
    hasAccess: boolean;
    reason?: string;
  }>({ hasAccess: false });
  const [isLoading, setIsLoading] = useState(true);

  const checkAccess = useCallback(async () => {
    if (!user?.uid) {
      setHasAccess({ hasAccess: false, reason: 'User not authenticated' });
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const result = await firebasePremiumService.hasFeatureAccess(
        user.uid,
        featureId
      );
      if (result.success && result.data) {
        setHasAccess(result.data);
      } else {
        setHasAccess({
          hasAccess: false,
          reason: result.error || 'Failed to check access',
        });
      }
    } catch (error) {
      setHasAccess({ hasAccess: false, reason: 'Error checking access' });
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, featureId]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  return { ...hasAccess, isLoading, refresh: checkAccess };
}
