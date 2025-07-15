'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className='min-h-screen'>
      {/* Navigation */}
      <nav className='flex items-center justify-between p-6 w-full max-w-[1800px] mx-auto'>
        <div className='flex items-center space-x-2'>
          <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
            <span className='text-white font-bold text-lg'>W</span>
          </div>
          <span className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
            WishLuu
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center space-x-8'>
          <Link
            href='#features'
            className='text-gray-600 hover:text-purple-600 transition-colors'
          >
            Features
          </Link>
          <Link
            href='#occasions'
            className='text-gray-600 hover:text-purple-600 transition-colors'
          >
            Occasions
          </Link>
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
          <Link
            href='/templates'
            className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300'
          >
            Create Wish
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className='md:hidden'>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='text-gray-600 hover:text-purple-600 transition-colors'
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
        <div className='md:hidden bg-white border-t border-gray-200'>
          <div className='px-6 py-4 space-y-4'>
            <Link
              href='#features'
              className='block text-gray-600 hover:text-purple-600 transition-colors'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href='#occasions'
              className='block text-gray-600 hover:text-purple-600 transition-colors'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Occasions
            </Link>
            <Link
              href='/templates'
              className='block text-gray-600 hover:text-purple-600 transition-colors'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Templates
            </Link>
            <Link
              href='/wishes'
              className='block text-gray-600 hover:text-purple-600 transition-colors'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Wishes
            </Link>
            <Link
              href='/templates'
              className='block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 text-center'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Create Wish
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className='text-center py-20 px-6 w-full max-w-[1600px] mx-auto'>
        <h1 className='text-5xl md:text-7xl font-bold mb-6'>
          <span className='bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
            Create Magic
          </span>
          <br />
          <span className='text-gray-800'>with Interactive Wishes</span>
        </h1>
        <p className='text-lg text-gray-600 mb-8'>
          Create beautiful, interactive wishes that&apos;ll make your loved
          ones&apos; day special
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link
            href='/templates'
            className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105'
          >
            Start Creating
          </Link>
          <Link
            href='/presentation/demo'
            className='border-2 border-purple-500 text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 transition-all duration-300'
          >
            See Demo
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-20 px-6 bg-white/50'>
        <div className='w-full max-w-[1800px] mx-auto'>
          <h2 className='text-4xl font-bold text-center mb-16 text-gray-800'>
            Why Choose WishLuu?
          </h2>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center p-6 rounded-2xl bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300'>
              <div className='w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-white text-2xl'>✨</span>
              </div>
              <h3 className='text-xl font-semibold mb-3 text-gray-800'>
                Interactive & Engaging
              </h3>
              <p className='text-gray-600'>
                Create wishes that respond to interactions, animations, and
                personalized content that truly connects.
              </p>
            </div>
            <div className='text-center p-6 rounded-2xl bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300'>
              <div className='w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-white text-2xl'>🎨</span>
              </div>
              <h3 className='text-xl font-semibold mb-3 text-gray-800'>
                Customizable Design
              </h3>
              <p className='text-gray-600'>
                Choose from beautiful templates or create your own unique design
                with our easy-to-use editor.
              </p>
            </div>
            <div className='text-center p-6 rounded-2xl bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300'>
              <div className='w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-white text-2xl'>💝</span>
              </div>
              <h3 className='text-xl font-semibold mb-3 text-gray-800'>
                Perfect for Every Occasion
              </h3>
              <p className='text-gray-600'>
                From birthdays to proposals, we have templates and features for
                every special moment in life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Occasions Section */}
      <section id='occasions' className='py-20 px-6'>
        <div className='w-full max-w-[1800px] mx-auto'>
          <h2 className='text-4xl font-bold text-center mb-16 text-gray-800'>
            Perfect for Every Special Moment
          </h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[
              {
                name: 'Birthdays',
                emoji: '🎂',
                color: 'from-pink-400 to-rose-500',
              },
              {
                name: "Valentine's Day",
                emoji: '💕',
                color: 'from-red-400 to-pink-500',
              },
              {
                name: "Mother's Day",
                emoji: '🌷',
                color: 'from-purple-400 to-pink-500',
              },
              {
                name: 'Proposals',
                emoji: '💍',
                color: 'from-blue-400 to-purple-500',
              },
              {
                name: 'Anniversaries',
                emoji: '💑',
                color: 'from-green-400 to-blue-500',
              },
              {
                name: 'Graduations',
                emoji: '🎓',
                color: 'from-yellow-400 to-orange-500',
              },
              {
                name: 'Thank You',
                emoji: '🙏',
                color: 'from-indigo-400 to-purple-500',
              },
              {
                name: 'Congratulations',
                emoji: '🎉',
                color: 'from-cyan-400 to-blue-500',
              },
            ].map(occasion => (
              <div key={occasion.name} className='group cursor-pointer'>
                <div
                  className={`bg-gradient-to-r ${occasion.color} p-6 rounded-2xl text-white text-center transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl`}
                >
                  <div className='text-4xl mb-3'>{occasion.emoji}</div>
                  <h3 className='text-lg font-semibold'>{occasion.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 px-6 bg-gradient-to-r from-purple-600 to-pink-600'>
        <div className='w-full max-w-[1600px] mx-auto text-center'>
          <h2 className='text-4xl font-bold text-white mb-6'>
            Ready to Create Something Special?
          </h2>
          <p className='text-xl text-purple-100 mb-8'>
            Join thousands of people who are already creating magical moments
            with WishLuu.
          </p>
          <Link
            href='/templates'
            className='bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-block'
          >
            Start Creating Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className='py-12 px-6 bg-gray-900 text-white'>
        <div className='w-full max-w-[1800px] mx-auto text-center'>
          <div className='flex items-center justify-center space-x-2 mb-6'>
            <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-lg'>W</span>
            </div>
            <span className='text-2xl font-bold'>WishLuu</span>
          </div>
          <p className='text-gray-400 mb-4'>
            Making every moment special with interactive wishes
          </p>
          <div className='text-sm text-gray-500'>
            © 2024 WishLuu. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
