'use client';

import React, { useState } from 'react';
import { usePremiumManagement } from '@/hooks/usePremiumManagement';
import { PLAN_LIMITS, CREDIT_COSTS } from '@/lib/firebasePremiumService';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: 'wish-limit' | 'feature-access' | 'manual';
  featureId?: string;
}

export function PremiumUpgradeModal({
  isOpen,
  onClose,
  trigger = 'manual',
  featureId,
}: PremiumUpgradeModalProps) {
  const { user, usage, limits, upgradeUser, isLoading, error } =
    usePremiumManagement();
  const [selectedPackage, setSelectedPackage] = useState<
    'starter' | 'popular' | 'premium'
  >('popular');
  const [isUpgrading, setIsUpgrading] = useState(false);

  if (!isOpen) return null;

  const currentCredits = user?.credits || 0;

  const getTriggerMessage = () => {
    switch (trigger) {
      case 'wish-limit':
        return `You need credits to create premium wishes. Buy credits to continue!`;
      case 'feature-access':
        return `This feature requires credits. Buy credits to unlock it!`;
      default:
        return 'Buy credits to unlock premium features and create amazing wishes!';
    }
  };

  const handlePurchase = async () => {
    try {
      setIsUpgrading(true);
      // TODO: Implement payment processing
      // For now, just add credits directly
      console.log('Purchasing credits:', selectedPackage);
      onClose();
    } catch (error) {
      console.error('Error purchasing credits:', error);
    } finally {
      setIsUpgrading(false);
    }
  };

  const creditPackages = [
    {
      id: 'starter',
      name: 'Starter Pack',
      price: '$4.99',
      credits: 10,
      bonus: 0,
      features: [
        '10 credits',
        'Create 5 premium wishes',
        'Unlock premium animations',
        'Use premium backgrounds',
      ],
      popular: false,
    },
    {
      id: 'popular',
      name: 'Popular Pack',
      price: '$9.99',
      credits: 25,
      bonus: 5,
      features: [
        '30 credits total (25 + 5 bonus)',
        'Create 15 premium wishes',
        'All premium features',
        'HD exports',
        'Priority support',
      ],
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium Pack',
      price: '$19.99',
      credits: 60,
      bonus: 15,
      features: [
        '75 credits total (60 + 15 bonus)',
        'Create 37 premium wishes',
        'All premium features',
        'Unlimited HD exports',
        'Priority support',
        'Custom branding',
      ],
      popular: false,
    },
  ];

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='p-6 border-b border-gray-200'>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl font-bold text-gray-900'>
              Upgrade Your Plan
            </h2>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 transition-colors'
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
          <p className='text-gray-600 mt-2'>{getTriggerMessage()}</p>
        </div>

        {/* Current Credits */}
        {trigger === 'wish-limit' && (
          <div className='p-6 bg-blue-50 border-b border-blue-200'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-semibold text-blue-900'>Current Balance</h3>
                <p className='text-blue-700'>
                  {currentCredits} credits available
                </p>
              </div>
              <div className='w-24 h-2 bg-blue-200 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-blue-600 transition-all duration-300'
                  style={{
                    width: `${Math.min((currentCredits / 10) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Credit Packages */}
        <div className='p-6'>
          <div className='grid md:grid-cols-3 gap-6'>
            {creditPackages.map(pkg => (
              <div
                key={pkg.id}
                className={`relative border rounded-lg p-6 transition-all duration-200 ${
                  pkg.popular
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {pkg.popular && (
                  <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                    <span className='bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium'>
                      Most Popular
                    </span>
                  </div>
                )}

                <div className='text-center mb-6'>
                  <h3 className='text-xl font-bold text-gray-900'>
                    {pkg.name}
                  </h3>
                  <div className='mt-2'>
                    <span className='text-3xl font-bold text-gray-900'>
                      {pkg.price}
                    </span>
                    <span className='text-gray-600 ml-1'>one-time</span>
                  </div>
                  {pkg.bonus > 0 && (
                    <div className='mt-1'>
                      <span className='text-sm text-green-600 font-medium'>
                        +{pkg.bonus} bonus credits!
                      </span>
                    </div>
                  )}
                </div>

                <ul className='space-y-3 mb-6'>
                  {pkg.features.map((feature: string, index: number) => (
                    <li key={index} className='flex items-center'>
                      <svg
                        className='w-5 h-5 text-green-500 mr-3 flex-shrink-0'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      <span className='text-gray-700'>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() =>
                    setSelectedPackage(
                      pkg.id as 'starter' | 'popular' | 'premium'
                    )
                  }
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    selectedPackage === pkg.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedPackage === pkg.id ? 'Selected' : 'Select Package'}
                </button>
              </div>
            ))}
          </div>

          {/* Purchase Button */}
          <div className='mt-8 text-center'>
            <button
              onClick={handlePurchase}
              disabled={isUpgrading}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                isUpgrading
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {isUpgrading
                ? 'Processing...'
                : `Buy ${selectedPackage === 'starter' ? 'Starter' : selectedPackage === 'popular' ? 'Popular' : 'Premium'} Pack`}
            </button>
            <p className='text-sm text-gray-500 mt-2'>
              Credits never expire and can be used anytime
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-red-700'>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
