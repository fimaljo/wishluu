'use client';

import React, { useState } from 'react';

interface VideoPlayerProps {
  src: string;
  title: string;
  fallbackImage?: string;
  className?: string;
}

export function VideoPlayer({
  src,
  title,
  fallbackImage,
  className = '',
}: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');
  const isVimeo = src.includes('vimeo.com');

  if (hasError) {
    return (
      <div
        className={`bg-gray-900 rounded-2xl overflow-hidden aspect-video flex items-center justify-center ${className}`}
      >
        <div className='text-center text-white p-8'>
          <div className='text-4xl mb-4'>🎥</div>
          <h3 className='text-lg font-semibold mb-2'>Video Unavailable</h3>
          <p className='text-gray-300 text-sm'>
            This demo video is coming soon. Check back later!
          </p>
        </div>
      </div>
    );
  }

  if (isYouTube || isVimeo) {
    return (
      <div
        className={`bg-gray-900 rounded-2xl overflow-hidden aspect-video ${className}`}
      >
        <iframe
          src={src}
          title={title}
          className='w-full h-full'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
        />
        {isLoading && (
          <div className='absolute inset-0 bg-gray-900 flex items-center justify-center'>
            <div className='text-white text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
              <p>Loading video...</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // For self-hosted videos
  return (
    <div
      className={`bg-gray-900 rounded-2xl overflow-hidden aspect-video ${className}`}
    >
      <video
        src={src}
        title={title}
        className='w-full h-full'
        controls
        poster={fallbackImage}
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onError={() => setHasError(true)}
      >
        <source src={src} type='video/mp4' />
        Your browser does not support the video tag.
      </video>
      {isLoading && (
        <div className='absolute inset-0 bg-gray-900 flex items-center justify-center'>
          <div className='text-white text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
            <p>Loading video...</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface VideoThumbnailProps {
  title: string;
  description: string;
  duration: string;
  isActive: boolean;
  onClick: () => void;
  thumbnail?: string;
}

export function VideoThumbnail({
  title,
  description,
  duration,
  isActive,
  onClick,
  thumbnail,
}: VideoThumbnailProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl p-4 transition-all ${
        isActive
          ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300'
          : 'bg-gray-50 hover:bg-gray-100'
      }`}
    >
      <div className='flex items-center space-x-3'>
        <div className='relative'>
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className='w-16 h-12 bg-gray-300 rounded-lg object-cover'
            />
          ) : (
            <div className='w-16 h-12 bg-gray-300 rounded-lg flex items-center justify-center'>
              <span className='text-gray-600'>▶️</span>
            </div>
          )}
          <div className='absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded'>
            {duration}
          </div>
        </div>
        <div className='flex-1'>
          <h4 className='font-medium text-sm text-gray-800'>{title}</h4>
          <p className='text-xs text-gray-600 mt-1'>{description}</p>
        </div>
      </div>
    </div>
  );
}
