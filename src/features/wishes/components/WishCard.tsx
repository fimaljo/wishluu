'use client';

import React from 'react';
import { Wish } from '@/types';
import { formatDate } from '@/lib/utils';
import { ExpirationBadge } from '@/components/ui/ExpirationBadge';

interface WishCardProps {
  wish: Wish;
  onEdit?: (wish: Wish) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export function WishCard({ wish, onEdit, onDelete, onView }: WishCardProps) {
  const occasions = {
    birthday: { emoji: '🎂', color: 'from-pink-400 to-rose-500' },
    valentine: { emoji: '💕', color: 'from-red-400 to-pink-500' },
    'mothers-day': { emoji: '🌷', color: 'from-purple-400 to-pink-500' },
    proposal: { emoji: '💍', color: 'from-blue-400 to-purple-500' },
    anniversary: { emoji: '💑', color: 'from-green-400 to-blue-500' },
    graduation: { emoji: '🎓', color: 'from-yellow-400 to-orange-500' },
    'thank-you': { emoji: '🙏', color: 'from-indigo-400 to-purple-500' },
    congratulations: { emoji: '🎉', color: 'from-cyan-400 to-blue-500' },
  };

  const occasionData = occasions[wish.occasion as keyof typeof occasions];

  return (
    <div className='wish-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden'>
      {/* Header */}
      <div className={`bg-gradient-to-r ${occasionData.color} p-6 text-white`}>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <span className='text-3xl'>{occasionData.emoji}</span>
            <div>
              <h3 className='text-xl font-bold'>{wish.recipientName}</h3>
              <p className='text-sm opacity-90'>
                Created {formatDate(wish.createdAt)}
              </p>
            </div>
          </div>
          <div className='text-right'>
            <div className='text-sm opacity-90'>Views: {wish.views || 0}</div>
            <div className='text-sm opacity-90'>Likes: {wish.likes || 0}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='p-6'>
        <p className='text-gray-700 line-clamp-3 mb-4'>{wish.message}</p>

        {/* Tags */}
        <div className='flex flex-wrap gap-2 mb-4'>
          <span className='px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm'>
            {wish.theme}
          </span>
          <span className='px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm'>
            {wish.animation}
          </span>
          {wish.isPublic && (
            <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm'>
              Public
            </span>
          )}
          {/* Expiration Badge */}
          <ExpirationBadge expiresAt={wish.expiresAt} />
        </div>

        {/* Actions */}
        <div className='flex gap-2'>
          {onView && (
            <button
              onClick={() => onView(wish.id)}
              className='flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300'
            >
              View Wish
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(wish)}
              className='px-4 py-2 border-2 border-purple-500 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors'
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(wish.id)}
              className='px-4 py-2 border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors'
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
