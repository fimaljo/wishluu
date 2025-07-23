'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePremiumManagement } from '@/hooks/usePremiumManagement';
import { AdsService } from '@/lib/adsService';
import {
  AdUnit,
  AdManagerState,
  UserAdPreferences,
  AdImpression,
  AdClick,
} from '@/types/ads';
import { AD_UNITS, DEFAULT_AD_PREFERENCES } from '@/config/ads';

export function useAds() {
  const { user } = useAuth();
  const { user: premiumUser } = usePremiumManagement();
  const [state, setState] = useState<AdManagerState>({
    adsEnabled: false,
    currentAdUnits: [],
    userAdPreferences: DEFAULT_AD_PREFERENCES,
    adBlockDetected: false,
    testMode: process.env.NODE_ENV === 'development',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const impressionRefs = useRef<Set<string>>(new Set());
  const clickRefs = useRef<Set<string>>(new Set());

  // Initialize ads system
  useEffect(() => {
    initializeAds();
  }, [user]);

  const initializeAds = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get user ad preferences
      let userPreferences = DEFAULT_AD_PREFERENCES;
      if (user) {
        userPreferences = await AdsService.getUserAdPreferences(user.uid);
      }

      // Detect ad blocker
      const adBlockDetected = await AdsService.detectAdBlocker();

      // Get current context
      const pageType = AdsService.getCurrentPageType();
      const deviceType = AdsService.getDeviceType();
      const isPremiumUser = premiumUser?.isPremium || false;

      // Get applicable ad units
      const applicableAdUnits = AdsService.getApplicableAdUnits(
        pageType,
        deviceType,
        isPremiumUser,
        userPreferences
      );

      setState(prev => ({
        ...prev,
        adsEnabled: userPreferences.allowAds && !adBlockDetected,
        currentAdUnits: applicableAdUnits,
        userAdPreferences: userPreferences,
        adBlockDetected,
      }));
    } catch (err) {
      console.error('Error initializing ads:', err);
      setError('Failed to initialize ads system');
    } finally {
      setIsLoading(false);
    }
  }, [user, premiumUser]);

  // Record ad impression
  const recordImpression = useCallback(
    async (adUnitId: string) => {
      if (!user || impressionRefs.current.has(adUnitId)) {
        return;
      }

      try {
        const impression: Omit<AdImpression, 'timestamp'> = {
          adUnitId,
          userId: user.uid,
          sessionId: getSessionId(),
          pageUrl: window.location.href,
          userAgent: navigator.userAgent,
          deviceType: AdsService.getDeviceType(),
          isPremiumUser: premiumUser?.isPremium || false,
          adBlockDetected: state.adBlockDetected,
        };

        await AdsService.recordImpression(impression);
        impressionRefs.current.add(adUnitId);
      } catch (err) {
        console.error('Error recording ad impression:', err);
      }
    },
    [user, premiumUser, state.adBlockDetected]
  );

  // Record ad click
  const recordClick = useCallback(
    async (adUnitId: string, revenue?: number) => {
      if (!user || clickRefs.current.has(adUnitId)) {
        return;
      }

      try {
        const click: Omit<AdClick, 'timestamp'> = {
          adUnitId,
          userId: user.uid,
          sessionId: getSessionId(),
          pageUrl: window.location.href,
          userAgent: navigator.userAgent,
          deviceType: AdsService.getDeviceType(),
          isPremiumUser: premiumUser?.isPremium || false,
          revenue,
        };

        await AdsService.recordClick(click);
        clickRefs.current.add(adUnitId);
      } catch (err) {
        console.error('Error recording ad click:', err);
      }
    },
    [user, premiumUser]
  );

  // Update user ad preferences
  const updateAdPreferences = useCallback(
    async (preferences: Partial<UserAdPreferences>) => {
      if (!user) {
        return false;
      }

      try {
        const success = await AdsService.updateUserAdPreferences(
          user.uid,
          preferences
        );
        if (success) {
          setState(prev => ({
            ...prev,
            userAdPreferences: { ...prev.userAdPreferences, ...preferences },
          }));
        }
        return success;
      } catch (err) {
        console.error('Error updating ad preferences:', err);
        return false;
      }
    },
    [user]
  );

  // Check if ad can be shown
  const canShowAd = useCallback(
    async (adUnitId: string): Promise<boolean> => {
      if (!user || !state.adsEnabled) {
        return false;
      }

      try {
        const adUnit = state.currentAdUnits.find(unit => unit.id === adUnitId);
        if (!adUnit) {
          return false;
        }

        const { maxImpressionsPerDay, maxImpressionsPerSession } =
          adUnit.conditions;
        const limitsCheck = await AdsService.checkImpressionLimits(
          user.uid,
          adUnitId,
          maxImpressionsPerDay,
          maxImpressionsPerSession
        );

        return limitsCheck.canShow;
      } catch (err) {
        console.error('Error checking if ad can be shown:', err);
        return false;
      }
    },
    [user, state.adsEnabled, state.currentAdUnits]
  );

  // Get ad unit by ID
  const getAdUnit = useCallback(
    (adUnitId: string): AdUnit | undefined => {
      return state.currentAdUnits.find(unit => unit.id === adUnitId);
    },
    [state.currentAdUnits]
  );

  // Get ads for specific position
  const getAdsForPosition = useCallback(
    (position: string): AdUnit[] => {
      return state.currentAdUnits.filter(
        unit => unit.config.position === position
      );
    },
    [state.currentAdUnits]
  );

  // Refresh ads (re-initialize)
  const refreshAds = useCallback(() => {
    initializeAds();
  }, [initializeAds]);

  // Get session ID
  const getSessionId = (): string => {
    let sessionId = sessionStorage.getItem('wishluu_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('wishluu_session_id', sessionId);
    }
    return sessionId;
  };

  return {
    // State
    adsEnabled: state.adsEnabled,
    currentAdUnits: state.currentAdUnits,
    userAdPreferences: state.userAdPreferences,
    adBlockDetected: state.adBlockDetected,
    testMode: state.testMode,
    isLoading,
    error,

    // Actions
    recordImpression,
    recordClick,
    updateAdPreferences,
    canShowAd,
    getAdUnit,
    getAdsForPosition,
    refreshAds,

    // Utilities
    getDeviceType: AdsService.getDeviceType,
    getCurrentPageType: AdsService.getCurrentPageType,
  };
}
