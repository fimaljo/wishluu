'use client';

import React, { useState } from 'react';
import { WishCard } from '../components/WishCard';
import { WishCreator } from '../components/WishCreator';
import { useWishManagement } from '../hooks/useWishManagement';
import { useWishContext } from '@/contexts/WishContext';
import { Wish } from '@/types';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';

export function WishListPage() {
  const { state } = useWishContext();
  const { wishes, loading } = state;
  const { removeWish, duplicateWish, shareWish, likeWish, error } = useWishManagement();
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [showCreator, setShowCreator] = useState(false);

  // Filter wishes based on occasion
  const filteredWishes = wishes.filter((wish: Wish) => {
    if (filter === 'all') return true;
    return wish.occasion === filter;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this wish?')) {
      await removeWish(id);
    }
  };

  const handleDuplicate = async (wish: Wish) => {
    const duplicated = await duplicateWish(wish);
    if (duplicated) {
      alert('Wish duplicated successfully!');
    }
  };

  const handleShare = async (wish: Wish) => {
    try {
      const shareUrl = await shareWish(wish);
      alert(`Share URL copied to clipboard: ${shareUrl}`);
    } catch (err) {
      alert('Failed to share wish');
    }
  };

  const handleLike = async (wish: Wish) => {
    await likeWish(wish.id, wish.likes || 0);
  };

  const handleWishCreated = (wish: any) => {
    // TODO: Add the new wish to the list
    console.log('New wish created:', wish);
    setShowCreator(false);
  };

  if (showCreator) {
    return <WishCreator onBack={() => setShowCreator(false)} onWishCreated={handleWishCreated} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading variant="spinner" size="lg" text="Loading wishes..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Wishes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create, manage, and share your beautiful wishes with loved ones
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilter('all')}
              className="px-4 py-2"
            >
              All Wishes ({wishes.length})
            </Button>
            <Button
              variant={filter === 'birthday' ? 'primary' : 'outline'}
              onClick={() => setFilter('birthday')}
              className="px-4 py-2"
            >
              🎂 Birthday
            </Button>
            <Button
              variant={filter === 'valentine' ? 'primary' : 'outline'}
              onClick={() => setFilter('valentine')}
              className="px-4 py-2"
            >
              💕 Valentine
            </Button>
            <Button
              variant={filter === 'proposal' ? 'primary' : 'outline'}
              onClick={() => setFilter('proposal')}
              className="px-4 py-2"
            >
              💍 Proposal
            </Button>
          </div>
        </div>

        {/* Wishes Grid */}
        {filteredWishes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No wishes yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first wish to get started!
            </p>
            <Button
              variant="primary"
              onClick={() => setShowCreator(true)}
              className="px-8 py-3"
            >
              Create Your First Wish
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWishes.map((wish: Wish) => (
              <WishCard
                key={wish.id}
                wish={wish}
                onView={(id) => window.location.href = `/wish/${id}`}
                onEdit={(wish) => setSelectedWish(wish)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              variant="primary"
              onClick={() => setShowCreator(true)}
              className="px-6 py-3"
            >
              ✨ Create New Wish
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="px-6 py-3"
            >
              🏠 Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 