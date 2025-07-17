'use client';

import React from 'react';
import { Template } from '@/types/templates';
import Link from 'next/link';

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onSelect: () => void;
  onPreview?: () => void;
}

export function TemplateCard({
  template,
  isSelected,
  onSelect,
  onPreview,
}: TemplateCardProps) {
  const difficultyColors = {
    easy: 'bg-green-500/20 text-green-700 border-green-300',
    medium: 'bg-yellow-500/20 text-yellow-700 border-yellow-300',
    hard: 'bg-orange-500/20 text-orange-700 border-orange-300',
    expert: 'bg-red-500/20 text-red-700 border-red-300',
  };

  const difficultyLabels = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    expert: 'Expert',
  };

  const elementIcons: { [key: string]: string } = {
    'balloons-interactive': '🎈',
    'beautiful-text': '✨',
    confetti: '🎊',
    'music-player': '🎵',
    cake: '🎂',
    candles: '🕯️',
    balloons: '🎈',
    music: '🎵',
    photos: '📸',
    text: '📝',
    frames: '🖼️',
    stickers: '🏷️',
    heart: '💖',
    sparkles: '✨',
    'love-messages': '💌',
    animations: '🎬',
    ring: '💍',
    'rose-petals': '🌹',
    'romantic-text': '💕',
    cap: '🎓',
    diploma: '📜',
    celebration: '🎉',
    'all-elements': '🎨',
  };

  return (
    <div
      className={`group relative cursor-pointer ${
        isSelected ? 'ring-4 ring-purple-500 ring-offset-2' : ''
      }`}
    >
      {/* Main Card - Clickable for creating wish */}
      <Link href={`/wishes/create/${template.id}`} className='block'>
        <div
          className={`bg-gradient-to-r ${template.color} p-8 rounded-2xl text-white text-center transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl h-full flex flex-col justify-center relative overflow-hidden border border-white/20 shadow-lg ${
            isSelected ? 'scale-105 shadow-2xl' : ''
          }`}
        >
          {/* Background Pattern */}
          <div className='absolute inset-0 opacity-10'>
            <div className='absolute top-4 right-4 w-16 h-16 rounded-full bg-white/20'></div>
            <div className='absolute bottom-4 left-4 w-8 h-8 rounded-full bg-white/20'></div>
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/10'></div>
          </div>

          {/* Difficulty Badge */}
          <div
            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${difficultyColors[template.difficulty]}`}
          >
            {difficultyLabels[template.difficulty]}
          </div>

          {/* Selection Indicator */}
          {isSelected && (
            <div className='absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg'>
              <div className='w-4 h-4 bg-purple-500 rounded-full'></div>
            </div>
          )}

          <div className='relative z-10'>
            {/* Template Thumbnail */}
            <div className='text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300'>
              {template.thumbnail}
            </div>

            {/* Template Name */}
            <h3 className='text-xl font-bold mb-3 text-shadow-lg'>
              {template.name}
            </h3>

            {/* Template Description */}
            <p className='text-white/90 text-sm mb-6 leading-relaxed'>
              {template.description}
            </p>

            {/* Elements Preview */}
            <div className='flex flex-wrap justify-center gap-1 mb-4'>
              {template.elements.slice(0, 4).map((element, index) => (
                <span
                  key={index}
                  className='bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium border border-white/30'
                  title={element}
                >
                  {elementIcons[element] || '🎨'} {element.replace('-', ' ')}
                </span>
              ))}
              {template.elements.length > 4 && (
                <span className='bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium border border-white/30'>
                  +{template.elements.length - 4} more
                </span>
              )}
            </div>

            {/* Occasion Badge */}
            <div className='bg-white/25 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-semibold border border-white/30 transform group-hover:scale-105 transition-transform duration-300 inline-block'>
              {template.occasion === 'custom' ? 'Custom' : template.occasion}
            </div>
          </div>

          {/* Hover Effect */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
        </div>
      </Link>

      {/* Preview Button - Separate from card click */}
      {onPreview && (
        <button
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            onPreview();
          }}
          className='absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-white transition-colors border border-white/30 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20'
          title='Preview Template'
        >
          👁️ Preview
        </button>
      )}

      {/* Selection Overlay */}
      {isSelected && (
        <div className='absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border-2 border-purple-400 pointer-events-none'></div>
      )}
    </div>
  );
}
