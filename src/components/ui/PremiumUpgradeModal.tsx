'use client';

import React, { useState } from 'react';
import { usePremiumManagement } from '@/hooks/usePremiumManagement';
import { usePayment } from '@/hooks/usePayment';
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
  const {
    purchaseCredits,
    isProcessing,
    error: paymentError,
    getAllPackages,
  } = usePayment();

  if (!isOpen) return null;

  const currentCredits = user?.credits || 0;
  const creditPackages = getAllPackages().map(pkg => ({
    ...pkg,
    price: `$${(pkg.price / 100).toFixed(2)}`, // Convert cents to dollars
  }));

  const getTriggerMessage = () => {
    switch (trigger) {
      case 'wish-limit':
        return `You need credits to create premium wishes. Choose a plan to continue!`;
      case 'feature-access':
        return `This feature requires credits. Choose a plan to unlock it!`;
      default:
        return 'Choose a plan to unlock premium features and create amazing wishes!';
    }
  };

  return (
    <div className='fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-200'>
        {/* Header */}
        <div className='p-10 border-b border-gray-200 bg-gradient-to-br from-purple-50 via-white to-pink-50'>
          <div className='flex justify-between items-start'>
            <div className='flex-1'>
              <div className='flex items-center space-x-4 mb-4'>
                <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                    />
                  </svg>
                </div>
                <div>
                  <h2 className='text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2'>
                    Choose Your Plan
                  </h2>
                  <p className='text-gray-600 text-xl leading-relaxed font-medium'>
                    {getTriggerMessage()}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 transition-all duration-200 p-3 hover:bg-gray-100 rounded-xl'
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
        </div>

        {/* Credit Packages */}
        <div className='p-10'>
          <div className='grid md:grid-cols-3 gap-10'>
            {creditPackages.map(pkg => (
              <div
                key={pkg.id}
                className={`relative group transition-all duration-500 ${
                  pkg.popular ? 'transform scale-105' : 'hover:scale-102'
                }`}
              >
                {pkg.popular && (
                  <div className='absolute -top-5 left-1/2 transform -translate-x-1/2 z-10'>
                    <span className='bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl border border-purple-500'>
                      ⭐ Most Popular
                    </span>
                  </div>
                )}

                <div
                  className={`relative h-full rounded-3xl p-10 transition-all duration-500 flex flex-col ${
                    pkg.popular
                      ? 'bg-gradient-to-br from-purple-50 via-white to-pink-50 border-2 border-purple-300 shadow-2xl'
                      : 'bg-white border-2 border-gray-200 hover:border-purple-300 shadow-xl hover:shadow-2xl'
                  }`}
                >
                  <div className='text-center mb-10'>
                    <h3
                      className={`text-3xl font-bold mb-6 ${
                        pkg.popular
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
                          : 'text-gray-900'
                      }`}
                    >
                      {pkg.name}
                    </h3>
                    <div className='mb-4'>
                      <span className='text-5xl font-bold text-gray-900'>
                        {pkg.price}
                      </span>
                    </div>
                    {pkg.bonus > 0 && (
                      <div className='inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold border border-green-200'>
                        🎁 +{pkg.bonus} bonus credits
                      </div>
                    )}
                  </div>

                  <ul className='space-y-5 mb-10 flex-grow'>
                    {pkg.features.map((feature: string, index: number) => (
                      <li key={index} className='flex items-start space-x-4'>
                        <div className='w-7 h-7 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-green-200'>
                          <svg
                            className='w-4 h-4 text-green-600'
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
                        </div>
                        <span className='text-gray-700 leading-relaxed text-lg font-medium'>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={async () => {
                      try {
                        const result = await purchaseCredits(pkg.id as any);
                        if (result.success) {
                          onClose();
                        }
                      } catch (error) {
                        console.error('Error purchasing credits:', error);
                      }
                    }}
                    disabled={isProcessing}
                    className={`w-full py-5 px-8 rounded-2xl font-bold text-xl transition-all duration-300 mt-auto ${
                      isProcessing
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : pkg.popular
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-xl hover:shadow-2xl transform hover:-translate-y-1'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-lg border border-gray-300'
                    }`}
                  >
                    {isProcessing ? (
                      <div className='flex items-center justify-center space-x-3'>
                        <div className='w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin'></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      `Get ${pkg.name} Plan`
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Error Messages */}
          {(error || paymentError) && (
            <div className='mt-8 p-6 bg-red-50 border border-red-200 rounded-2xl'>
              <div className='flex items-center space-x-4'>
                <div className='w-8 h-8 bg-red-100 rounded-full flex items-center justify-center border border-red-200'>
                  <svg
                    className='w-5 h-5 text-red-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                    />
                  </svg>
                </div>
                <p className='text-red-800 font-semibold text-lg'>
                  {error || paymentError}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
