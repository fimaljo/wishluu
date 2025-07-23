'use client';

import React from 'react';
import { usePayment } from '@/hooks/usePayment';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId?: string;
  credits?: number;
}

export function PaymentSuccessModal({
  isOpen,
  onClose,
  packageId,
  credits,
}: PaymentSuccessModalProps) {
  const { getPackageInfo } = usePayment();

  if (!isOpen) return null;

  const packageInfo = packageId ? getPackageInfo(packageId as any) : null;
  const displayCredits = credits || packageInfo?.credits || 0;
  const totalCredits = displayCredits + (packageInfo?.bonus || 0);

  return (
    <div className='fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-3xl shadow-2xl max-w-md w-full border border-gray-200'>
        {/* Header */}
        <div className='p-8 text-center bg-gradient-to-br from-green-50 via-white to-emerald-50 rounded-t-3xl'>
          <div className='w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg'>
            <svg
              className='w-10 h-10 text-white'
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
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>
            Payment Successful!
          </h2>
          <p className='text-gray-600 text-lg'>
            Your credits have been added to your account.
          </p>
        </div>

        {/* Content */}
        <div className='p-8'>
          <div className='text-center mb-8'>
            <div className='text-4xl font-bold text-green-600 mb-2'>
              +{totalCredits} Credits
            </div>
            <p className='text-gray-600'>
              {packageInfo ? (
                <>
                  {displayCredits} base credits + {packageInfo.bonus} bonus
                  credits
                </>
              ) : (
                'Added to your account'
              )}
            </p>
          </div>

          <div className='bg-gray-50 rounded-2xl p-6 mb-8'>
            <h3 className='font-semibold text-gray-900 mb-4'>What's Next?</h3>
            <ul className='space-y-3 text-gray-700'>
              <li className='flex items-center space-x-3'>
                <div className='w-6 h-6 bg-green-100 rounded-full flex items-center justify-center'>
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
                <span>Create premium wishes with advanced features</span>
              </li>
              <li className='flex items-center space-x-3'>
                <div className='w-6 h-6 bg-green-100 rounded-full flex items-center justify-center'>
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
                <span>Use premium templates and animations</span>
              </li>
              <li className='flex items-center space-x-3'>
                <div className='w-6 h-6 bg-green-100 rounded-full flex items-center justify-center'>
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
                <span>Export high-quality videos without watermarks</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className='space-y-4'>
            <button
              onClick={() => {
                onClose();
                window.location.href = '/wishes/create';
              }}
              className='w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
            >
              Create Your First Premium Wish
            </button>
            <button
              onClick={onClose}
              className='w-full py-3 px-6 bg-gray-100 text-gray-700 font-medium rounded-2xl hover:bg-gray-200 transition-all duration-300'
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
