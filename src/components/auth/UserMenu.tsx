'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

interface UserMenuProps {
  className?: string;
}

export function UserMenu({ className = '' }: UserMenuProps) {
  const { user, isAdmin, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Debug logging for admin status (development only)
  if (process.env.NODE_ENV === 'development') {
    console.log('UserMenu - Admin status:', {
      userEmail: user?.email,
      isAdmin,
      hasAdminEmails: !!process.env.NEXT_PUBLIC_ADMIN_EMAILS,
    });
  }

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const result = await signOut();
      if (!result.success) {
        console.error('Sign out failed:', result.error);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsSigningOut(false);
      setIsOpen(false);
    }
  };

  if (!user) return null;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors'
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className='w-8 h-8 rounded-full'
          />
        ) : (
          <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold'>
            {user.displayName?.[0] || user.email?.[0] || 'U'}
          </div>
        )}
        <div className='hidden sm:block text-left'>
          <div className='text-sm font-medium text-gray-900'>
            {user.displayName || 'User'}
          </div>
          <div className='text-xs text-gray-500'>{user.email}</div>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50'>
          <div className='px-4 py-2 border-b border-gray-100'>
            <div className='text-sm font-medium text-gray-900'>
              {user.displayName || 'User'}
            </div>
            <div className='text-xs text-gray-500'>{user.email}</div>
            {isAdmin && (
              <div className='mt-1'>
                <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800'>
                  Admin
                </span>
              </div>
            )}
          </div>

          {isAdmin && (
            <a
              href='/admin/templates'
              className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'
              onClick={() => setIsOpen(false)}
            >
              Manage Templates
            </a>
          )}

          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50'
          >
            {isSigningOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      )}
    </div>
  );
}
