'use client';

import React, { useState } from 'react';
import { CustomWishBuilder } from '@/features/wish-builder/components/CustomWishBuilder';

export default function PremiumDemoPage() {
  const [isUserPremium, setIsUserPremium] = useState(false);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white border-b'>
        <div className='max-w-7xl mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                Premium Features Demo
              </h1>
              <p className='text-gray-600'>Test the premium property system</p>
            </div>
            <div className='flex items-center gap-4'>
              <div className='text-sm text-gray-600'>
                Current Status:
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    isUserPremium
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {isUserPremium ? 'Premium User' : 'Free User'}
                </span>
              </div>
              <button
                onClick={() => setIsUserPremium(!isUserPremium)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isUserPremium
                    ? 'bg-gray-500 text-white hover:bg-gray-600'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                }`}
              >
                {isUserPremium ? 'Switch to Free' : 'Switch to Premium'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Instructions */}
      <div className='max-w-7xl mx-auto px-4 py-6'>
        <div className='bg-white rounded-lg shadow-sm border p-6 mb-6'>
          <h2 className='text-lg font-semibold text-gray-800 mb-4'>
            How to Test Premium Features:
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <h3 className='font-medium text-gray-700 mb-2'>
                As a Free User:
              </h3>
              <ul className='text-sm text-gray-600 space-y-1'>
                <li>• Premium elements show ✨ badges</li>
                <li>• Premium properties are blurred with upgrade overlay</li>
                <li>• Premium font options show ✨ in dropdown</li>
                <li>• Premium features show upgrade buttons</li>
              </ul>
            </div>
            <div>
              <h3 className='font-medium text-gray-700 mb-2'>
                As a Premium User:
              </h3>
              <ul className='text-sm text-gray-600 space-y-1'>
                <li>• All elements and properties are accessible</li>
                <li>• Premium fonts and animations work normally</li>
                <li>• Gradient and background color options available</li>
                <li>• No upgrade prompts or restrictions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Wish Builder */}
      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <CustomWishBuilder
          onBack={() => window.history.back()}
          isUserPremium={isUserPremium}
        />
      </div>
    </div>
  );
}
