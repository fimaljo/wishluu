'use client';

import React from 'react';
import {
  HeaderAd,
  FooterAd,
  ContentAd,
  SidebarAd,
  MobileAd,
  StickyBottomAd,
  InlineAd,
} from '@/components/ui/AdPlacement';
import { AdBlockerDetector } from '@/components/ui/AdUnit';
import { useAds } from '@/hooks/useAds';
import { Button } from '@/components/ui/Button';

export default function TestAdsPage() {
  const {
    adsEnabled,
    adBlockDetected,
    testMode,
    isLoading,
    error,
    refreshAds,
  } = useAds();

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            Ads System Test Page
          </h1>
          <p className='text-gray-600 mb-4'>
            This page demonstrates the ads system functionality and different ad
            placements.
          </p>

          {/* Status Information */}
          <div className='bg-white rounded-lg p-6 mb-6'>
            <h2 className='text-lg font-semibold mb-4'>System Status</h2>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div>
                <span className='text-sm text-gray-500'>Ads Enabled:</span>
                <div
                  className={`inline-block ml-2 px-2 py-1 rounded text-xs font-medium ${
                    adsEnabled
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {adsEnabled ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <span className='text-sm text-gray-500'>Test Mode:</span>
                <div
                  className={`inline-block ml-2 px-2 py-1 rounded text-xs font-medium ${
                    testMode
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {testMode ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <span className='text-sm text-gray-500'>Ad Blocker:</span>
                <div
                  className={`inline-block ml-2 px-2 py-1 rounded text-xs font-medium ${
                    adBlockDetected
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {adBlockDetected ? 'Detected' : 'Not Detected'}
                </div>
              </div>
              <div>
                <span className='text-sm text-gray-500'>Loading:</span>
                <div
                  className={`inline-block ml-2 px-2 py-1 rounded text-xs font-medium ${
                    isLoading
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {isLoading ? 'Yes' : 'No'}
                </div>
              </div>
            </div>

            {error && (
              <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
                <p className='text-red-800 text-sm'>Error: {error}</p>
              </div>
            )}

            <Button onClick={refreshAds} className='mt-4'>
              Refresh Ads
            </Button>
          </div>
        </div>

        {/* Ad Blocker Detection */}
        <div className='mb-8'>
          <AdBlockerDetector />
        </div>

        {/* Header Ad */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>Header Advertisement</h2>
          <HeaderAd />
        </div>

        {/* Main Content with Sidebar */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8'>
          {/* Main Content */}
          <div className='lg:col-span-3'>
            <div className='bg-white rounded-lg p-6 mb-6'>
              <h2 className='text-xl font-semibold mb-4'>Main Content Area</h2>
              <p className='text-gray-600 mb-4'>
                This is the main content area. You can place inline ads within
                your content here.
              </p>

              {/* Inline Ad */}
              <div className='my-8'>
                <h3 className='text-lg font-medium mb-2'>
                  Inline Advertisement
                </h3>
                <InlineAd />
              </div>

              <p className='text-gray-600'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>

            {/* Content Ad */}
            <div className='bg-white rounded-lg p-6'>
              <h2 className='text-xl font-semibold mb-4'>
                Content Advertisement
              </h2>
              <ContentAd />
            </div>
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg p-6'>
              <h2 className='text-xl font-semibold mb-4'>Sidebar</h2>
              <p className='text-gray-600 mb-4'>
                Sidebar content with advertisement placement.
              </p>
              <SidebarAd />
            </div>
          </div>
        </div>

        {/* Mobile Ad */}
        <div className='mb-8 md:hidden'>
          <h2 className='text-xl font-semibold mb-4'>Mobile Advertisement</h2>
          <MobileAd />
        </div>

        {/* Footer Ad */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>Footer Advertisement</h2>
          <FooterAd />
        </div>

        {/* Sticky Bottom Ad */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>
            Sticky Bottom Advertisement
          </h2>
          <p className='text-gray-600 mb-4'>
            This ad appears at the bottom of the page and sticks to the viewport
            on mobile devices.
          </p>
          <StickyBottomAd />
        </div>

        {/* Instructions */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
          <h2 className='text-lg font-semibold text-blue-900 mb-4'>
            How to Test
          </h2>
          <ul className='text-blue-800 space-y-2'>
            <li>• Check the system status above to see if ads are enabled</li>
            <li>
              • In development mode, you'll see colorful test ad placeholders
            </li>
            <li>• Test on different devices to see mobile-specific ads</li>
            <li>• Try enabling/disabling your ad blocker to test detection</li>
            <li>• Check the admin dashboard at /admin/ads for analytics</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
