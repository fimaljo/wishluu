'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { LoginButton } from '@/components/auth/LoginButton';
import { UserMenu } from '@/components/auth/UserMenu';

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  React.useEffect(() => {
    if (user) {
      window.location.href = '/dashboard';
    }
  }, [user]);

  if (user) {
    // Show loading while redirecting
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg
              className='w-8 h-8 text-white animate-spin'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
              />
            </svg>
          </div>
          <p className='text-gray-600'>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // For non-logged-in users, show landing page
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 relative overflow-hidden'>
      {/* Animated background elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {/* Glowing orbs - More prominent */}
        <div className='absolute top-1/3 left-1/3 w-24 h-24 bg-gradient-to-br from-purple-400/50 to-pink-400/50 rounded-full blur-md animate-glow shadow-xl'></div>
        <div
          className='absolute bottom-1/3 right-1/3 w-32 h-32 bg-gradient-to-br from-purple-300/50 to-pink-300/50 rounded-full blur-md animate-glow shadow-xl'
          style={{ animationDelay: '2s' }}
        ></div>

        {/* Subtle grid pattern */}
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(147,51,234,0.08)_1px,transparent_0)] bg-[length:50px_50px]'></div>

        {/* Shimmer effect */}
        <div className='absolute inset-0 animate-shimmer'></div>

        {/* Floating particles - More visible and varied */}
        <div
          className='particle'
          style={{ left: '5%', animationDelay: '0s' }}
        ></div>
        <div
          className='particle'
          style={{ left: '15%', animationDelay: '2s' }}
        ></div>
        <div
          className='particle'
          style={{ left: '25%', animationDelay: '4s' }}
        ></div>
        <div
          className='particle'
          style={{ left: '35%', animationDelay: '1s' }}
        ></div>
        <div
          className='particle'
          style={{ left: '45%', animationDelay: '3s' }}
        ></div>
        <div
          className='particle'
          style={{ left: '55%', animationDelay: '5s' }}
        ></div>
        <div
          className='particle'
          style={{ left: '65%', animationDelay: '2.5s' }}
        ></div>
        <div
          className='particle'
          style={{ left: '75%', animationDelay: '4.5s' }}
        ></div>
        <div
          className='particle'
          style={{ left: '85%', animationDelay: '1.5s' }}
        ></div>
        <div
          className='particle'
          style={{ left: '95%', animationDelay: '3.5s' }}
        ></div>

        {/* Additional larger particles */}
        <div
          className='absolute w-3 h-3 bg-gradient-to-r from-purple-400/70 to-pink-400/70 rounded-full animate-float'
          style={{ left: '10%', top: '20%', animationDelay: '1s' }}
        ></div>
        <div
          className='absolute w-3 h-3 bg-gradient-to-r from-purple-400/70 to-pink-400/70 rounded-full animate-float'
          style={{ left: '80%', top: '30%', animationDelay: '3s' }}
        ></div>
        <div
          className='absolute w-3 h-3 bg-gradient-to-r from-pink-400/70 to-purple-400/70 rounded-full animate-float'
          style={{ left: '20%', top: '70%', animationDelay: '2s' }}
        ></div>
      </div>
      {/* Navigation */}
      <nav className='flex items-center justify-between px-8 py-6 w-full max-w-[1800px] mx-auto relative z-20'>
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg'>
            <span className='text-white font-bold text-xl'>W</span>
          </div>
          <span className='text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-purple-600'>
            WishLuu
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center space-x-10'>
          <Link
            href='#features'
            className='text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium text-lg'
          >
            Features
          </Link>
          <Link
            href='#occasions'
            className='text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium text-lg'
          >
            Occasions
          </Link>
          <Link
            href='/templates'
            className='text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium text-lg'
          >
            Templates
          </Link>

          <LoginButton variant='primary' size='sm' className='px-6 py-2.5'>
            Sign In
          </LoginButton>
        </div>

        {/* Mobile Menu Button */}
        <div className='md:hidden'>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='text-gray-700 hover:text-purple-600 transition-colors p-2 rounded-lg hover:bg-gray-100'
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
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className='md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg'>
          <div className='px-8 py-6 space-y-4'>
            <Link
              href='#features'
              className='block text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium text-lg py-2'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href='#occasions'
              className='block text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium text-lg py-2'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Occasions
            </Link>
            <Link
              href='/templates'
              className='block text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium text-lg py-2'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Templates
            </Link>
            <div className='pt-4'>
              <LoginButton variant='primary' size='sm' className='w-full py-3'>
                Sign In
              </LoginButton>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className='text-center py-32 px-6 w-full max-w-[1600px] mx-auto relative'>
        <div className='relative z-10'>
          <div className='mb-8'>
            <span className='inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6'>
              ✨ Create unforgettable moments
            </span>
          </div>

          <h1 className='text-6xl md:text-8xl font-bold mb-8 leading-tight'>
            <span className='bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent text-purple-600'>
              Create Magic
            </span>
            <br />
            <span className='text-gray-800'>with Interactive Wishes</span>
          </h1>

          <p className='text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed'>
            Transform your special moments into unforgettable experiences with
            beautiful, interactive wishes that truly connect with your loved
            ones
          </p>

          <div className='flex flex-col sm:flex-row gap-6 justify-center items-center mb-16'>
            <LoginButton
              size='lg'
              className='px-10 py-5 text-xl font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300'
            >
              Get Started with Google
            </LoginButton>
            <Link
              href='/presentation/demo'
              className='group border-2 border-purple-500 text-purple-600 px-10 py-5 rounded-full text-xl font-semibold hover:bg-purple-50 hover:border-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
            >
              See Demo
              <span className='ml-2 group-hover:translate-x-1 transition-transform duration-300'>
                →
              </span>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className='flex flex-wrap justify-center items-center gap-8 text-gray-500'>
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
              <span className='text-sm font-medium'>Free to start</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 bg-pink-500 rounded-full'></div>
              <span className='text-sm font-medium'>
                No credit card required
              </span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
              <span className='text-sm font-medium'>Instant access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-24 px-6 relative overflow-hidden'>
        <div className='w-full max-w-[1800px] mx-auto relative z-10'>
          <div className='text-center mb-20'>
            <h2 className='text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-purple-600'>
              Why Choose WishLuu?
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
              Experience the magic of creating unforgettable moments with our
              innovative platform
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8 lg:gap-12'>
            <div className='group relative h-full'>
              <div className='absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500'></div>
              <div className='relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 border border-white/20 h-full flex flex-col'>
                <div className='w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg'>
                  <span className='text-white text-3xl'>✨</span>
                </div>
                <h3 className='text-2xl font-bold mb-4 text-gray-800 group-hover:text-purple-600 transition-colors duration-300'>
                  Interactive & Engaging
                </h3>
                <p className='text-gray-600 leading-relaxed text-lg flex-grow'>
                  Create wishes that respond to interactions, animations, and
                  personalized content that truly connects with your loved ones.
                </p>
                <div className='mt-6 flex items-center justify-center'>
                  <div className='w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group-hover:w-16 transition-all duration-300'></div>
                </div>
              </div>
            </div>

            <div className='group relative h-full'>
              <div className='absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500'></div>
              <div className='relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 border border-white/20 h-full flex flex-col'>
                <div className='w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg'>
                  <span className='text-white text-3xl'>🎨</span>
                </div>
                <h3 className='text-2xl font-bold mb-4 text-gray-800 group-hover:text-purple-600 transition-colors duration-300'>
                  Customizable Design
                </h3>
                <p className='text-gray-600 leading-relaxed text-lg flex-grow'>
                  Choose from beautiful templates or create your own unique
                  design with our intuitive and powerful editor.
                </p>
                <div className='mt-6 flex items-center justify-center'>
                  <div className='w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full group-hover:w-16 transition-all duration-300'></div>
                </div>
              </div>
            </div>

            <div className='group relative h-full'>
              <div className='absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500'></div>
              <div className='relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 border border-white/20 h-full flex flex-col'>
                <div className='w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg'>
                  <span className='text-white text-3xl'>💝</span>
                </div>
                <h3 className='text-2xl font-bold mb-4 text-gray-800 group-hover:text-pink-600 transition-colors duration-300'>
                  Perfect for Every Occasion
                </h3>
                <p className='text-gray-600 leading-relaxed text-lg flex-grow'>
                  From birthdays to proposals, we have templates and features
                  for every special moment in your life journey.
                </p>
                <div className='mt-6 flex items-center justify-center'>
                  <div className='w-12 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full group-hover:w-16 transition-all duration-300'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Occasions Section */}
      <section id='occasions' className='py-32 px-6 relative overflow-hidden'>
        <div className='w-full max-w-[1800px] mx-auto relative z-10'>
          <div className='text-center mb-20'>
            <h2 className='text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-purple-600'>
              Perfect for Every Special Moment
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
              From birthdays to life milestones, create personalized wishes for
              every occasion
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {[
              {
                name: 'Birthdays',
                emoji: '🎂',
                color: 'from-pink-400 to-purple-500',
                description: 'Make birthdays unforgettable',
              },
              {
                name: "Valentine's Day",
                emoji: '💕',
                color: 'from-purple-400 to-pink-500',
                description: 'Express your love creatively',
              },
              {
                name: "Mother's Day",
                emoji: '🌷',
                color: 'from-purple-400 to-pink-500',
                description: 'Show appreciation beautifully',
              },
              {
                name: 'Proposals',
                emoji: '💍',
                color: 'from-purple-500 to-pink-500',
                description: 'Create the perfect moment',
              },
              {
                name: 'Anniversaries',
                emoji: '💑',
                color: 'from-pink-400 to-purple-400',
                description: 'Celebrate your journey together',
              },
              {
                name: 'Graduations',
                emoji: '🎓',
                color: 'from-purple-400 to-pink-400',
                description: 'Mark academic achievements',
              },
              {
                name: 'Thank You',
                emoji: '🙏',
                color: 'from-pink-500 to-purple-500',
                description: 'Express gratitude meaningfully',
              },
              {
                name: 'Congratulations',
                emoji: '🎉',
                color: 'from-purple-400 to-pink-400',
                description: 'Celebrate success and milestones',
              },
            ].map(occasion => (
              <div key={occasion.name} className='group cursor-pointer'>
                <div
                  className={`bg-gradient-to-r ${occasion.color} p-8 rounded-3xl text-white text-center transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:-translate-y-2 relative overflow-hidden`}
                >
                  <div className='absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                  <div className='relative z-10'>
                    <div className='text-5xl mb-4 group-hover:scale-110 transition-transform duration-300'>
                      {occasion.emoji}
                    </div>
                    <h3 className='text-xl font-bold mb-2'>{occasion.name}</h3>
                    <p className='text-white/90 text-sm'>
                      {occasion.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-white border-t border-gray-800'>
        <div className='w-full max-w-[1800px] mx-auto px-6 py-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-center'>
            {/* Brand Section */}
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-sm'>
                <span className='text-white font-bold text-lg'>W</span>
              </div>
              <div>
                <span className='text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                  WishLuu
                </span>
                <p className='text-gray-400 text-sm mt-1'>
                  Interactive wishes for special moments
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className='flex flex-wrap justify-center md:justify-center gap-8 text-gray-300'>
              <Link
                href='/about'
                className='text-sm font-medium hover:text-white transition-colors duration-200'
              >
                About Us
              </Link>
              <Link
                href='/contact'
                className='text-sm font-medium hover:text-white transition-colors duration-200'
              >
                Contact
              </Link>
              <Link
                href='/templates'
                className='text-sm font-medium hover:text-white transition-colors duration-200'
              >
                Templates
              </Link>
              <Link
                href='/privacy'
                className='text-sm font-medium hover:text-white transition-colors duration-200'
              >
                Privacy Policy
              </Link>
            </div>

            {/* Social/Additional Links */}
            <div className='flex flex-wrap justify-center md:justify-end gap-6 text-gray-400'>
              <Link
                href='/terms'
                className='text-sm hover:text-white transition-colors duration-200'
              >
                Terms of Service
              </Link>
              <Link
                href='/help'
                className='text-sm hover:text-white transition-colors duration-200'
              >
                Help Center
              </Link>
            </div>
          </div>

          <div className='border-t border-gray-800 mt-8 pt-6'>
            <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
              <div className='text-sm text-gray-500'>
                © 2024 WishLuu. All rights reserved.
              </div>
              <div className='text-sm text-gray-500'>
                Made with ❤️ for creating unforgettable moments
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
