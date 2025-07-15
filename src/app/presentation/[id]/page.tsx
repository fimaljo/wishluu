'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function PresentationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const features = [
    {
      title: '✨ Real-time Preview',
      description:
        'See exactly how your wish will look when shared. Toggle preview mode to hide editing tools and focus on the final result.',
      icon: '👁️',
    },
    {
      title: '🎨 Interactive Elements',
      description:
        'Add balloons, beautiful text, and more interactive elements to make your wish truly special.',
      icon: '🎈',
    },
    {
      title: '📤 One-Click Sharing',
      description:
        'Save your wish and get a shareable link instantly. Perfect for sending to friends and family.',
      icon: '🔗',
    },
    {
      title: '🎯 Custom Templates',
      description:
        'Choose from beautiful templates or start from scratch with our powerful drag-and-drop builder.',
      icon: '📝',
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-pink-50'>
      {/* Navigation */}
      <nav className='flex items-center justify-between p-6 max-w-7xl mx-auto'>
        <Link href='/' className='flex items-center space-x-2'>
          <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
            <span className='text-white font-bold text-lg'>W</span>
          </div>
          <span className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
            WishLuu
          </span>
        </Link>
        <div className='flex items-center space-x-4'>
          <Link href='/templates'>
            <Button variant='outline'>Browse Templates</Button>
          </Link>
          <Link href='/wishes/create/custom-blank'>
            <Button variant='primary'>Try Builder</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className='max-w-7xl mx-auto px-6 py-12'>
        <div className='text-center mb-16'>
          <h1 className='text-5xl md:text-6xl font-bold mb-6'>
            <span className='bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
              Create & Share
            </span>
            <br />
            Beautiful Wishes
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto mb-8'>
            Build interactive wishes with our powerful drag-and-drop builder.
            Preview in real-time and share with a single click.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link href='/wishes/create/custom-blank'>
              <Button variant='primary' className='px-8 py-4 text-lg'>
                Start Creating Now
              </Button>
            </Link>
            <Link href='/templates'>
              <Button variant='outline' className='px-8 py-4 text-lg'>
                Browse Templates
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className='grid md:grid-cols-2 gap-8 mb-16'>
          {features.map((feature, index) => (
            <div
              key={index}
              className='bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow'
            >
              <div className='text-4xl mb-4'>{feature.icon}</div>
              <h3 className='text-xl font-semibold mb-3 text-gray-800'>
                {feature.title}
              </h3>
              <p className='text-gray-600'>{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Demo Section */}
        <div className='bg-white rounded-3xl shadow-2xl p-12 mb-16'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold mb-4'>See It In Action</h2>
            <p className='text-gray-600'>
              Watch how easy it is to create and share beautiful wishes
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-4'>
                <div className='text-3xl mb-2'>🎨</div>
                <h3 className='font-semibold mb-2'>1. Build</h3>
                <p className='text-sm text-gray-600'>
                  Drag and drop elements to create your wish
                </p>
              </div>
            </div>

            <div className='text-center'>
              <div className='bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-6 mb-4'>
                <div className='text-3xl mb-2'>👁️</div>
                <h3 className='font-semibold mb-2'>2. Preview</h3>
                <p className='text-sm text-gray-600'>
                  See exactly how it will look when shared
                </p>
              </div>
            </div>

            <div className='text-center'>
              <div className='bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 mb-4'>
                <div className='text-3xl mb-2'>📤</div>
                <h3 className='font-semibold mb-2'>3. Share</h3>
                <p className='text-sm text-gray-600'>
                  Get a link and share with anyone
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className='text-center'>
          <div className='bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-12 text-white'>
            <h2 className='text-3xl font-bold mb-4'>
              Ready to Create Your First Wish?
            </h2>
            <p className='text-xl mb-8 opacity-90'>
              Join thousands of users creating beautiful, interactive wishes for
              their loved ones.
            </p>
            <Link href='/wishes/create/custom-blank'>
              <Button
                variant='secondary'
                className='px-8 py-4 text-lg bg-white text-purple-600 hover:bg-gray-100'
              >
                Start Building Now ✨
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
