'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { useAds } from '@/hooks/useAds';
import { usePremiumManagement } from '@/hooks/usePremiumManagement';
import { useNotification } from '@/components/ui/Notification';

interface WatchAdsForCreditsProps {
  className?: string;
}

export function WatchAdsForCredits({
  className = '',
}: WatchAdsForCreditsProps) {
  const { recordImpression, recordClick } = useAds();
  const { addCredits } = usePremiumManagement();
  const { showInfo, showError, showSuccess } = useNotification();

  const [isWatching, setIsWatching] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const [canWatch, setCanWatch] = useState(true);
  const [lastWatchTime, setLastWatchTime] = useState<number>(0);

  // Check if user can watch ads (once per 5 minutes)
  useEffect(() => {
    const lastWatch = localStorage.getItem('lastAdWatchTime');
    if (lastWatch) {
      const timeSinceLastWatch = Date.now() - parseInt(lastWatch);
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

      if (timeSinceLastWatch < fiveMinutes) {
        setCanWatch(false);
        const remainingTime = Math.ceil(
          (fiveMinutes - timeSinceLastWatch) / 1000 / 60
        );
        setWatchTime(remainingTime);
      }
    }
  }, []);

  const startWatchingAd = async () => {
    if (!canWatch) return;

    setIsWatching(true);
    setWatchTime(30); // 30 seconds ad

    // Simulate watching an ad
    const adInterval = setInterval(() => {
      setWatchTime(prev => {
        if (prev <= 1) {
          clearInterval(adInterval);
          completeAdWatch();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Record ad impression
    try {
      await recordImpression('watch-ads-for-credits');
    } catch (error) {
      console.error('Error recording ad impression:', error);
    }
  };

  const completeAdWatch = async () => {
    setIsWatching(false);

    try {
      // Record ad click (completion)
      await recordClick('watch-ads-for-credits', 0.1); // $0.10 revenue

      // Add credits to user account
      const creditsEarned = 0.5; // 0.5 credits per ad
      const result = await addCredits(creditsEarned, 'Watched advertisement');

      if (result.success) {
        showSuccess(`🎉 Earned ${creditsEarned} credits for watching an ad!`);

        // Update last watch time
        localStorage.setItem('lastAdWatchTime', Date.now().toString());
        setLastWatchTime(Date.now());
        setCanWatch(false);

        // Reset can watch after 5 minutes
        setTimeout(
          () => {
            setCanWatch(true);
            setWatchTime(0);
          },
          5 * 60 * 1000
        );
      } else {
        showError('Failed to add credits. Please try again.');
      }
    } catch (error) {
      console.error('Error completing ad watch:', error);
      showError('Something went wrong. Please try again.');
    }
  };

  const skipAd = () => {
    setIsWatching(false);
    setWatchTime(0);
    showInfo('Ad skipped. No credits earned.');
  };

  if (isWatching) {
    return (
      <div
        className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-4 ${className}`}
      >
        <div className='text-center'>
          <div className='text-2xl mb-2'>📺</div>
          <h3 className='font-semibold mb-2'>Watching Advertisement</h3>
          <div className='text-3xl font-bold mb-4'>{watchTime}s</div>

          {/* Progress bar */}
          <div className='w-full bg-white bg-opacity-20 rounded-full h-2 mb-4'>
            <div
              className='bg-white h-2 rounded-full transition-all duration-1000'
              style={{ width: `${((30 - watchTime) / 30) * 100}%` }}
            ></div>
          </div>

          <p className='text-sm opacity-90 mb-4'>
            Watch the full ad to earn 0.5 credits
          </p>

          <Button
            variant='outline'
            size='sm'
            onClick={skipAd}
            className='border-white text-white hover:bg-white hover:text-blue-600'
          >
            Skip Ad
          </Button>
        </div>
      </div>
    );
  }

  if (!canWatch) {
    const minutes = Math.floor(watchTime);
    const seconds = Math.round((watchTime - minutes) * 60);

    return (
      <Button
        variant='outline'
        size='sm'
        disabled
        className={`border-gray-300 text-gray-500 cursor-not-allowed ${className}`}
        title={`You can watch another ad in ${minutes}m ${seconds}s`}
      >
        ⏳ Watch Ad ({minutes}m {seconds}s)
      </Button>
    );
  }

  return (
    <Button
      variant='outline'
      size='sm'
      className='border-orange-500 text-orange-600 hover:bg-orange-50 hover:border-orange-600'
      onClick={startWatchingAd}
    >
      📺 Watch Ad (+0.5 credits)
    </Button>
  );
}

// Ad completion modal component
export function AdCompletionModal({
  isOpen,
  onClose,
  creditsEarned,
}: {
  isOpen: boolean;
  onClose: () => void;
  creditsEarned: number;
}) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 max-w-sm w-full mx-4 text-center'>
        <div className='text-4xl mb-4'>🎉</div>
        <h3 className='text-xl font-bold mb-2'>Congratulations!</h3>
        <p className='text-gray-600 mb-4'>
          You earned{' '}
          <span className='font-bold text-green-600'>
            {creditsEarned} credits
          </span>{' '}
          for watching the ad!
        </p>
        <Button onClick={onClose} className='w-full'>
          Continue
        </Button>
      </div>
    </div>
  );
}
