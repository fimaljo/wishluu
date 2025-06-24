'use client';

import React from 'react';

interface PremiumPropertyWrapperProps {
  children: React.ReactNode;
  isPremium?: boolean;
  premiumLabel?: string;
  upgradeMessage?: string;
  isUserPremium?: boolean;
  onUpgradeClick?: () => void;
  className?: string;
}

export function PremiumPropertyWrapper({
  children,
  isPremium = false,
  premiumLabel = 'Premium',
  upgradeMessage = 'Upgrade to access this feature',
  isUserPremium = false,
  onUpgradeClick,
  className = ''
}: PremiumPropertyWrapperProps) {
  if (!isPremium || isUserPremium) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Premium Overlay */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-[0.5px] rounded-lg z-10 flex items-center justify-center min-h-[120px]">
        <div className="text-center p-4">
          <div className="text-lg mb-2">✨</div>
          <div className="text-xs font-medium text-gray-700 mb-2">
            {premiumLabel}
          </div>
          <div className="text-xs text-gray-500 mb-3">
            {upgradeMessage}
          </div>
          <button
            onClick={onUpgradeClick}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-md hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-sm"
          >
            Upgrade
          </button>
        </div>
      </div>
      
      {/* Blurred Content */}
      <div className="filter blur-[0.5px] pointer-events-none opacity-60 min-h-[120px]">
        {children}
      </div>
    </div>
  );
}

// Premium Badge Component
export function PremiumBadge({ 
  label = 'Premium', 
  className = '' 
}: { 
  label?: string; 
  className?: string; 
}) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-full ${className}`}>
      <span>✨</span>
      {label}
    </span>
  );
}

// Premium Property Label Component
export function PremiumPropertyLabel({ 
  label, 
  isPremium = false, 
  premiumLabel = 'Premium',
  className = '' 
}: { 
  label: string; 
  isPremium?: boolean; 
  premiumLabel?: string;
  className?: string; 
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {isPremium && <PremiumBadge label={premiumLabel} />}
    </div>
  );
} 