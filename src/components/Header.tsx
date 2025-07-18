'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { LoginButton } from '@/components/auth/LoginButton';
import { UserMenu } from '@/components/auth/UserMenu';

export function Header() {
  const { user, isAdmin } = useAuth();

  return (
    <header className='bg-white shadow-sm border-b border-gray-200'>
      <div className='w-full max-w-[1800px] mx-auto px-4 md:px-6 py-4'>
        <div className='flex items-center justify-between'>
          {/* Logo and Brand */}
          <Link href='/' className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-lg'>W</span>
            </div>
            <span className='text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
              WishLuu
            </span>
          </Link>

          {/* Navigation */}
          <nav className='hidden md:flex items-center space-x-6'>
            <Link
              href='/templates'
              className='text-gray-600 hover:text-purple-600 transition-colors'
            >
              Templates
            </Link>
            <Link
              href='/wishes'
              className='text-gray-600 hover:text-purple-600 transition-colors'
            >
              My Wishes
            </Link>
            {isAdmin && (
              <div className='flex items-center space-x-4'>
                <Link
                  href='/admin/templates'
                  className='text-gray-600 hover:text-purple-600 transition-colors'
                >
                  Admin
                </Link>
                <Link
                  href='/admin/cleanup'
                  className='text-gray-600 hover:text-purple-600 transition-colors'
                >
                  Cleanup
                </Link>
              </div>
            )}
          </nav>

          {/* Auth Section */}
          <div className='flex items-center space-x-4'>
            {user ? (
              <UserMenu />
            ) : (
              <LoginButton variant='outline' size='sm'>
                Sign In
              </LoginButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
