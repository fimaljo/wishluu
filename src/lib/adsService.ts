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
  increment,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  AdUnit,
  AdImpression,
  AdClick,
  UserAdPreferences,
  AdManagerState,
} from '@/types/ads';
import { AD_UNITS, DEFAULT_AD_PREFERENCES } from '@/config/ads';

// Collection names
const AD_ANALYTICS_COLLECTION = 'ad_analytics';
const AD_IMPRESSIONS_COLLECTION = 'ad_impressions';
const AD_CLICKS_COLLECTION = 'ad_clicks';
const USER_AD_PREFERENCES_COLLECTION = 'user_ad_preferences';
const AD_BLOCK_DETECTION_COLLECTION = 'ad_block_detection';

export class AdsService {
  private static adAnalyticsRef = collection(db, AD_ANALYTICS_COLLECTION);
  private static adImpressionsRef = collection(db, AD_IMPRESSIONS_COLLECTION);
  private static adClicksRef = collection(db, AD_CLICKS_COLLECTION);
  private static userAdPreferencesRef = collection(
    db,
    USER_AD_PREFERENCES_COLLECTION
  );
  private static adBlockDetectionRef = collection(
    db,
    AD_BLOCK_DETECTION_COLLECTION
  );

  /**
   * Get user ad preferences
   */
  static async getUserAdPreferences(
    userId: string
  ): Promise<UserAdPreferences> {
    try {
      const docRef = doc(this.userAdPreferencesRef, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          allowAds: data.allowAds ?? DEFAULT_AD_PREFERENCES.allowAds,
          allowPersonalizedAds:
            data.allowPersonalizedAds ??
            DEFAULT_AD_PREFERENCES.allowPersonalizedAds,
          allowAnalytics:
            data.allowAnalytics ?? DEFAULT_AD_PREFERENCES.allowAnalytics,
          lastUpdated: data.lastUpdated?.toDate() ?? new Date(),
        };
      } else {
        // Create default preferences
        const defaultPreferences: UserAdPreferences = {
          ...DEFAULT_AD_PREFERENCES,
          lastUpdated: new Date(),
        };
        await setDoc(docRef, {
          ...defaultPreferences,
          lastUpdated: serverTimestamp(),
        });
        return defaultPreferences;
      }
    } catch (error) {
      console.error('Error getting user ad preferences:', error);
      return DEFAULT_AD_PREFERENCES;
    }
  }

  /**
   * Update user ad preferences
   */
  static async updateUserAdPreferences(
    userId: string,
    preferences: Partial<UserAdPreferences>
  ): Promise<boolean> {
    try {
      const docRef = doc(this.userAdPreferencesRef, userId);
      await updateDoc(docRef, {
        ...preferences,
        lastUpdated: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('Error updating user ad preferences:', error);
      return false;
    }
  }

  /**
   * Record ad impression
   */
  static async recordImpression(
    impression: Omit<AdImpression, 'timestamp'>
  ): Promise<boolean> {
    try {
      // Add timestamp
      const impressionWithTimestamp: AdImpression = {
        ...impression,
        timestamp: new Date(),
      };

      // Save to Firestore
      await addDoc(this.adImpressionsRef, {
        ...impressionWithTimestamp,
        timestamp: serverTimestamp(),
      });

      // Update analytics
      await this.updateAdAnalytics(impression.adUnitId, 'impression');

      return true;
    } catch (error) {
      console.error('Error recording ad impression:', error);
      return false;
    }
  }

  /**
   * Record ad click
   */
  static async recordClick(
    click: Omit<AdClick, 'timestamp'>
  ): Promise<boolean> {
    try {
      // Add timestamp
      const clickWithTimestamp: AdClick = {
        ...click,
        timestamp: new Date(),
      };

      // Save to Firestore
      await addDoc(this.adClicksRef, {
        ...clickWithTimestamp,
        timestamp: serverTimestamp(),
      });

      // Update analytics
      await this.updateAdAnalytics(click.adUnitId, 'click', click.revenue);

      return true;
    } catch (error) {
      console.error('Error recording ad click:', error);
      return false;
    }
  }

  /**
   * Update ad analytics
   */
  private static async updateAdAnalytics(
    adUnitId: string,
    type: 'impression' | 'click',
    revenue?: number
  ): Promise<void> {
    try {
      const docRef = doc(this.adAnalyticsRef, adUnitId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const updates: any = {
          lastUpdated: serverTimestamp(),
        };

        if (type === 'impression') {
          updates.impressions = increment(1);
          updates.lastImpression = serverTimestamp();
        } else if (type === 'click') {
          updates.clicks = increment(1);
          updates.lastClick = serverTimestamp();
          if (revenue) {
            updates.revenue = increment(revenue);
          }
        }

        await updateDoc(docRef, updates);
      } else {
        // Create new analytics document
        const analytics = {
          adUnitId,
          impressions: type === 'impression' ? 1 : 0,
          clicks: type === 'click' ? 1 : 0,
          revenue: type === 'click' && revenue ? revenue : 0,
          ctr: 0,
          rpm: 0,
          lastImpression: type === 'impression' ? serverTimestamp() : null,
          lastClick: type === 'click' ? serverTimestamp() : null,
          createdAt: serverTimestamp(),
          lastUpdated: serverTimestamp(),
        };

        await setDoc(docRef, analytics);
      }
    } catch (error) {
      console.error('Error updating ad analytics:', error);
    }
  }

  /**
   * Get ad analytics for a specific ad unit
   */
  static async getAdAnalytics(adUnitId: string): Promise<any> {
    try {
      const docRef = doc(this.adAnalyticsRef, adUnitId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting ad analytics:', error);
      return null;
    }
  }

  /**
   * Get all ad analytics
   */
  static async getAllAdAnalytics(): Promise<any[]> {
    try {
      const q = query(this.adAnalyticsRef, orderBy('lastUpdated', 'desc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting all ad analytics:', error);
      return [];
    }
  }

  /**
   * Check if user has reached impression limits
   */
  static async checkImpressionLimits(
    userId: string,
    adUnitId: string,
    maxImpressionsPerDay?: number,
    maxImpressionsPerSession?: number
  ): Promise<{ canShow: boolean; reason?: string }> {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const sessionId = this.getSessionId();

      // Check daily limits
      if (maxImpressionsPerDay) {
        const dailyQuery = query(
          this.adImpressionsRef,
          where('userId', '==', userId),
          where('adUnitId', '==', adUnitId),
          where('timestamp', '>=', Timestamp.fromDate(today))
        );
        const dailySnapshot = await getDocs(dailyQuery);

        if (dailySnapshot.size >= maxImpressionsPerDay) {
          return { canShow: false, reason: 'Daily impression limit reached' };
        }
      }

      // Check session limits
      if (maxImpressionsPerSession) {
        const sessionQuery = query(
          this.adImpressionsRef,
          where('sessionId', '==', sessionId),
          where('adUnitId', '==', adUnitId)
        );
        const sessionSnapshot = await getDocs(sessionQuery);

        if (sessionSnapshot.size >= maxImpressionsPerSession) {
          return { canShow: false, reason: 'Session impression limit reached' };
        }
      }

      return { canShow: true };
    } catch (error) {
      console.error('Error checking impression limits:', error);
      return { canShow: true }; // Default to allowing if error
    }
  }

  /**
   * Detect ad blocker
   */
  static async detectAdBlocker(): Promise<boolean> {
    try {
      const testAdUrl = '/ads/test-ad.js';
      const startTime = Date.now();

      // Try to load a test ad
      const response = await fetch(testAdUrl, {
        method: 'HEAD',
        cache: 'no-cache',
      });

      const loadTime = Date.now() - startTime;

      // If response is blocked or takes too long, ad blocker is likely present
      if (!response.ok || loadTime > 5000) {
        await this.recordAdBlockDetection();
        return true;
      }

      return false;
    } catch (error) {
      // If fetch fails, ad blocker is likely present
      await this.recordAdBlockDetection();
      return true;
    }
  }

  /**
   * Record ad block detection
   */
  private static async recordAdBlockDetection(): Promise<void> {
    try {
      await addDoc(this.adBlockDetectionRef, {
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error recording ad block detection:', error);
    }
  }

  /**
   * Get session ID (simple implementation)
   */
  private static getSessionId(): string {
    let sessionId = sessionStorage.getItem('wishluu_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('wishluu_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Get device type
   */
  static getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    const userAgent = navigator.userAgent.toLowerCase();

    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    }

    if (
      /mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(
        userAgent
      )
    ) {
      return 'mobile';
    }

    return 'desktop';
  }

  /**
   * Get current page type
   */
  static getCurrentPageType(): string {
    const pathname = window.location.pathname;

    if (pathname === '/') return 'home';
    if (pathname.startsWith('/dashboard')) return 'dashboard';
    if (pathname.startsWith('/templates')) return 'templates';
    if (pathname.startsWith('/wishes')) return 'wishes';
    if (pathname.startsWith('/about')) return 'about';
    if (pathname.startsWith('/contact')) return 'contact';

    return 'other';
  }

  /**
   * Get applicable ad units for current context
   */
  static getApplicableAdUnits(
    pageType: string,
    deviceType: string,
    isPremiumUser: boolean,
    userPreferences: UserAdPreferences
  ): AdUnit[] {
    if (!userPreferences.allowAds) {
      return [];
    }

    return AD_UNITS.filter(adUnit => {
      const { conditions, config } = adUnit;

      // Check if ads are enabled
      if (!config.enabled) return false;

      // Check if premium users are exempt
      if (config.premiumUsersExempt && isPremiumUser) return false;

      // Check page type
      if (
        !conditions.pageTypes.includes('all') &&
        !conditions.pageTypes.includes(pageType)
      ) {
        return false;
      }

      // Check user type
      if (
        conditions.userTypes !== 'all' &&
        ((conditions.userTypes === 'free' && isPremiumUser) ||
          (conditions.userTypes === 'premium' && !isPremiumUser))
      ) {
        return false;
      }

      // Check device type
      if (
        conditions.deviceTypes !== 'all' &&
        conditions.deviceTypes !== deviceType
      ) {
        return false;
      }

      return true;
    });
  }
}
