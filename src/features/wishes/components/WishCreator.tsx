'use client';

import React, { useState } from 'react';
import { TemplateCard } from '@/features/wish-builder/components/TemplateCard';
import { CustomWishBuilder } from '@/features/wish-builder/components/CustomWishBuilder';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { Template } from '@/types/templates';
import { TemplatePreviewModal } from '@/components/ui/TemplatePreviewModal';

interface WishCreatorProps {
  onBack: () => void;
  onWishCreated: (wish: any) => void;
}

export function WishCreator({ onBack, onWishCreated }: WishCreatorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (templateId === 'custom-blank') {
      setShowCustomBuilder(true);
    }
  };

  const handlePreviewTemplate = (template: Template) => {
    setPreviewTemplate(template);
    setShowPreviewModal(true);
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
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-pink-50'>
      {/* Navigation */}
      <nav className='flex items-center justify-between p-6 max-w-7xl mx-auto'>
        <Button variant='outline' onClick={onBack}>
          ← Back to Wishes
        </Button>
        <div className='flex items-center space-x-4'>
          <span className='text-gray-600'>Create New Wish</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-6 py-12'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Choose Your Template
          </h1>
          <p className='text-gray-600 mb-6'>
            Create a beautiful, personalized wish that&apos;ll make
            someone&apos;s day special
          </p>
        </div>

        {/* Action Buttons */}
        <div className='text-center space-y-4'>
          {selectedTemplate && selectedTemplate !== 'custom-blank' && (
            <Button
              variant='primary'
              onClick={handleStartCreating}
              disabled={isLoading}
              className='px-8 py-4 text-lg'
            >
              {isLoading ? (
                <Loading variant='spinner' size='sm' />
              ) : (
                'Start Creating with Template'
              )}
            </Button>
          )}

          <div className='text-gray-500'>
            <p>Can't find what you're looking for?</p>
            <Button
              variant='outline'
              onClick={() => setShowCustomBuilder(true)}
              className='mt-2'
            >
              Create Custom Wish from Scratch
            </Button>
          </div>
        </div>

        {/* Template Categories */}
        <div className='mt-16'>
          <h2 className='text-2xl font-bold text-center mb-8'>
            Browse by Category
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {[
              { name: 'Birthday', emoji: '🎂', count: 3 },
              { name: 'Valentine', emoji: '💕', count: 2 },
              { name: 'Graduation', emoji: '🎓', count: 2 },
              { name: 'Custom', emoji: '✨', count: 1 },
            ].map(category => (
              <div
                key={category.name}
                className='bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow'
              >
                <div className='text-3xl mb-2'>{category.emoji}</div>
                <h3 className='font-semibold text-gray-800'>{category.name}</h3>
                <p className='text-sm text-gray-500'>
                  {category.count} templates
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Template Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setPreviewTemplate(null);
        }}
      />
    </div>
  );
}
