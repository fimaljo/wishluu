import { AdUnit, AdConfig, AdConditions } from '@/types/ads';

// Environment variables for ads
const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';
const GOOGLE_ADSENSE_CLIENT = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT;
const TEST_MODE = process.env.NODE_ENV === 'development';

// Default ad configuration
const defaultAdConfig: AdConfig = {
  enabled: ADS_ENABLED,
  network: 'google-adsense',
  adClient: GOOGLE_ADSENSE_CLIENT,
  responsive: true,
  format: 'auto',
  position: 'inline',
  frequency: 'always',
  premiumUsersExempt: true,
  testMode: TEST_MODE,
};

// Default conditions
const defaultConditions: AdConditions = {
  pageTypes: ['all'],
  userTypes: 'free',
  deviceTypes: 'all',
  maxImpressionsPerDay: 10,
  maxImpressionsPerSession: 3,
};

// Predefined ad units
export const AD_UNITS: AdUnit[] = [
  {
    id: 'header-banner',
    name: 'Header Banner',
    config: {
      ...defaultAdConfig,
      position: 'top',
      format: 'banner',
      adUnitId: process.env.NEXT_PUBLIC_ADS_HEADER_UNIT_ID,
      adSlot: 'header-banner',
    },
    conditions: {
      ...defaultConditions,
      pageTypes: ['home', 'dashboard', 'templates', 'wishes'],
    },
    analytics: {
      impressions: 0,
      clicks: 0,
      revenue: 0,
      ctr: 0,
      rpm: 0,
    },
  },
  {
    id: 'sidebar-ad',
    name: 'Sidebar Advertisement',
    config: {
      ...defaultAdConfig,
      position: 'sidebar',
      format: 'rectangle',
      adUnitId: process.env.NEXT_PUBLIC_ADS_SIDEBAR_UNIT_ID,
      adSlot: 'sidebar-ad',
    },
    conditions: {
      ...defaultConditions,
      pageTypes: ['dashboard', 'templates', 'wishes'],
      deviceTypes: 'desktop',
    },
    analytics: {
      impressions: 0,
      clicks: 0,
      revenue: 0,
      ctr: 0,
      rpm: 0,
    },
  },
  {
    id: 'content-inline',
    name: 'Content Inline Ad',
    config: {
      ...defaultAdConfig,
      position: 'inline',
      format: 'rectangle',
      adUnitId: process.env.NEXT_PUBLIC_ADS_CONTENT_UNIT_ID,
      adSlot: 'content-inline',
      frequency: 'once-per-session',
    },
    conditions: {
      ...defaultConditions,
      pageTypes: ['wishes', 'templates'],
      maxImpressionsPerSession: 1,
    },
    analytics: {
      impressions: 0,
      clicks: 0,
      revenue: 0,
      ctr: 0,
      rpm: 0,
    },
  },
  {
    id: 'footer-banner',
    name: 'Footer Banner',
    config: {
      ...defaultAdConfig,
      position: 'bottom',
      format: 'leaderboard',
      adUnitId: process.env.NEXT_PUBLIC_ADS_FOOTER_UNIT_ID,
      adSlot: 'footer-banner',
    },
    conditions: {
      ...defaultConditions,
      pageTypes: ['home', 'about', 'contact'],
    },
    analytics: {
      impressions: 0,
      clicks: 0,
      revenue: 0,
      ctr: 0,
      rpm: 0,
    },
  },
  {
    id: 'mobile-banner',
    name: 'Mobile Banner',
    config: {
      ...defaultAdConfig,
      position: 'bottom',
      format: 'banner',
      adUnitId: process.env.NEXT_PUBLIC_ADS_MOBILE_UNIT_ID,
      adSlot: 'mobile-banner',
      responsive: true,
    },
    conditions: {
      ...defaultConditions,
      pageTypes: ['all'],
      deviceTypes: 'mobile',
      maxImpressionsPerSession: 2,
    },
    analytics: {
      impressions: 0,
      clicks: 0,
      revenue: 0,
      ctr: 0,
      rpm: 0,
    },
  },
  {
    id: 'sticky-bottom',
    name: 'Sticky Bottom Ad',
    config: {
      ...defaultAdConfig,
      position: 'bottom',
      format: 'banner',
      adUnitId: process.env.NEXT_PUBLIC_ADS_STICKY_UNIT_ID,
      adSlot: 'sticky-bottom',
      frequency: 'once-per-day',
    },
    conditions: {
      ...defaultConditions,
      pageTypes: ['wishes', 'templates'],
      deviceTypes: 'mobile',
      maxImpressionsPerDay: 1,
    },
    analytics: {
      impressions: 0,
      clicks: 0,
      revenue: 0,
      ctr: 0,
      rpm: 0,
    },
  },
];

// Ad placement configuration
export const AD_PLACEMENTS: Record<
  string,
  { priority: number; responsive: boolean; className: string }
> = {
  header: {
    priority: 1,
    responsive: true,
    className: 'w-full max-w-6xl mx-auto px-4 py-2',
  },
  sidebar: {
    priority: 2,
    responsive: false,
    className: 'w-64 p-4',
  },
  content: {
    priority: 3,
    responsive: true,
    className: 'w-full max-w-4xl mx-auto my-8',
  },
  footer: {
    priority: 4,
    responsive: true,
    className: 'w-full max-w-6xl mx-auto px-4 py-4',
  },
  mobile: {
    priority: 5,
    responsive: true,
    className: 'w-full px-4 py-2',
  },
  sticky: {
    priority: 6,
    responsive: true,
    className: 'fixed bottom-0 left-0 right-0 z-50',
  },
};

// Ad frequency limits
export const AD_FREQUENCY_LIMITS = {
  'once-per-session': 1,
  'once-per-day': 1,
  always: Infinity,
  custom: 5, // Default custom limit
};

// Ad block detection settings
export const AD_BLOCK_DETECTION = {
  enabled: true,
  timeout: 3000, // 3 seconds
  testAdUrl: '/ads/test-ad.js',
  fallbackMessage:
    'Please consider disabling your ad blocker to support our free service.',
};

// Revenue sharing configuration
export const REVENUE_SHARING = {
  enabled: true,
  premiumUserShare: 0.1, // 10% of ad revenue goes to premium users
  freeUserShare: 0.05, // 5% of ad revenue goes to free users
  minimumPayout: 1.0, // $1 minimum payout
};

// Ad preferences defaults
export const DEFAULT_AD_PREFERENCES = {
  allowAds: true,
  allowPersonalizedAds: true,
  allowAnalytics: true,
  lastUpdated: new Date(),
};

// Test ad configuration
export const TEST_ADS = {
  enabled: TEST_MODE,
  adUnitId: 'ca-pub-0000000000000000',
  adClient: 'ca-pub-0000000000000000',
  adSlot: 'test-slot',
  format: 'auto',
  responsive: true,
};
