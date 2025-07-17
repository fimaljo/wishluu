'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { useFirebaseWishes } from '@/hooks/useFirebaseWishes';
import { useAuth } from '@/contexts/AuthContext';
import { Wish } from '@/hooks/useFirebaseWishes';
import { ExpirationBadge } from '@/components/ui/ExpirationBadge';

export default function DashboardPage() {
  const { user, isAdmin, signOut } = useAuth();
  const { wishes, isLoading, error, deleteWish, refreshWishes } =
    useFirebaseWishes();
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copiedWishId, setCopiedWishId] = useState<string | null>(null);

  // Calculate dashboard statistics
  const stats = {
    totalWishes: wishes.length,
    publicWishes: wishes.filter(w => w.isPublic).length,
    totalViews: wishes.reduce((sum, w) => sum + (w.viewCount || 0), 0),
    totalLikes: wishes.reduce((sum, w) => sum + (w.likeCount || 0), 0),
    expiringSoon: wishes.filter(w => {
      if (!w.expiresAt) return false;
      const daysUntilExpiry = Math.ceil(
        (new Date(w.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
    }).length,
  };

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

  const handleCopyShareLink = async (wish: Wish) => {
    const shareUrl = `${window.location.origin}/wish/${wish.shareId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedWishId(wish.id);
      setTimeout(() => setCopiedWishId(null), 2000);
    } catch (err) {
      alert('Failed to copy link. Please copy manually: ' + shareUrl);
    }
  };

  const handleViewWish = (wish: Wish) => {
    const shareUrl = `${window.location.origin}/wish/${wish.shareId}`;
    window.open(shareUrl, '_blank');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to home page after sign out
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4'>
        <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 max-w-md w-full text-center'>
          <div className='w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6'>
            <svg
              className='w-10 h-10 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
              />
            </svg>
          </div>
          <h1 className='text-3xl font-bold text-gray-800 mb-3'>
            Welcome to WishLuu
          </h1>
          <p className='text-gray-600 mb-8 leading-relaxed'>
            Please sign in to access your dashboard and create beautiful wishes.
          </p>
          <Link href='/'>
            <Button variant='primary' size='lg' className='w-full'>
              ✨ Get Started
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      {/* Header */}
      <header className='bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center space-x-4'>
              <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
                <span className='text-white font-bold text-lg'>W</span>
              </div>
              <div>
                <h1 className='text-xl font-bold text-gray-800'>WishLuu</h1>
                <p className='text-sm text-gray-500'>Create & Share Wishes</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <div className='hidden md:flex items-center space-x-2 text-sm text-gray-600'>
                <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                <span>
                  Welcome back, {user.displayName || user.email?.split('@')[0]}!
                  👋
                </span>
              </div>
              {isAdmin && (
                <div className='flex items-center space-x-3'>
                  <Link
                    href='/admin/templates'
                    className='text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium'
                  >
                    ⚙️ Admin
                  </Link>
                  <Link
                    href='/admin/cleanup'
                    className='text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium'
                  >
                    🧹 Cleanup
                  </Link>
                </div>
              )}
              <Button
                variant='outline'
                size='sm'
                onClick={handleSignOut}
                className='text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300'
              >
                <svg
                  className='w-4 h-4 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                  />
                </svg>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Welcome Section */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-800 mb-4'>
            Welcome back, {user.displayName || user.email?.split('@')[0]}! 👋
          </h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Ready to create something beautiful? Choose how you'd like to get
            started.
          </p>
        </div>

        {/* Quick Actions */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
          <Link href='/templates' className='group'>
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 text-center'>
              <div className='w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform'>
                <span className='text-3xl'>🎨</span>
              </div>
              <h3 className='text-2xl font-bold text-gray-800 mb-3'>
                Browse Templates
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                Choose from beautiful templates to create your wish
              </p>
            </div>
          </Link>

          <Link href='/wishes/create/custom-blank' className='group'>
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 text-center'>
              <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform'>
                <span className='text-3xl'>✨</span>
              </div>
              <h3 className='text-2xl font-bold text-gray-800 mb-3'>
                Create Custom Wish
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                Start from scratch and build something unique
              </p>
            </div>
          </Link>

          {/* My Wishes - active, not clickable */}
          <div className='bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 shadow-2xl border-4 border-blue-300 text-center text-white cursor-default select-none ring-2 ring-blue-400'>
            <div className='w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6'>
              <span className='text-3xl'>📝</span>
            </div>
            <h3 className='text-2xl font-bold mb-3'>My Wishes</h3>
            <p className='text-white/90 leading-relaxed'>
              View and manage your created wishes
            </p>
          </div>
        </div>

        {/* Quick Stats
        <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 mb-12'>
          <h3 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
            Quick Stats
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            <div className='text-center'>
              <div className='text-4xl font-bold text-blue-600 mb-2'>
                {stats.totalWishes}
              </div>
              <div className='text-gray-600 font-medium'>Wishes Created</div>
            </div>
            <div className='text-center'>
              <div className='text-4xl font-bold text-green-600 mb-2'>
                {stats.publicWishes}
              </div>
              <div className='text-gray-600 font-medium'>Wishes Shared</div>
            </div>
            <div className='text-center'>
              <div className='text-4xl font-bold text-purple-600 mb-2'>
                {wishes.filter(w => w.theme).length}
              </div>
              <div className='text-gray-600 font-medium'>Templates Used</div>
            </div>
            <div className='text-center'>
              <div className='text-4xl font-bold text-orange-600 mb-2'>
                {stats.totalViews}
              </div>
              <div className='text-gray-600 font-medium'>Total Views</div>
            </div>
          </div>
        </div> */}

        {/* Error State */}
        {error && (
          <div className='bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 mb-6'>
            <div className='flex items-center'>
              <div className='text-red-500 text-2xl mr-4'>⚠️</div>
              <div className='flex-1'>
                <h3 className='text-lg font-semibold text-red-800 mb-1'>
                  Error Loading Wishes
                </h3>
                <p className='text-red-600 mb-3'>{error}</p>
                <button
                  onClick={refreshWishes}
                  className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium'
                >
                  🔄 Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Wishes */}
        {wishes.length > 0 && (
          <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden'>
            <div className='p-6 border-b border-gray-100'>
              <div className='flex items-center justify-between'>
                <h3 className='text-2xl font-bold text-gray-800 flex items-center'>
                  <span className='mr-3'>📝</span>
                  Recent Wishes
                  <span className='ml-2 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium'>
                    {wishes.length}
                  </span>
                </h3>
                <Button
                  variant='outline'
                  onClick={refreshWishes}
                  disabled={isLoading}
                  size='sm'
                >
                  🔄 Refresh
                </Button>
              </div>
            </div>

            <div className='divide-y divide-gray-100'>
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className='p-6 animate-pulse'>
                      <div className='flex items-center space-x-4'>
                        <div className='w-12 h-12 bg-gray-200 rounded-lg'></div>
                        <div className='flex-1 space-y-2'>
                          <div className='h-4 bg-gray-200 rounded w-1/4'></div>
                          <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                          <div className='flex space-x-2'>
                            <div className='h-6 bg-gray-200 rounded-full w-16'></div>
                            <div className='h-6 bg-gray-200 rounded-full w-16'></div>
                          </div>
                        </div>
                        <div className='flex space-x-2'>
                          <div className='h-8 bg-gray-200 rounded w-16'></div>
                          <div className='h-8 bg-gray-200 rounded w-16'></div>
                        </div>
                      </div>
                    </div>
                  ))
                : wishes.slice(0, 5).map(wish => (
                    <div
                      key={wish.id}
                      className='p-6 hover:bg-gray-50/50 transition-colors'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-4 flex-1 min-w-0'>
                          <div className='w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl flex items-center justify-center flex-shrink-0'>
                            <span className='text-2xl'>🎉</span>
                          </div>
                          <div className='flex-1 min-w-0'>
                            <h4 className='text-lg font-semibold text-gray-800 truncate'>
                              {wish.title || `Wish for ${wish.recipientName}`}
                            </h4>
                            <p className='text-sm text-gray-600 mt-1'>
                              For {wish.recipientName}
                            </p>
                            {wish.message && (
                              <p className='text-sm text-gray-500 mt-2 line-clamp-2'>
                                {wish.message}
                              </p>
                            )}
                            <div className='flex flex-wrap items-center gap-2 mt-3'>
                              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                                {wish.theme}
                              </span>
                              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                                {wish.viewCount || 0} views
                              </span>
                              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                                {wish.likeCount || 0} likes
                              </span>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  wish.isPublic
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {wish.isPublic ? 'Public' : 'Private'}
                              </span>
                              <ExpirationBadge expiresAt={wish.expiresAt} />
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center space-x-2 ml-4'>
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
                            className={
                              copiedWishId === wish.id
                                ? 'bg-green-50 border-green-300 text-green-700'
                                : ''
                            }
                          >
                            {copiedWishId === wish.id
                              ? '✅ Copied!'
                              : '📋 Share'}
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleDeleteWish(wish)}
                            className='text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300'
                          >
                            🗑️ Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>

            {wishes.length > 5 && (
              <div className='p-6 border-t border-gray-100 text-center'>
                <Link href='/dashboard'>
                  <Button variant='outline'>
                    View All Wishes ({wishes.length})
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && wishes.length === 0 && (
          <div className='text-center py-16'>
            <div className='w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-6'>
              <span className='text-4xl'>🎉</span>
            </div>
            <h3 className='text-2xl font-bold text-gray-800 mb-3'>
              No wishes yet
            </h3>
            <p className='text-gray-600 mb-8 max-w-md mx-auto leading-relaxed'>
              Start creating beautiful, personalized wishes to share with your
              loved ones. Each wish is a unique expression of your care and
              creativity.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link href='/templates'>
                <Button variant='primary' size='lg'>
                  🎨 Browse Templates
                </Button>
              </Link>
              <Link href='/wishes/create/custom-blank'>
                <Button variant='outline' size='lg'>
                  ✨ Create Custom Wish
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedWish && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-md w-full p-8'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                <span className='text-3xl'>🗑️</span>
              </div>
              <h3 className='text-2xl font-bold text-gray-800 mb-3'>
                Delete Wish
              </h3>
              <p className='text-gray-600 mb-8 leading-relaxed'>
                Are you sure you want to delete "
                <span className='font-semibold text-blue-600'>
                  {selectedWish.title ||
                    `Wish for ${selectedWish.recipientName}`}
                </span>
                "? This action cannot be undone.
              </p>
              <div className='flex space-x-4'>
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
                  🗑️ Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
