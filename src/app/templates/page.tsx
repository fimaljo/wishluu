'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TEMPLATE_OCCASIONS } from '@/config/templates';
import { Template } from '@/types/templates';
import { useAuth } from '@/contexts/AuthContext';
import { LoginButton } from '@/components/auth/LoginButton';
import { Button } from '@/components/ui/Button';
import { useFirebaseTemplates } from '@/hooks/useFirebaseTemplates';

export default function TemplatesPage() {
  const [selectedOccasion, setSelectedOccasion] = useState('all');
  const { user, isAdmin, signOut } = useAuth();

  // Use Firebase templates hook
  const {
    templates,
    isLoading,
    error,
    refreshTemplates,
    getTemplatesByOccasion,
  } = useFirebaseTemplates();

  // Filter templates by selected occasion
  const filteredTemplates = React.useMemo(() => {
    if (selectedOccasion === 'all') {
      return templates;
    }
    return templates.filter(template => template.occasion === selectedOccasion);
  }, [templates, selectedOccasion]);

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to home page after sign out
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      {/* Header */}
      <header className='bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center space-x-4'>
              <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
                <span className='text-white font-bold text-lg'>W</span>
              </div>
              <div>
                <h1 className='text-xl font-bold text-gray-800'>WishLuu</h1>
                <p className='text-sm text-gray-500'>Create & Share Wishes</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <div className='hidden md:flex items-center space-x-2 text-sm text-gray-600'>
                <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                <span>
                  Welcome back,{' '}
                  {user?.displayName || user?.email?.split('@')[0]}! 👋
                </span>
              </div>
              {isAdmin && (
                <div className='flex items-center space-x-3'>
                  <Link
                    href='/admin/templates'
                    className='text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium'
                  >
                    ⚙️ Admin
                  </Link>
                  <Link
                    href='/admin/cleanup'
                    className='text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium'
                  >
                    🧹 Cleanup
                  </Link>
                </div>
              )}
              {user ? (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleSignOut}
                  className='text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300'
                >
                  <svg
                    className='w-4 h-4 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                    />
                  </svg>
                  Sign Out
                </Button>
              ) : (
                <LoginButton variant='outline' size='sm'>
                  Sign In
                </LoginButton>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className='w-full max-w-[1800px] mx-auto px-6 py-8'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold mb-3'>
            <span className='bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent'>
              Choose Your Template
            </span>
          </h1>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Select from our beautiful collection of templates to create your
            perfect interactive wish.
          </p>
        </div>

        {/* Occasion Filter */}
        <div className='flex flex-wrap justify-center gap-2 mb-8'>
          {TEMPLATE_OCCASIONS.map(occasion => (
            <button
              key={occasion.id}
              onClick={() => setSelectedOccasion(occasion.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedOccasion === occasion.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-purple-600 shadow-md hover:shadow-lg border border-purple-100'
              }`}
            >
              <span className='mr-1.5'>{occasion.emoji}</span>
              {occasion.name}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className='text-center py-16'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6'>
              <span className='text-3xl'>⚠️</span>
            </div>
            <h3 className='text-2xl font-bold text-gray-800 mb-3'>
              Error Loading Templates
            </h3>
            <p className='text-gray-600 mb-6 max-w-md mx-auto'>{error}</p>
            <button
              onClick={refreshTemplates}
              className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold'
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !error && (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className='bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 animate-pulse border border-purple-100'
              >
                <div className='bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl h-32 mb-6'></div>
                <div className='bg-gray-200 rounded-lg h-6 mb-3'></div>
                <div className='bg-gray-200 rounded h-4 mb-6'></div>
                <div className='bg-gray-200 rounded-full h-8 w-24'></div>
              </div>
            ))}
          </div>
        )}

        {/* Templates Grid */}
        {!isLoading && !error && (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map(template => (
                <Link key={template.id} href={`/wishes/create/${template.id}`}>
                  <div className='group cursor-pointer'>
                    <div
                      className={`bg-gradient-to-r ${template.color} p-8 rounded-3xl text-white text-center transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl h-full flex flex-col justify-center relative overflow-hidden border border-white/20`}
                    >
                      {/* Background Pattern */}
                      <div className='absolute inset-0 opacity-10'>
                        <div className='absolute top-4 right-4 w-16 h-16 rounded-full bg-white/20'></div>
                        <div className='absolute bottom-4 left-4 w-8 h-8 rounded-full bg-white/20'></div>
                        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/10'></div>
                      </div>

                      <div className='relative z-10'>
                        <div className='text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-300'>
                          {template.thumbnail}
                        </div>
                        <h3 className='text-2xl font-bold mb-3 text-shadow-lg'>
                          {template.name}
                        </h3>
                        <p className='text-purple-100 text-base mb-6 leading-relaxed'>
                          {template.description}
                        </p>
                        <div className='bg-white/25 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-semibold border border-white/30 transform group-hover:scale-105 transition-transform duration-300'>
                          {template.occasion === 'custom'
                            ? 'Custom'
                            : template.occasion}
                        </div>
                      </div>

                      {/* Hover Effect */}
                      <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className='col-span-full text-center py-20'>
                <div className='inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6'>
                  <span className='text-5xl'>📝</span>
                </div>
                <h3 className='text-2xl font-bold text-gray-800 mb-3'>
                  No Templates Found
                </h3>
                <p className='text-gray-600 text-lg max-w-md mx-auto'>
                  {selectedOccasion === 'all'
                    ? 'No templates are available yet. Check back soon for beautiful new templates!'
                    : `No templates found for ${selectedOccasion} occasion. Try selecting a different category.`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Custom Template Option */}
        <div className='mt-12 text-center'>
          <div className='bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl shadow-xl p-6 max-w-4xl mx-auto border border-purple-100'>
            <div className='flex items-center justify-center mb-4'>
              <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3'>
                <span className='text-2xl'>✨</span>
              </div>
              <h2 className='text-2xl font-bold text-gray-800'>
                Create Your Own Custom Wish
              </h2>
            </div>
            <p className='text-gray-600 mb-6 max-w-2xl mx-auto'>
              Start from scratch and build a completely unique interactive wish
              with our powerful builder.
            </p>
            <div className='flex flex-wrap justify-center gap-4 mb-4 text-sm text-gray-500'>
              <span className='flex items-center'>
                <span className='mr-1'>✨</span>
                Preview in real-time
              </span>
              <span className='flex items-center'>
                <span className='mr-1'>🎨</span>
                Customize every element
              </span>
              <span className='flex items-center'>
                <span className='mr-1'>📤</span>
                Share with one click
              </span>
            </div>
            <Link
              href='/wishes/create/custom-blank'
              className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 inline-block'
            >
              Start Building Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
