'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePremiumManagement } from '@/hooks/usePremiumManagement';
import { WishCreationGuard, UsageDisplay } from './PremiumGuard';
import { PremiumUpgradeModal } from './PremiumUpgradeModal';

interface PremiumWishCreationProps {
  children: React.ReactNode;
  onWishCreated?: () => void;
  showUsageDisplay?: boolean;
}

export function PremiumWishCreation({
  children,
  onWishCreated,
  showUsageDisplay = true,
}: PremiumWishCreationProps) {
  const { user } = useAuth();
  const {
    canCreateWish,
    incrementWishCreated,
    user: premiumUser,
  } = usePremiumManagement();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [canCreate, setCanCreate] = useState(false);

  const handleWishCreation = async () => {
    if (!user?.uid) {
      console.log('User not authenticated');
      return;
    }

    try {
      setIsCreating(true);

      // Check if user can create a wish
      const permission = await canCreateWish();

      if (!permission.canCreate) {
        console.log('Cannot create wish:', permission.reason);
        setShowUpgradeModal(true);
        return;
      }

      // If we get here, user can create wish
      // The actual wish creation logic should be handled by the children
      // This component just tracks the usage
      await incrementWishCreated();

      // Call the callback if provided
      onWishCreated?.();
    } catch (error) {
      console.error('Error in wish creation:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpgradeClose = () => {
    setShowUpgradeModal(false);
  };

  // If user is not authenticated, show children without premium checks
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className='space-y-4'>
      {/* Usage Display */}
      {showUsageDisplay && <UsageDisplay />}

      {/* Premium Status Info */}
      {premiumUser && (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-sm font-medium text-blue-900'>
                Current Plan:{' '}
                {premiumUser.planType.charAt(0).toUpperCase() +
                  premiumUser.planType.slice(1)}
              </h3>
              <p className='text-xs text-blue-700'>
                {premiumUser.isPremium
                  ? 'Premium features unlocked'
                  : 'Upgrade for more features'}
              </p>
            </div>
            {!premiumUser.isPremium && (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className='px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors'
              >
                Upgrade
              </button>
            )}
          </div>
        </div>
      )}

      {/* Wish Creation Guard */}
      <WishCreationGuard>
        <div className='relative'>
          {isCreating && (
            <div className='absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg'>
              <div className='text-sm text-gray-600'>Creating wish...</div>
            </div>
          )}

          {/* Render children */}
          {children}
        </div>
      </WishCreationGuard>

      {/* Upgrade Modal */}
      <PremiumUpgradeModal
        isOpen={showUpgradeModal}
        onClose={handleUpgradeClose}
        trigger='wish-limit'
      />
    </div>
  );
}

// Convenience component for wish creation buttons
export function PremiumWishButton({
  children,
  onClick,
  disabled = false,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const { user } = useAuth();
  const { canCreateWish, isLoading } = usePremiumManagement();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [canCreate, setCanCreate] = useState(false);

  const handleClick = async () => {
    if (!user?.uid) {
      // Handle unauthenticated user
      return;
    }

    // Check if user can create wish
    const permission = await canCreateWish();
    if (!permission.canCreate) {
      setShowUpgradeModal(true);
      return;
    }

    // Call the original onClick handler
    onClick?.();
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={`px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors ${className}`}
      >
        {isLoading ? 'Loading...' : children}
      </button>

      <PremiumUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger='wish-limit'
      />
    </>
  );
}

// Component to show premium feature badges
export function PremiumFeatureBadge({ featureId }: { featureId: string }) {
  const { hasFeatureAccess, isLoading } = usePremiumManagement();
  const [hasAccess, setHasAccess] = useState(false);

  React.useEffect(() => {
    const checkAccess = async () => {
      const result = await hasFeatureAccess(featureId);
      setHasAccess(result.hasAccess);
    };

    if (!isLoading) {
      checkAccess();
    }
  }, [featureId, hasFeatureAccess, isLoading]);

  if (isLoading) {
    return (
      <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
        Loading...
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        hasAccess
          ? 'bg-green-100 text-green-800'
          : 'bg-yellow-100 text-yellow-800'
      }`}
    >
      {hasAccess ? '✓ Available' : '🔒 Premium'}
    </span>
  );
}
