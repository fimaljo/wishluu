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
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Welcome Section */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-800 mb-4'>
            Choose Your Template ✨
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Select from our beautiful collection of templates to create your
            perfect interactive wish, or start from scratch with our custom
            builder.
          </p>
        </div>

        {/* Occasion Filter */}
        <div className='mb-12'>
          <div className='text-center mb-6'>
            <h3 className='text-2xl font-bold text-gray-800 mb-2'>
              Filter by Occasion
            </h3>
            <p className='text-gray-600'>
              Find the perfect template for your special moment
            </p>
          </div>
          <div className='flex flex-wrap justify-center gap-3'>
            {TEMPLATE_OCCASIONS.map(occasion => (
              <button
                key={occasion.id}
                onClick={() => setSelectedOccasion(occasion.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedOccasion === occasion.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-blue-600 shadow-md hover:shadow-lg border border-white/20'
                }`}
              >
                <span className='mr-2'>{occasion.emoji}</span>
                {occasion.name}
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className='text-center py-16'>
            <div className='inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6'>
              <span className='text-4xl'>⚠️</span>
            </div>
            <h3 className='text-2xl font-bold text-gray-800 mb-3'>
              Error Loading Templates
            </h3>
            <p className='text-gray-600 mb-6 max-w-md mx-auto'>{error}</p>
            <Button
              onClick={refreshTemplates}
              variant='primary'
              size='lg'
              className='px-8 py-3'
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !error && (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 animate-pulse border border-white/20'
              >
                <div className='bg-gradient-to-r from-blue-200 to-purple-200 rounded-xl h-32 mb-6'></div>
                <div className='bg-gray-200 rounded-lg h-6 mb-3'></div>
                <div className='bg-gray-200 rounded h-4 mb-6'></div>
                <div className='bg-gray-200 rounded-full h-8 w-24'></div>
              </div>
            ))}
          </div>
        )}

        {/* Templates Grid */}
        {!isLoading && !error && (
          <div className='mb-12'>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {/* Custom Wish Card - only show when there are templates */}
              {filteredTemplates.length > 0 && (
                <Link href='/wishes/create/custom-blank'>
                  <div className='group cursor-pointer'>
                    <div className='bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-2xl text-white text-center transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl h-full flex flex-col justify-center relative overflow-hidden border border-white/20 shadow-lg'>
                      {/* Background Pattern */}
                      <div className='absolute inset-0 opacity-10'>
                        <div className='absolute top-4 right-4 w-16 h-16 rounded-full bg-white/20'></div>
                        <div className='absolute bottom-4 left-4 w-8 h-8 rounded-full bg-white/20'></div>
                        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/10'></div>
                      </div>

                      <div className='relative z-10'>
                        <div className='text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300'>
                          ✨
                        </div>
                        <h3 className='text-xl font-bold mb-3 text-shadow-lg'>
                          Create Your Own Custom Wish
                        </h3>
                        <p className='text-white/90 text-sm mb-6 leading-relaxed'>
                          Start from scratch and build something unique.
                        </p>
                        <div className='bg-white/25 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-semibold border border-white/30 transform group-hover:scale-105 transition-transform duration-300'>
                          Custom
                        </div>
                      </div>

                      {/* Hover Effect */}
                      <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    </div>
                  </div>
                </Link>
              )}
              {/* Actual template cards */}
              {filteredTemplates.map(template => (
                <Link key={template.id} href={`/wishes/create/${template.id}`}>
                  <div className='group cursor-pointer'>
                    <div
                      className={`bg-gradient-to-r ${template.color} p-8 rounded-2xl text-white text-center transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl h-full flex flex-col justify-center relative overflow-hidden border border-white/20 shadow-lg`}
                    >
                      {/* Background Pattern */}
                      <div className='absolute inset-0 opacity-10'>
                        <div className='absolute top-4 right-4 w-16 h-16 rounded-full bg-white/20'></div>
                        <div className='absolute bottom-4 left-4 w-8 h-8 rounded-full bg-white/20'></div>
                        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/10'></div>
                      </div>

                      <div className='relative z-10'>
                        <div className='text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300'>
                          {template.thumbnail}
                        </div>
                        <h3 className='text-xl font-bold mb-3 text-shadow-lg'>
                          {template.name}
                        </h3>
                        <p className='text-white/90 text-sm mb-6 leading-relaxed'>
                          {template.description}
                        </p>
                        <div className='bg-white/25 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-semibold border border-white/30 transform group-hover:scale-105 transition-transform duration-300'>
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
              ))}

              {/* No templates message - only show when no actual templates exist */}
              {filteredTemplates.length === 0 && (
                <div className='col-span-full text-center py-20'>
                  <div className='inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6'>
                    <span className='text-5xl'>📝</span>
                  </div>
                  <h3 className='text-2xl font-bold text-gray-800 mb-3'>
                    No Templates Found
                  </h3>
                  <p className='text-gray-600 text-lg max-w-md mx-auto mb-8'>
                    {selectedOccasion === 'all'
                      ? 'No templates are available yet. Check back soon for beautiful new templates!'
                      : `No templates found for ${selectedOccasion} occasion. Try selecting a different category.`}
                  </p>
                  <Link href='/wishes/create/custom-blank'>
                    <Button
                      variant='primary'
                      size='lg'
                      className='px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
                    >
                      Create Your Own Custom Wish ✨
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Custom Template Option */}
        {/* Removed bottom section as per new design */}
      </main>
    </div>
  );
}
