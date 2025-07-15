'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TEMPLATE_OCCASIONS } from '@/config/templates';
import { Template } from '@/types/templates';
import { useAuth } from '@/contexts/AuthContext';
import { LoginButton } from '@/components/auth/LoginButton';
import { UserMenu } from '@/components/auth/UserMenu';
import { useFirebaseTemplates } from '@/hooks/useFirebaseTemplates';

export default function TemplatesPage() {
  const [selectedOccasion, setSelectedOccasion] = useState('all');
  const { user, isAdmin } = useAuth();

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

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'>
      {/* Navigation */}
      <nav className='bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50'>
        <div className='flex items-center justify-between p-6 w-full max-w-[1800px] mx-auto'>
          <div className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg'>
              <span className='text-white font-bold text-lg'>W</span>
            </div>
            <span className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
              WishLuu
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-8'>
            <Link
              href='/'
              className='text-gray-600 hover:text-purple-600 transition-colors font-medium'
            >
              Home
            </Link>
            {user && (
              <Link
                href='/wishes'
                className='text-gray-600 hover:text-purple-600 transition-colors font-medium'
              >
                My Wishes
              </Link>
            )}
            {isAdmin && (
              <Link
                href='/admin/templates'
                className='text-gray-600 hover:text-purple-600 transition-colors font-medium'
              >
                Manage Templates
              </Link>
            )}
            <Link
              href='/'
              className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium'
            >
              Create Wish
            </Link>
            {user ? (
              <UserMenu />
            ) : (
              <LoginButton variant='outline' size='sm'>
                Sign In
              </LoginButton>
            )}
          </div>
        </div>
      </nav>

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
