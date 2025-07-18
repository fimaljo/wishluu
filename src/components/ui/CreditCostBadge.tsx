'use client';

import React from 'react';

interface CreditCostBadgeProps {
  cost: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CreditCostBadge({
  cost,
  className = '',
  size = 'md',
}: CreditCostBadgeProps) {
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 ${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-full ${className}`}
    >
      <span>💎</span>
      {cost.toFixed(2)} credit{cost !== 1 ? 's' : ''}
    </span>
  );
}

interface CreditCostWrapperProps {
  children: React.ReactNode;
  cost: number;
  userCredits: number;
  onUseCredits?: () => void;
  className?: string;
  featureName?: string;
}

export function CreditCostWrapper({
  children,
  cost,
  userCredits,
  onUseCredits,
  className = '',
  featureName = 'this feature',
}: CreditCostWrapperProps) {
  const hasEnoughCredits = userCredits >= cost;

  if (hasEnoughCredits) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Credit Cost Overlay */}
      <div className='absolute inset-0 bg-white/90 backdrop-blur-[0.5px] rounded-lg z-10 flex items-center justify-center min-h-[120px]'>
        <div className='text-center p-4'>
          <div className='text-lg mb-2'>💎</div>
          <div className='text-xs font-medium text-gray-700 mb-2'>
            Requires {cost.toFixed(2)} credit{cost !== 1 ? 's' : ''}
          </div>
          <div className='text-xs text-gray-500 mb-2'>
            You have {userCredits.toFixed(2)} credit
            {userCredits !== 1 ? 's' : ''} available
          </div>
          <div className='text-xs text-gray-500 mb-3'>
            Need {(cost - userCredits).toFixed(2)} more credit
            {cost - userCredits !== 1 ? 's' : ''} to use {featureName}
          </div>
          <button
            onClick={onUseCredits}
            className='px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium rounded-md hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-sm'
          >
            Get Credits
          </button>
        </div>
      </div>

      {/* Blurred Content */}
      <div className='filter blur-[0.5px] pointer-events-none opacity-60 min-h-[120px]'>
        {children}
      </div>
    </div>
  );
}

interface CreditCostLabelProps {
  label: string;
  cost: number;
  className?: string;
}

export function CreditCostLabel({
  label,
  cost,
  className = '',
}: CreditCostLabelProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className='text-sm font-medium text-gray-700'>{label}</span>
      <CreditCostBadge cost={cost} />
    </div>
  );
}
