'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginButton } from './LoginButton';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

export function AuthGuard({
  children,
  requireAdmin = false,
  fallback,
}: AuthGuardProps) {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      fallback || (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50'>
          <div className='max-w-md w-full mx-auto p-8'>
            <div className='text-center'>
              <div className='text-6xl mb-6'>🔐</div>
              <h1 className='text-3xl font-bold text-gray-900 mb-4'>
                Sign in Required
              </h1>
              <p className='text-gray-600 mb-8'>
                Please sign in to access this page.
              </p>
              <LoginButton size='lg' className='w-full'>
                Sign in with Google
              </LoginButton>
            </div>
          </div>
        </div>
      )
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      fallback || (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50'>
          <div className='max-w-md w-full mx-auto p-8'>
            <div className='text-center'>
              <div className='text-6xl mb-6'>🚫</div>
              <h1 className='text-3xl font-bold text-gray-900 mb-4'>
                Access Denied
              </h1>
              <p className='text-gray-600 mb-8'>
                You need admin privileges to access this page.
              </p>
              <a
                href='/'
                className='inline-block px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
