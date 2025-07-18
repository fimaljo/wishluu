'use client';

import React, { useState } from 'react';
import { WishCard } from '../components/WishCard';
import { WishCreator } from '../components/WishCreator';
import { useWishManagement } from '../hooks/useWishManagement';
import {
  useFirebaseWishes,
  Wish as FirebaseWish,
} from '@/hooks/useFirebaseWishes';
import { useAuth } from '@/contexts/AuthContext';
import { Wish } from '@/types';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import Link from 'next/link';
import { useNotification } from '@/components/ui/Notification';

export function WishListPage() {
  const { user, isAdmin } = useAuth();
  const { wishes, isLoading, error, loadUserWishes } = useFirebaseWishes();
  const { removeWish, duplicateWish, shareWish, likeWish } =
    useWishManagement();
  const [selectedWish, setSelectedWish] = useState<FirebaseWish | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [showCreator, setShowCreator] = useState(false);
  const { notification, showSuccess, showError } = useNotification();

  // Convert Firebase wishes to the format expected by WishCard
  const convertedWishes: Wish[] = wishes.map((wish: FirebaseWish) => {
    console.log('Converting wish:', wish.id, 'expiresAt:', wish.expiresAt);
    return {
      id: wish.id,
      recipientName: wish.recipientName,
      occasion: 'birthday', // Default occasion since Firebase doesn't store this
      message: wish.message,
      theme: wish.theme,
      animation: 'fade', // Default animation
      createdAt: wish.createdAt?.toDate
        ? wish.createdAt.toDate().toISOString()
        : new Date().toISOString(),
      isPublic: wish.isPublic,
      views: wish.viewCount,
      likes: wish.likeCount,
      elements: wish.elements || [],
      ...(wish.customBackgroundColor && {
        customBackgroundColor: wish.customBackgroundColor,
      }),
      ...(wish.shareId && { shareId: wish.shareId }),
      ...(wish.updatedAt?.toDate && {
        updatedAt: wish.updatedAt.toDate().toISOString(),
      }),
      ...(wish.createdBy && { createdBy: wish.createdBy }),
      stepSequence: wish.stepSequence || [],
      ...(wish.expiresAt && { expiresAt: wish.expiresAt }),
    };
  });

  // Filter wishes based on occasion
  const filteredWishes = convertedWishes.filter((wish: Wish) => {
    if (filter === 'all') return true;
    return wish.occasion === filter;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this wish?')) {
      await removeWish(id);
      // Refresh the wishes list after deletion
      loadUserWishes();
    }
  };

  const handleDuplicate = async (wish: Wish) => {
    const duplicated = await duplicateWish(wish);
    if (duplicated) {
      showSuccess('Wish duplicated successfully!');
      // Refresh the wishes list after duplication
      loadUserWishes();
    }
  };

  const handleShare = async (wish: Wish) => {
    try {
      const shareUrl = await shareWish(wish);
      showSuccess(`Share URL copied to clipboard: ${shareUrl}`);
    } catch (err) {
      showError('Failed to share wish');
    }
  };

  const handleLike = async (wish: Wish) => {
    await likeWish(wish.id, wish.likes || 0);
  };

  const handleWishCreated = (wish: any) => {
    // Refresh the wishes list after creation
    loadUserWishes();
    setShowCreator(false);
  };

  const handleRefresh = () => {
    loadUserWishes();
  };

  if (showCreator) {
    return (
      <WishCreator
        onBack={() => setShowCreator(false)}
        onWishCreated={handleWishCreated}
      />
    );
  }

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loading variant='spinner' size='lg' text='Loading wishes...' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8'>
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-300 ${
            notification.type === 'success'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
              : notification.type === 'error'
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
          }`}
        >
          <div className='flex items-center space-x-2'>
            <div className='text-2xl'>
              {notification.type === 'success'
                ? '🎉'
                : notification.type === 'error'
                  ? '❌'
                  : '💡'}
            </div>
            <div>
              <div className='font-semibold'>
                {notification.type === 'success'
                  ? 'Success!'
                  : notification.type === 'error'
                    ? 'Error'
                    : 'Info'}
              </div>
              <div className='text-sm opacity-90'>{notification.message}</div>
            </div>
            <button
              onClick={() => notification.onClose?.()}
              className='ml-4 text-white hover:text-gray-200 transition-colors'
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <div className='bg-white shadow-sm mb-8'>
        <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-lg'>W</span>
              </div>
              <span className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                WishLuu
              </span>
            </div>
            <div className='flex items-center space-x-6'>
              <Link
                href='/templates'
                className='text-gray-600 hover:text-purple-600 transition-colors'
              >
                Templates
              </Link>
              <Link
                href='/'
                className='text-gray-600 hover:text-purple-600 transition-colors'
              >
                Home
              </Link>
              {isAdmin && (
                <div className='flex items-center space-x-4'>
                  <Link
                    href='/admin/templates'
                    className='text-gray-600 hover:text-purple-600 transition-colors'
                  >
                    Admin
                  </Link>
                  <Link
                    href='/admin/cleanup'
                    className='text-gray-600 hover:text-purple-600 transition-colors'
                  >
                    Cleanup
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>Your Wishes</h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Create, manage, and share your beautiful wishes with loved ones
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
            <p className='text-red-700'>{error}</p>
            <Button onClick={handleRefresh} variant='outline' className='mt-2'>
              Try Again
            </Button>
          </div>
        )}

        {/* Filters */}
        <div className='mb-8'>
          <div className='flex flex-wrap gap-2 justify-center'>
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilter('all')}
              className='px-4 py-2'
            >
              All Wishes ({convertedWishes.length})
            </Button>
            <Button
              variant={filter === 'birthday' ? 'primary' : 'outline'}
              onClick={() => setFilter('birthday')}
              className='px-4 py-2'
            >
              🎂 Birthday
            </Button>
            <Button
              variant={filter === 'valentine' ? 'primary' : 'outline'}
              onClick={() => setFilter('valentine')}
              className='px-4 py-2'
            >
              💕 Valentine
            </Button>
            <Button
              variant={filter === 'proposal' ? 'primary' : 'outline'}
              onClick={() => setFilter('proposal')}
              className='px-4 py-2'
            >
              💍 Proposal
            </Button>
          </div>
        </div>

        {/* Wishes Grid */}
        {filteredWishes.length === 0 ? (
          <div className='text-center py-16'>
            <div className='text-6xl mb-4'>✨</div>
            <h3 className='text-2xl font-semibold text-gray-700 mb-2'>
              No wishes yet
            </h3>
            <p className='text-gray-500 mb-6'>
              Create your first wish to get started!
            </p>
            <Button
              variant='primary'
              onClick={() => setShowCreator(true)}
              className='px-8 py-3'
            >
              Create Your First Wish
            </Button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredWishes.map((wish: Wish) => (
              <WishCard
                key={wish.id}
                wish={wish}
                onView={id => (window.location.href = `/wish/${id}`)}
                onEdit={wish => setSelectedWish(wish as any)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className='mt-12 text-center'>
          <div className='flex flex-wrap gap-4 justify-center'>
            <Button
              variant='primary'
              onClick={() => setShowCreator(true)}
              className='px-6 py-3'
            >
              ✨ Create New Wish
            </Button>
            <Button
              variant='outline'
              onClick={() => (window.location.href = '/')}
              className='px-6 py-3'
            >
              🏠 Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
