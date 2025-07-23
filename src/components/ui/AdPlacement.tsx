'use client';

import React, { useEffect, useState } from 'react';
import { useAds } from '@/hooks/useAds';
import { AdUnit as AdUnitComponent, AdPlaceholder } from './AdUnit';
import { AD_PLACEMENTS } from '@/config/ads';

interface AdPlacementProps {
  position: 'header' | 'sidebar' | 'content' | 'footer' | 'mobile' | 'sticky';
  className?: string;
  maxAds?: number;
}

export function AdPlacement({
  position,
  className = '',
  maxAds = 1,
}: AdPlacementProps) {
  const { adsEnabled, getAdsForPosition, canShowAd, isLoading, error } =
    useAds();
  const [availableAds, setAvailableAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAds = async () => {
      if (!adsEnabled) {
        setAvailableAds([]);
        setLoading(false);
        return;
      }

      try {
        const ads = getAdsForPosition(position);
        const filteredAds = [];

        for (const ad of ads.slice(0, maxAds)) {
          const canShow = await canShowAd(ad.id);
          if (canShow) {
            filteredAds.push(ad);
          }
        }

        setAvailableAds(filteredAds);
      } catch (err) {
        console.error('Error loading ads:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAds();
  }, [adsEnabled, position, maxAds, getAdsForPosition, canShowAd]);

  if (!adsEnabled || loading || isLoading) {
    return (
      <AdPlaceholder
        className={AD_PLACEMENTS[position]?.className || className}
      />
    );
  }

  if (error) {
    return null; // Don't show error state to users
  }

  if (availableAds.length === 0) {
    return null;
  }

  const placementConfig = AD_PLACEMENTS[position];

  return (
    <div
      className={`ad-placement ad-placement-${position} ${placementConfig?.className || className || ''}`}
    >
      {availableAds.map(ad => (
        <AdUnitComponent key={ad.id} adUnit={ad} className='mb-4 last:mb-0' />
      ))}
    </div>
  );
}

// Header ad placement
export function HeaderAd() {
  return <AdPlacement position='header' />;
}

// Sidebar ad placement
export function SidebarAd() {
  return <AdPlacement position='sidebar' />;
}

// Content ad placement
export function ContentAd() {
  return <AdPlacement position='content' />;
}

// Footer ad placement
export function FooterAd() {
  return <AdPlacement position='footer' />;
}

// Mobile ad placement
export function MobileAd() {
  return <AdPlacement position='mobile' />;
}

// Sticky bottom ad placement
export function StickyBottomAd() {
  return <AdPlacement position='sticky' />;
}

// Inline content ad (for use within content)
export function InlineAd({ className = '' }: { className?: string }) {
  const { adsEnabled, getAdsForPosition, canShowAd, isLoading } = useAds();
  const [adUnit, setAdUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInlineAd = async () => {
      if (!adsEnabled) {
        setAdUnit(null);
        setLoading(false);
        return;
      }

      try {
        const inlineAds = getAdsForPosition('inline');
        if (inlineAds.length > 0 && inlineAds[0]) {
          const canShow = await canShowAd(inlineAds[0].id);
          if (canShow) {
            setAdUnit(inlineAds[0]);
          }
        }
      } catch (err) {
        console.error('Error loading inline ad:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInlineAd();
  }, [adsEnabled, getAdsForPosition, canShowAd]);

  if (!adsEnabled || loading || isLoading || !adUnit) {
    return null;
  }

  return (
    <div className={`inline-ad my-8 ${className}`}>
      <AdUnitComponent adUnit={adUnit} />
    </div>
  );
}

// Responsive ad container
export function ResponsiveAdContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getDeviceType } = useAds();
  const deviceType = getDeviceType();

  return (
    <div className={`responsive-ad-container ${deviceType}`}>{children}</div>
  );
}

// Ad preferences component
export function AdPreferences() {
  const { userAdPreferences, updateAdPreferences } = useAds();
  const [preferences, setPreferences] = useState(userAdPreferences);
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePreferenceChange = async (
    key: keyof typeof userAdPreferences,
    value: boolean
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      await updateAdPreferences(preferences);
    } catch (error) {
      console.error('Error updating ad preferences:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className='ad-preferences bg-white rounded-lg p-6 shadow-sm border'>
      <h3 className='text-lg font-semibold mb-4'>Ad Preferences</h3>

      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <label className='text-sm font-medium text-gray-700'>
              Show Advertisements
            </label>
            <p className='text-xs text-gray-500'>
              Allow ads to be displayed on this site
            </p>
          </div>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              className='sr-only peer'
              checked={preferences.allowAds}
              onChange={e =>
                handlePreferenceChange('allowAds', e.target.checked)
              }
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className='flex items-center justify-between'>
          <div>
            <label className='text-sm font-medium text-gray-700'>
              Personalized Ads
            </label>
            <p className='text-xs text-gray-500'>
              Show ads based on your interests
            </p>
          </div>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              className='sr-only peer'
              checked={preferences.allowPersonalizedAds}
              onChange={e =>
                handlePreferenceChange('allowPersonalizedAds', e.target.checked)
              }
              disabled={!preferences.allowAds}
            />
            <div
              className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${!preferences.allowAds ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-200'}`}
            ></div>
          </label>
        </div>

        <div className='flex items-center justify-between'>
          <div>
            <label className='text-sm font-medium text-gray-700'>
              Analytics
            </label>
            <p className='text-xs text-gray-500'>
              Help us improve by sharing usage data
            </p>
          </div>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              className='sr-only peer'
              checked={preferences.allowAnalytics}
              onChange={e =>
                handlePreferenceChange('allowAnalytics', e.target.checked)
              }
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className='mt-6 pt-4 border-t'>
        <button
          onClick={handleSave}
          disabled={isUpdating}
          className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        >
          {isUpdating ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}
