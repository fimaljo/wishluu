'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAds } from '@/hooks/useAds';
import { AdUnit as AdUnitType } from '@/types/ads';
import { TEST_ADS } from '@/config/ads';

interface AdUnitProps {
  adUnit: AdUnitType;
  className?: string;
  onImpression?: () => void;
  onClick?: () => void;
}

export function AdUnit({
  adUnit,
  className = '',
  onImpression,
  onClick,
}: AdUnitProps) {
  const { recordImpression, recordClick, testMode } = useAds();
  const adRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [impressionRecorded, setImpressionRecorded] = useState(false);

  // Intersection Observer to detect when ad is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry) {
          setIsVisible(entry.isIntersecting);
        }
      },
      { threshold: 0.1 }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Record impression when ad becomes visible
  useEffect(() => {
    if (isVisible && !impressionRecorded && isLoaded) {
      recordImpression(adUnit.id);
      setImpressionRecorded(true);
      onImpression?.();
    }
  }, [
    isVisible,
    impressionRecorded,
    isLoaded,
    adUnit.id,
    recordImpression,
    onImpression,
  ]);

  // Handle ad load
  const handleAdLoad = () => {
    setIsLoaded(true);
  };

  // Handle ad click
  const handleAdClick = () => {
    recordClick(adUnit.id);
    onClick?.();
  };

  // Render test ad
  const renderTestAd = () => (
    <div
      className={`bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-lg text-center cursor-pointer hover:from-blue-600 hover:to-purple-600 transition-all duration-200 ${className}`}
      onClick={handleAdClick}
    >
      <div className='text-sm font-semibold mb-2'>🧪 Test Advertisement</div>
      <div className='text-xs opacity-90'>
        {adUnit.name} - {adUnit.config.format} ({adUnit.config.position})
      </div>
      <div className='text-xs opacity-75 mt-1'>Ad Unit ID: {adUnit.id}</div>
    </div>
  );

  // Render Google AdSense ad
  const renderGoogleAdSense = () => {
    const { adClient, adSlot, format, responsive } = adUnit.config;

    if (!adClient || !adSlot) {
      return renderTestAd();
    }

    return (
      <div
        ref={adRef}
        className={`ad-unit ${className}`}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-ad-responsive={responsive ? 'true' : 'false'}
        onLoad={handleAdLoad}
        onClick={handleAdClick}
      >
        <ins
          className='adsbygoogle'
          style={{ display: 'block' }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        />
      </div>
    );
  };

  // Render custom ad
  const renderCustomAd = () => (
    <div
      ref={adRef}
      className={`custom-ad ${className}`}
      onLoad={handleAdLoad}
      onClick={handleAdClick}
    >
      {/* Custom ad content would go here */}
      <div className='bg-gray-100 p-4 rounded-lg text-center'>
        <div className='text-sm text-gray-600'>Custom Advertisement</div>
        <div className='text-xs text-gray-500 mt-1'>{adUnit.name}</div>
      </div>
    </div>
  );

  // Determine which ad to render
  const renderAd = () => {
    if (testMode || TEST_ADS.enabled) {
      return renderTestAd();
    }

    switch (adUnit.config.network) {
      case 'google-adsense':
        return renderGoogleAdSense();
      case 'custom':
        return renderCustomAd();
      default:
        return null;
    }
  };

  if (!adUnit.config.enabled) {
    return null;
  }

  return <div className='ad-container'>{renderAd()}</div>;
}

// Ad placeholder component for loading states
export function AdPlaceholder({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gray-100 animate-pulse rounded-lg ${className}`}>
      <div className='h-20 bg-gray-200 rounded-lg'></div>
    </div>
  );
}

// Ad blocker detection component
export function AdBlockerDetector() {
  const { adBlockDetected } = useAds();

  if (!adBlockDetected) {
    return null;
  }

  return (
    <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4'>
      <div className='flex items-center'>
        <div className='flex-shrink-0'>
          <svg
            className='h-5 w-5 text-yellow-400'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
              clipRule='evenodd'
            />
          </svg>
        </div>
        <div className='ml-3'>
          <h3 className='text-sm font-medium text-yellow-800'>
            Ad Blocker Detected
          </h3>
          <div className='mt-2 text-sm text-yellow-700'>
            <p>
              We've detected that you're using an ad blocker. Please consider
              disabling it to support our free service and help us continue
              providing amazing features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
