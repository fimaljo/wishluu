export interface AdConfig {
  enabled: boolean;
  network: 'google-adsense' | 'custom' | 'none';
  adUnitId?: string | undefined;
  adClient?: string | undefined;
  adSlot?: string | undefined;
  responsive?: boolean;
  format?: 'auto' | 'rectangle' | 'banner' | 'leaderboard' | 'sidebar';
  position: 'top' | 'bottom' | 'sidebar' | 'inline' | 'popup';
  frequency: 'always' | 'once-per-session' | 'once-per-day' | 'custom';
  minInterval?: number; // in seconds
  premiumUsersExempt: boolean;
  testMode: boolean;
}

export interface AdUnit {
  id: string;
  name: string;
  config: AdConfig;
  conditions: AdConditions;
  analytics: AdAnalytics;
}

export interface AdConditions {
  pageTypes: string[];
  userTypes: 'all' | 'free' | 'premium';
  deviceTypes: 'all' | 'desktop' | 'mobile' | 'tablet';
  timeOfDay?: {
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
  maxImpressionsPerDay?: number;
  maxImpressionsPerSession?: number;
}

export interface AdAnalytics {
  impressions: number;
  clicks: number;
  revenue: number;
  ctr: number; // Click-through rate
  rpm: number; // Revenue per thousand impressions
  lastImpression?: Date;
  lastClick?: Date;
}

export interface AdManagerState {
  adsEnabled: boolean;
  currentAdUnits: AdUnit[];
  userAdPreferences: UserAdPreferences;
  adBlockDetected: boolean;
  testMode: boolean;
}

export interface UserAdPreferences {
  allowAds: boolean;
  allowPersonalizedAds: boolean;
  allowAnalytics: boolean;
  lastUpdated: Date;
}

export interface AdImpression {
  adUnitId: string;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  pageUrl: string;
  userAgent: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  isPremiumUser: boolean;
  adBlockDetected: boolean;
}

export interface AdClick {
  adUnitId: string;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  pageUrl: string;
  userAgent: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  isPremiumUser: boolean;
  revenue?: number | undefined;
}

export type AdPosition =
  | 'header'
  | 'footer'
  | 'sidebar-left'
  | 'sidebar-right'
  | 'content-top'
  | 'content-bottom'
  | 'content-inline'
  | 'popup'
  | 'sticky-bottom';

export interface AdPlacement {
  position: AdPosition;
  adUnit: AdUnit;
  priority: number;
  responsive: boolean;
  className?: string;
}
