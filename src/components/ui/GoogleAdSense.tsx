'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface GoogleAdSenseProps {
  client: string;
  enabled?: boolean;
}

export function GoogleAdSense({ client, enabled = true }: GoogleAdSenseProps) {
  useEffect(() => {
    if (enabled && typeof window !== 'undefined') {
      // Initialize AdSense when component mounts
      const initAdSense = () => {
        try {
          // @ts-ignore - Google AdSense global
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
          console.error('Error initializing Google AdSense:', error);
        }
      };

      // Initialize after a short delay to ensure script is loaded
      const timer = setTimeout(initAdSense, 1000);
      return () => clearTimeout(timer);
    }
  }, [enabled]);

  if (!enabled || !client) {
    return null;
  }

  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
        crossOrigin='anonymous'
        strategy='afterInteractive'
      />
      <Script
        id='adsense-init'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            (adsbygoogle = window.adsbygoogle || []).push({});
          `,
        }}
      />
    </>
  );
}

// AdSense auto ads component
export function GoogleAdSenseAutoAds({
  client,
  enabled = true,
}: GoogleAdSenseProps) {
  if (!enabled || !client) {
    return null;
  }

  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
        crossOrigin='anonymous'
        strategy='afterInteractive'
      />
      <Script
        id='adsense-auto-ads'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            (adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: "${client}",
              enable_page_level_ads: true
            });
          `,
        }}
      />
    </>
  );
}

// AdSense responsive ads component
export function GoogleAdSenseResponsive({
  client,
  slot,
  format = 'auto',
  enabled = true,
}: {
  client: string;
  slot: string;
  format?: string;
  enabled?: boolean;
}) {
  useEffect(() => {
    if (enabled && typeof window !== 'undefined') {
      const initResponsiveAd = () => {
        try {
          // @ts-ignore - Google AdSense global
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
          console.error('Error initializing responsive ad:', error);
        }
      };

      const timer = setTimeout(initResponsiveAd, 1000);
      return () => clearTimeout(timer);
    }
  }, [enabled]);

  if (!enabled || !client || !slot) {
    return null;
  }

  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
        crossOrigin='anonymous'
        strategy='afterInteractive'
      />
      <ins
        className='adsbygoogle'
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive='true'
      />
    </>
  );
}
