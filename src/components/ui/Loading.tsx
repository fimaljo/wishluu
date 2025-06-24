import React from 'react';
import { cn } from '@/lib/utils';

// Define loading variants
export interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

/**
 * Loading Component
 *
 * A reusable loading component with multiple variants and sizes.
 * Follows the design system and provides consistent loading states.
 *
 * @example
 * <Loading variant="spinner" size="md" text="Loading..." />
 */
export function Loading({
  variant = 'spinner',
  size = 'md',
  className,
  text,
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const renderSpinner = () => (
    <svg
      className={cn('animate-spin', sizeClasses[size])}
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
    >
      <circle
        className='opacity-25'
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        strokeWidth='4'
      />
      <path
        className='opacity-75'
        fill='currentColor'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
      />
    </svg>
  );

  const renderDots = () => (
    <div className='flex space-x-1'>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={cn(
            'bg-current rounded-full animate-bounce',
            size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
          )}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      className={cn(
        'bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse',
        sizeClasses[size]
      )}
    />
  );

  const renderSkeleton = () => (
    <div className='animate-pulse'>
      <div className='bg-gray-200 rounded-lg h-4 mb-2'></div>
      <div className='bg-gray-200 rounded-lg h-4 w-3/4'></div>
    </div>
  );

  const renderContent = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'skeleton':
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className='text-purple-500'>{renderContent()}</div>
      {text && <p className='mt-2 text-sm text-gray-600'>{text}</p>}
    </div>
  );
}

/**
 * Page Loading Component
 *
 * A full-page loading component for route transitions or initial page loads.
 */
export function PageLoading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center'>
      <Loading variant='spinner' size='lg' text={text} />
    </div>
  );
}

/**
 * Skeleton Loading Component
 *
 * A skeleton loading component for content placeholders.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-gray-200 rounded', className)} />;
}

/**
 * Card Skeleton Component
 *
 * A skeleton component specifically designed for card layouts.
 */
export function CardSkeleton() {
  return (
    <div className='bg-white rounded-2xl shadow-xl p-6 animate-pulse'>
      <div className='flex items-center space-x-4 mb-4'>
        <div className='w-12 h-12 bg-gray-200 rounded-full'></div>
        <div className='flex-1'>
          <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
          <div className='h-3 bg-gray-200 rounded w-1/2'></div>
        </div>
      </div>
      <div className='space-y-2'>
        <div className='h-4 bg-gray-200 rounded'></div>
        <div className='h-4 bg-gray-200 rounded w-5/6'></div>
        <div className='h-4 bg-gray-200 rounded w-4/6'></div>
      </div>
    </div>
  );
}
