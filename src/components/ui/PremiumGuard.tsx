'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWishCreationPermission } from '@/hooks/usePremiumManagement';
import { PremiumUpgradeModal } from './PremiumUpgradeModal';

interface PremiumGuardProps {
  children: React.ReactNode;
  onPermissionDenied?: () => void;
  showUpgradePrompt?: boolean;
  trigger?: 'wish-limit' | 'feature-access' | 'manual';
  featureId?: string;
}

export function PremiumGuard({
  children,
  onPermissionDenied,
  showUpgradePrompt = true,
  trigger = 'manual',
  featureId,
}: PremiumGuardProps) {
  const { user } = useAuth();
  const { canCreate, reason, limit, used, isLoading, refresh } =
    useWishCreationPermission();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    if (!canCreate && reason && showUpgradePrompt) {
      setShowUpgradeModal(true);
    }
  }, [canCreate, reason, showUpgradePrompt]);

  const handleUpgradeClose = () => {
    setShowUpgradeModal(false);
    refresh();
  };

  // If user is not authenticated, show children (they'll be prompted to sign in elsewhere)
  if (!user) {
    return <>{children}</>;
  }

  // If still loading, show children
  if (isLoading) {
    return <>{children}</>;
  }

  // If user can create wishes, show children
  if (canCreate) {
    return <>{children}</>;
  }

  // If user cannot create wishes and we shouldn't show upgrade prompt
  if (!showUpgradePrompt) {
    onPermissionDenied?.();
    return null;
  }

  // Show upgrade modal and children (children will be disabled/blocked)
  return (
    <>
      {children}
      <PremiumUpgradeModal
        isOpen={showUpgradeModal}
        onClose={handleUpgradeClose}
        trigger={trigger}
        {...(featureId && { featureId })}
      />
    </>
  );
}

// Specialized component for wish creation
export function WishCreationGuard({ children }: { children: React.ReactNode }) {
  return (
    <PremiumGuard trigger='wish-limit' showUpgradePrompt={true}>
      {children}
    </PremiumGuard>
  );
}

// Specialized component for feature access
export function FeatureAccessGuard({
  children,
  featureId,
}: {
  children: React.ReactNode;
  featureId: string;
}) {
  return (
    <PremiumGuard
      trigger='feature-access'
      featureId={featureId}
      showUpgradePrompt={true}
    >
      {children}
    </PremiumGuard>
  );
}

// Component that shows usage information
export function UsageDisplay() {
  const { user } = useAuth();
  const { canCreate, limit, used, isLoading } = useWishCreationPermission();

  if (!user || isLoading) {
    return null;
  }

  const usagePercentage =
    limit && used ? Math.min((used / limit) * 100, 100) : 0;
  const isNearLimit = usagePercentage >= 80;
  const isAtLimit = usagePercentage >= 100;

  return (
    <div className='bg-white rounded-lg p-4 shadow-sm border'>
      <div className='flex items-center justify-between mb-2'>
        <h3 className='text-sm font-medium text-gray-900'>Monthly Usage</h3>
        <span className='text-xs text-gray-500'>
          {used} of {limit === -1 ? '∞' : limit} wishes
        </span>
      </div>

      <div className='w-full bg-gray-200 rounded-full h-2 mb-2'>
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isAtLimit
              ? 'bg-red-500'
              : isNearLimit
                ? 'bg-yellow-500'
                : 'bg-green-500'
          }`}
          style={{ width: `${usagePercentage}%` }}
        />
      </div>

      {isAtLimit && (
        <p className='text-xs text-red-600 font-medium'>
          Monthly limit reached. Upgrade to create more wishes!
        </p>
      )}

      {isNearLimit && !isAtLimit && (
        <p className='text-xs text-yellow-600'>
          You're approaching your monthly limit.
        </p>
      )}
    </div>
  );
}
