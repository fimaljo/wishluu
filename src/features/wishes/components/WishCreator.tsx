'use client';

import React, { useState } from 'react';
import { TemplateCard } from '@/features/templates/components/TemplateCard';
import { CustomWishBuilder } from '@/features/templates/components/CustomWishBuilder';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { Template } from '@/types/templates';

interface WishCreatorProps {
  onBack: () => void;
  onWishCreated: (wish: any) => void;
}

export function WishCreator({ onBack, onWishCreated }: WishCreatorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Template data
  const templates: Template[] = [
    {
      id: 'birthday-cake',
      name: 'Birthday Cake',
      description: 'Interactive birthday cake with candles to blow out',
      occasion: 'birthday',
      thumbnail: '🎂',
      color: 'from-pink-400 to-rose-500',
      elements: ['cake', 'candles', 'balloons', 'music'],
      difficulty: 'easy'
    },
    {
      id: 'memory-board',
      name: 'Memory Board',
      description: 'Create a beautiful collage of memories and photos',
      occasion: 'general',
      thumbnail: '📸',
      color: 'from-blue-400 to-purple-500',
      elements: ['photos', 'text', 'frames', 'stickers'],
      difficulty: 'medium'
    },
    {
      id: 'valentine-heart',
      name: 'Valentine Heart',
      description: 'Animated heart with love messages and effects',
      occasion: 'valentine',
      thumbnail: '💕',
      color: 'from-red-400 to-pink-500',
      elements: ['heart', 'sparkles', 'love-messages', 'animations'],
      difficulty: 'easy'
    },
    {
      id: 'proposal-ring',
      name: 'Proposal Ring',
      description: 'Special proposal with ring animation and romantic effects',
      occasion: 'proposal',
      thumbnail: '💍',
      color: 'from-purple-400 to-pink-500',
      elements: ['ring', 'rose-petals', 'romantic-text', 'music'],
      difficulty: 'hard'
    },
    {
      id: 'graduation-cap',
      name: 'Graduation Cap',
      description: 'Celebrate graduation with animated cap and confetti',
      occasion: 'graduation',
      thumbnail: '🎓',
      color: 'from-yellow-400 to-orange-500',
      elements: ['cap', 'confetti', 'diploma', 'celebration'],
      difficulty: 'medium'
    },
    {
      id: 'custom-blank',
      name: 'Custom Wish',
      description: 'Start from scratch and build your own unique wish',
      occasion: 'custom',
      thumbnail: '✨',
      color: 'from-indigo-400 to-purple-500',
      elements: ['all-elements'],
      difficulty: 'expert'
    }
  ];

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (templateId === 'custom-blank') {
      setShowCustomBuilder(true);
    }
  };

  const handleStartCreating = () => {
    if (selectedTemplate) {
      setIsLoading(true);
      // Navigate to the template builder
      window.location.href = `/wishes/create/${selectedTemplate}`;
    }
  };

  const handleWishCreated = (wish: any) => {
    onWishCreated(wish);
    onBack();
  };

  if (showCustomBuilder) {
    return <CustomWishBuilder onBack={() => setShowCustomBuilder(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <Button variant="outline" onClick={onBack}>
          ← Back to Wishes
        </Button>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Create New Wish</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Template
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select a beautiful template or create your own custom wish from scratch
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              onSelect={() => handleTemplateSelect(template.id)}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          {selectedTemplate && selectedTemplate !== 'custom-blank' && (
            <Button
              variant="primary"
              onClick={handleStartCreating}
              disabled={isLoading}
              className="px-8 py-4 text-lg"
            >
              {isLoading ? (
                <Loading variant="spinner" size="sm" />
              ) : (
                'Start Creating with Template'
              )}
            </Button>
          )}
          
          <div className="text-gray-500">
            <p>Can't find what you're looking for?</p>
            <Button
              variant="outline"
              onClick={() => setShowCustomBuilder(true)}
              className="mt-2"
            >
              Create Custom Wish from Scratch
            </Button>
          </div>
        </div>

        {/* Template Categories */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Birthday', emoji: '🎂', count: 3 },
              { name: 'Valentine', emoji: '💕', count: 2 },
              { name: 'Graduation', emoji: '🎓', count: 2 },
              { name: 'Custom', emoji: '✨', count: 1 }
            ].map((category) => (
              <div key={category.name} className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">{category.emoji}</div>
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} templates</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 