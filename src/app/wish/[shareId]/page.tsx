'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { WishCanvas } from '@/features/wish-builder/components/WishCanvas';
import { Loading } from '@/components/ui/Loading';
import { useFirebaseWishes } from '@/hooks/useFirebaseWishes';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function SharedWishPage() {
  const params = useParams();
  const shareId = params.shareId as string;
  const { getWishByShareId, isLoading, error } = useFirebaseWishes({
    autoLoad: false,
  });
  const [wish, setWish] = useState<any>(null);

  useEffect(() => {
    if (shareId) {
      loadWish();
    }
  }, [shareId]);

  const loadWish = async () => {
    console.log('Loading wish with shareId:', shareId);
    const result = await getWishByShareId(shareId);
    console.log('Wish load result:', result);

    if (result.success && result.data) {
      // Ensure elements and stepSequence are properly parsed
      const processedWish = {
        ...result.data,
        elements: Array.isArray(result.data.elements)
          ? result.data.elements
          : [],
        stepSequence: Array.isArray(result.data.stepSequence)
          ? result.data.stepSequence
          : [],
      };
      console.log('Processed wish data:', processedWish);
      console.log('Music data:', (processedWish as any).music);
      setWish(processedWish);
    } else {
      console.error('Failed to load wish:', result.error);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (err) {
      return 'Unknown date';
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center'>
        <div className='text-center'>
          <Loading />
          <p className='mt-4 text-gray-600'>Loading your special wish...</p>
        </div>
      </div>
    );
  }

  if (error || !wish) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4'>
        <div className='bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto text-center'>
          <div className='text-6xl mb-4'>💔</div>
          <h1 className='text-2xl font-bold text-gray-800 mb-2'>
            Wish Not Found
          </h1>
          <p className='text-gray-600 mb-6'>
            {error || "This wish doesn't exist or is no longer available."}
          </p>
          <Link href='/'>
            <Button variant='primary' className='w-full'>
              Create Your Own Wish
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      {/* Header */}
      <div className='bg-white shadow-sm sticky top-0 z-50'>
        <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center'>
                <span className='text-white font-bold text-xl'>W</span>
              </div>
              <div className='hidden sm:block'>
                <span className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                  WishLuu
                </span>
              </div>
            </div>

            <div className='flex items-center'>
              <Link href='/'>
                <Button variant='primary' size='sm' className='px-4 sm:px-6'>
                  <span className='hidden sm:inline'>Create Your Own</span>
                  <span className='sm:hidden'>Create</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Wish Canvas - Full Screen */}
      <div className='w-full h-screen'>
        <WishCanvas
          elements={wish.elements || []}
          stepSequence={wish.stepSequence || []}
          theme={wish.theme || 'purple'}
          customBackgroundColor={wish.customBackgroundColor}
          isPreviewMode={true}
          selectedElement={null}
          onSelectElement={() => {}}
          onUpdateElement={() => {}}
          recipientName={wish.recipientName || ''}
          message={wish.message || ''}
          music={(wish as any).music || 'birthday-song'}
          wishId={shareId}
        />
      </div>

      {/* Footer */}
      <div className='bg-white border-t'>
        <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='text-center'>
            <p className='text-gray-600 mb-2'>Made with ❤️ using WishLuu</p>
            <p className='text-sm text-gray-500'>
              Create your own beautiful wishes at{' '}
              <Link
                href='/'
                className='text-purple-600 hover:text-purple-700 font-medium'
              >
                wishluu.com
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
