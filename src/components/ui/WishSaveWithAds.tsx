'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { WatchAdsForCredits } from './WatchAdsForCredits';
import { usePremiumManagement } from '@/hooks/usePremiumManagement';
import { useNotification } from '@/components/ui/Notification';

interface WishSaveWithAdsProps {
  onSave: () => void;
  creditCost: number;
  className?: string;
}

export function WishSaveWithAds({
  onSave,
  creditCost,
  className = '',
}: WishSaveWithAdsProps) {
  const { user } = usePremiumManagement();
  const { showInfo, showError } = useNotification();
  const [showAdOptions, setShowAdOptions] = useState(false);

  const currentCredits = user?.credits || 0;
  const hasEnoughCredits = currentCredits >= creditCost;
  const creditsNeeded = creditCost - currentCredits;

  const handleSave = () => {
    if (hasEnoughCredits) {
      onSave();
    } else {
      setShowAdOptions(true);
    }
  };

  const handleWatchAdAndSave = () => {
    // This will be handled by the WatchAdsForCredits component
    // The user will watch an ad and get credits, then can save
    showInfo('Watch the ad to earn credits, then try saving again!');
  };

  return (
    <div className={`wish-save-with-ads ${className}`}>
      {/* Credit Status */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-sm font-medium text-blue-900'>
              Credit Balance
            </h3>
            <p className='text-lg font-bold text-blue-800'>
              {currentCredits.toFixed(2)} credits available
            </p>
          </div>
          <div className='text-right'>
            <p className='text-sm text-blue-700'>Cost: {creditCost} credits</p>
            {!hasEnoughCredits && (
              <p className='text-sm text-red-600 font-medium'>
                Need {creditsNeeded.toFixed(2)} more credits
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className='flex items-center space-x-3'>
        <Button
          variant={hasEnoughCredits ? 'primary' : 'outline'}
          size='lg'
          onClick={handleSave}
          disabled={!hasEnoughCredits}
          className={
            hasEnoughCredits
              ? 'bg-green-600 hover:bg-green-700'
              : 'border-red-300 text-red-600'
          }
        >
          {hasEnoughCredits ? '💾 Save Wish' : '❌ Insufficient Credits'}
        </Button>

        {!hasEnoughCredits && <WatchAdsForCredits />}
      </div>

      {/* Ad Options Modal */}
      {showAdOptions && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <h3 className='text-lg font-semibold mb-4'>Need More Credits?</h3>
            <p className='text-gray-600 mb-4'>
              You need {creditsNeeded.toFixed(2)} more credits to save this
              wish. Watch an ad to earn 0.5 credits!
            </p>

            <div className='space-y-3'>
              <WatchAdsForCredits />

              <Button
                variant='outline'
                onClick={() => setShowAdOptions(false)}
                className='w-full'
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Credit Earning Tips */}
      {!hasEnoughCredits && (
        <div className='mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
          <h4 className='text-sm font-medium text-yellow-800 mb-2'>
            💡 Ways to Earn Credits:
          </h4>
          <ul className='text-sm text-yellow-700 space-y-1'>
            <li>• 📺 Watch ads (+0.5 credits per ad)</li>
            <li>• 🎁 Claim monthly login bonus (+2 credits)</li>
            <li>• 💳 Buy credits with real money</li>
            <li>• ⭐ Upgrade to premium for more features</li>
          </ul>
        </div>
      )}
    </div>
  );
}

// Quick credit earning component for inline use
export function QuickCreditEarning({ className = '' }: { className?: string }) {
  return (
    <div
      className={`quick-credit-earning bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4 ${className}`}
    >
      <div className='flex items-center justify-between'>
        <div>
          <h4 className='text-sm font-medium text-orange-800'>Need Credits?</h4>
          <p className='text-xs text-orange-700'>
            Watch an ad to earn 0.5 credits
          </p>
        </div>
        <WatchAdsForCredits />
      </div>
    </div>
  );
}
