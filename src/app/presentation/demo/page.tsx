'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LoginButton } from '@/components/auth/LoginButton';
import { useAuth } from '@/contexts/AuthContext';
import { VideoPlayer, VideoThumbnail } from '@/components/ui/VideoPlayer';

export default function PresentationDemoPage() {
  const { user, isLoading } = useAuth();
  const [activeVideo, setActiveVideo] = useState(0);

  const demoVideos = [
    {
      id: 'wish-creation',
      title: 'Creating a Beautiful Wish',
      description:
        'Watch how easy it is to create stunning wishes with our drag-and-drop builder',
      thumbnail: '/api/placeholder/400/225',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '2:34',
      icon: '🎨',
    },
    {
      id: 'interactive-elements',
      title: 'Interactive Elements Demo',
      description:
        'See balloons, animations, and interactive features in action',
      thumbnail: '/api/placeholder/400/225',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '1:45',
      icon: '✨',
    },
    {
      id: 'sharing-features',
      title: 'Sharing & Collaboration',
      description: 'Learn how to share wishes and collaborate with others',
      thumbnail: '/api/placeholder/400/225',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '1:20',
      icon: '🔗',
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>
      {/* Navigation */}
      <nav className='sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/50'>
        <div className='max-w-7xl mx-auto px-4 py-3'>
          <div className='flex items-center justify-between'>
            <Link href='/' className='flex items-center space-x-2 group'>
              <div className='w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105'>
                <span className='text-white font-bold text-lg'>W</span>
              </div>
              <div>
                <span className='text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                  WishLuu
                </span>
                <div className='text-xs text-gray-500 -mt-1'>
                  Create • Share • Celebrate
                </div>
              </div>
            </Link>

            <div className='flex items-center space-x-3'>
              {!isLoading && (
                <>
                  {user ? (
                    <div className='flex items-center space-x-3'>
                      <div className='flex items-center space-x-2 bg-white/50 backdrop-blur-sm rounded-full px-3 py-1.5 border border-gray-200/50'>
                        {user.photoURL && (
                          <img
                            src={user.photoURL}
                            alt={user.displayName || 'User'}
                            className='w-6 h-6 rounded-full ring-2 ring-purple-200'
                          />
                        )}
                        <span className='text-sm font-medium text-gray-700'>
                          {user.displayName || user.email}
                        </span>
                      </div>
                      <Link href='/wishes/create/custom-blank'>
                        <Button
                          variant='primary'
                          className='shadow-lg hover:shadow-xl transition-all duration-300 text-sm px-4 py-2'
                        >
                          Create Wish ✨
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className='flex items-center space-x-3'>
                      <LoginButton
                        variant='primary'
                        className='shadow-lg hover:shadow-xl transition-all duration-300 text-sm px-4 py-2'
                      >
                        Sign in to Create
                      </LoginButton>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Video Demo Section */}
      <section
        id='video-section'
        className='py-20 bg-gradient-to-br from-gray-50 to-white'
      >
        <div className='max-w-7xl mx-auto px-6'>
          <div className='text-center mb-16'>
            <div className='inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-gray-200/50 shadow-lg'>
              <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
              <span className='text-sm font-semibold text-gray-700'>
                LIVE DEMOS
              </span>
            </div>
            <h2 className='text-5xl md:text-6xl font-bold mb-6'>
              <span className='bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent'>
                Product
              </span>{' '}
              Showcase
            </h2>
            <p className='text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed'>
              Experience WishLuu's powerful features through our comprehensive
              video demonstrations
            </p>
          </div>

          <div className='grid lg:grid-cols-3 gap-16'>
            {/* Video Player */}
            <div className='lg:col-span-2'>
              <div className='relative'>
                <div className='bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-200/20'>
                  <VideoPlayer
                    src={demoVideos[activeVideo]?.videoUrl || ''}
                    title={demoVideos[activeVideo]?.title || ''}
                    className='w-full'
                  />
                </div>
                <div className='absolute -top-4 -right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg'>
                  {demoVideos[activeVideo]?.duration || ''}
                </div>
              </div>

              <div className='mt-8 p-8 bg-white rounded-3xl shadow-xl border border-gray-100'>
                <div className='flex items-start space-x-4'>
                  <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl'>
                    {demoVideos[activeVideo]?.icon || '🎥'}
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-2xl font-bold text-gray-800 mb-3'>
                      {demoVideos[activeVideo]?.title || ''}
                    </h3>
                    <p className='text-gray-600 text-lg leading-relaxed'>
                      {demoVideos[activeVideo]?.description || ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Thumbnails */}
            <div className='space-y-6'>
              <div className='text-center lg:text-left'>
                <h3 className='text-2xl font-bold text-gray-800 mb-2'>
                  Available Demos
                </h3>
                <p className='text-gray-600'>Select a video to watch</p>
              </div>

              <div className='space-y-4'>
                {demoVideos.map((video, index) => (
                  <div
                    key={video.id}
                    onClick={() => setActiveVideo(index)}
                    className={`group cursor-pointer rounded-2xl p-6 transition-all duration-300 ${
                      activeVideo === index
                        ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg'
                        : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-purple-200 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className='flex items-center space-x-4'>
                      <div
                        className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
                          activeVideo === index
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'bg-gray-100 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600'
                        }`}
                      >
                        {video.icon}
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-bold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors'>
                          {video.title}
                        </h4>
                        <p className='text-sm text-gray-600 mb-2 line-clamp-2'>
                          {video.description}
                        </p>
                        <div className='flex items-center justify-between'>
                          <span className='text-xs text-gray-500 font-medium'>
                            {video.duration}
                          </span>
                          {activeVideo === index && (
                            <span className='text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium'>
                              Playing
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
