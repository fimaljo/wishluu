'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { useFirebaseWishes } from '@/hooks/useFirebaseWishes';
import { useAuth } from '@/contexts/AuthContext';
import { Wish } from '@/hooks/useFirebaseWishes';

export default function DashboardPage() {
  const { user } = useAuth();
  const { wishes, isLoading, error, deleteWish, refreshWishes } =
    useFirebaseWishes();
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteWish = async (wish: Wish) => {
    setSelectedWish(wish);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedWish) return;

    const result = await deleteWish(selectedWish.id);
    if (result.success) {
      setShowDeleteConfirm(false);
      setSelectedWish(null);
    } else {
      alert(`Failed to delete wish: ${result.error}`);
    }
  };

  const handleCopyShareLink = (wish: Wish) => {
    const shareUrl = `${window.location.origin}/wish/${wish.shareId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  const handleViewWish = (wish: Wish) => {
    const shareUrl = `${window.location.origin}/wish/${wish.shareId}`;
    window.open(shareUrl, '_blank');
  };

  if (!user) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center'>
        <div className='bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4 text-center'>
          <div className='text-6xl mb-4'>🔐</div>
          <h1 className='text-2xl font-bold text-gray-800 mb-2'>
            Sign In Required
          </h1>
          <p className='text-gray-600 mb-6'>
            Please sign in to view your dashboard and manage your wishes.
          </p>
          <Link href='/'>
            <Button variant='primary'>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-pink-50'>
      {/* Header */}
      <div className='bg-white shadow-sm'>
        <div className='w-full max-w-[1800px] mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-lg'>W</span>
              </div>
              <span className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                WishLuu Dashboard
              </span>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='text-gray-600'>
                Welcome, {user.displayName || user.email}
              </span>
              <Link href='/'>
                <Button variant='outline'>Create New Wish</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='w-full max-w-[1800px] mx-auto px-6 py-12'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-4xl md:text-5xl font-bold mb-4'>
              <span className='bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                My Wishes
              </span>
            </h1>
            <p className='text-xl text-gray-600'>
              Manage and share your created wishes
            </p>
          </div>
          <div className='flex items-center space-x-4'>
            <Button
              variant='outline'
              onClick={refreshWishes}
              disabled={isLoading}
            >
              🔄 Refresh
            </Button>
            <Link href='/'>
              <Button variant='primary'>+ Create New Wish</Button>
            </Link>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className='bg-red-50 border border-red-200 rounded-2xl p-6 mb-6'>
            <div className='flex items-center'>
              <div className='text-red-500 text-2xl mr-3'>⚠️</div>
              <div>
                <h3 className='text-lg font-semibold text-red-800 mb-1'>
                  Error Loading Wishes
                </h3>
                <p className='text-red-600 mb-3'>{error}</p>
                <button
                  onClick={refreshWishes}
                  className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors'
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Wishes List */}
        <div className='bg-white rounded-2xl shadow-lg p-6'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6'>
            Your Wishes ({wishes.length})
          </h2>

          {isLoading ? (
            <div className='space-y-4'>
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className='border border-gray-200 rounded-lg p-4 animate-pulse'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-4'>
                      <div className='w-12 h-12 bg-gray-200 rounded-lg'></div>
                      <div className='space-y-2'>
                        <div className='bg-gray-200 rounded h-5 w-32'></div>
                        <div className='bg-gray-200 rounded h-4 w-48'></div>
                        <div className='flex space-x-2'>
                          <div className='bg-gray-200 rounded-full h-6 w-16'></div>
                          <div className='bg-gray-200 rounded-full h-6 w-16'></div>
                        </div>
                      </div>
                    </div>
                    <div className='flex space-x-2'>
                      <div className='bg-gray-200 rounded h-8 w-16'></div>
                      <div className='bg-gray-200 rounded h-8 w-16'></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='grid gap-4'>
              {wishes.map(wish => (
                <div
                  key={wish.id}
                  className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-4'>
                      <div className='w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-2xl'>
                        🎉
                      </div>
                      <div>
                        <h3 className='text-lg font-semibold text-gray-800'>
                          {wish.title || `Wish for ${wish.recipientName}`}
                        </h3>
                        <p className='text-gray-600 text-sm'>
                          For {wish.recipientName}
                        </p>
                        {wish.message && (
                          <p className='text-gray-500 text-sm mt-1'>
                            "{wish.message.substring(0, 100)}..."
                          </p>
                        )}
                        <div className='flex items-center space-x-4 mt-2'>
                          <span className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full'>
                            {wish.theme} theme
                          </span>
                          <span className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full'>
                            {wish.elements?.length || 0} elements
                          </span>
                          <span className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full'>
                            👁️ {wish.viewCount || 0}
                          </span>
                          <span className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full'>
                            ❤️ {wish.likeCount || 0}
                          </span>
                          <span className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full'>
                            {wish.isPublic ? 'Public' : 'Private'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleViewWish(wish)}
                      >
                        👁️ View
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleCopyShareLink(wish)}
                      >
                        📋 Share
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleDeleteWish(wish)}
                        className='text-red-600 hover:text-red-700'
                      >
                        🗑️ Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && !error && wishes.length === 0 && (
            <div className='text-center py-12 text-gray-500'>
              <div className='text-4xl mb-4'>🎉</div>
              <p className='text-lg'>No wishes created yet</p>
              <p className='text-sm mb-6'>
                Start creating beautiful wishes to share with your loved ones
              </p>
              <Link href='/'>
                <Button variant='primary'>Create Your First Wish</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedWish && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-md w-full p-6'>
            <div className='text-center'>
              <div className='text-6xl mb-4'>🗑️</div>
              <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                Delete Wish
              </h3>
              <p className='text-gray-600 mb-6'>
                Are you sure you want to delete "
                {selectedWish.title || `Wish for ${selectedWish.recipientName}`}
                "? This action cannot be undone.
              </p>
              <div className='flex space-x-3'>
                <Button
                  variant='outline'
                  onClick={() => setShowDeleteConfirm(false)}
                  className='flex-1'
                >
                  Cancel
                </Button>
                <Button
                  variant='primary'
                  onClick={confirmDelete}
                  className='flex-1 bg-red-600 hover:bg-red-700'
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
