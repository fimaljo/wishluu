'use client';

import React, { useState } from 'react';
import { CommentWall } from '@/components/ui/CommentWall';

export default function TestCommentWallPage() {
  const [postType, setPostType] = useState<'photo' | 'video'>('photo');
  const [mediaUrl, setMediaUrl] = useState('');
  const [postDescription, setPostDescription] = useState('');

  const testWishId = 'test-wish-123';

  return (
    <div className='min-h-screen bg-gray-100 p-4'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-2xl font-bold mb-6'>Comment Wall Test</h1>

        {/* Test Controls */}
        <div className='bg-white p-4 rounded-lg shadow mb-6'>
          <h2 className='text-lg font-semibold mb-4'>Test Configuration</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Post Type
              </label>
              <select
                value={postType}
                onChange={e => setPostType(e.target.value as 'photo' | 'video')}
                className='w-full p-2 border rounded'
              >
                <option value='photo'>Photo</option>
                <option value='video'>Video</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium mb-2'>
                Media URL
              </label>
              <input
                type='text'
                value={mediaUrl}
                onChange={e => setMediaUrl(e.target.value)}
                placeholder='Enter photo or video URL'
                className='w-full p-2 border rounded'
              />
            </div>
          </div>

          <div className='mt-4'>
            <label className='block text-sm font-medium mb-2'>
              Post Description
            </label>
            <textarea
              value={postDescription}
              onChange={e => setPostDescription(e.target.value)}
              placeholder='Enter post description'
              className='w-full p-2 border rounded'
              rows={3}
            />
          </div>
        </div>

        {/* Preset Examples */}
        <div className='bg-white p-4 rounded-lg shadow mb-6'>
          <h2 className='text-lg font-semibold mb-4'>Quick Test Examples</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <button
              onClick={() => {
                setPostType('photo');
                setMediaUrl('https://picsum.photos/500/300');
                setPostDescription('Beautiful sunset at the beach! 🌅');
              }}
              className='p-3 border rounded hover:bg-gray-50'
            >
              Random Photo
            </button>

            <button
              onClick={() => {
                setPostType('video');
                setMediaUrl(
                  'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
                );
                setPostDescription('Amazing video content! 🎥');
              }}
              className='p-3 border rounded hover:bg-gray-50'
            >
              Sample Video
            </button>

            <button
              onClick={() => {
                setPostType('video');
                setMediaUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
                setPostDescription('Check out this YouTube video! 📺');
              }}
              className='p-3 border rounded hover:bg-gray-50'
            >
              YouTube Video
            </button>

            <button
              onClick={() => {
                setPostType('photo');
                setMediaUrl('');
                setPostDescription('No media, just thoughts... 💭');
              }}
              className='p-3 border rounded hover:bg-gray-50'
            >
              No Media
            </button>
          </div>
        </div>

        {/* Comment Wall Display */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-4'>Comment Wall Preview</h2>
          <div className='flex justify-center'>
            <CommentWall
              postType={postType}
              mediaUrl={mediaUrl}
              postDescription={postDescription}
              wishId={testWishId}
            />
          </div>
        </div>

        {/* Test Instructions */}
        <div className='bg-blue-50 p-4 rounded-lg mt-6'>
          <h3 className='font-semibold mb-2'>Test Instructions:</h3>
          <ul className='text-sm space-y-1'>
            <li>
              • Try clicking "View all comments" - it should NOT trigger slide
              navigation
            </li>
            <li>• Add comments with and without names</li>
            <li>• Test the comment form interactions</li>
            <li>• Verify no userAvatar URLs are being stored</li>
            <li>
              • Check that all interactive elements work without triggering
              canvas clicks
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
