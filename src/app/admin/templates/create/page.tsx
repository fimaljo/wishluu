'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CustomWishBuilder } from '@/features/wish-builder/components/CustomWishBuilder';
import { TemplateService } from '@/lib/templateService';
import { Template } from '@/types/templates';
import { WishElement } from '@/types/templates';

export default function AdminCreateTemplatePage() {
  const [templateMetadata, setTemplateMetadata] = useState({
    name: '',
    description: '',
    occasion: 'custom',
  });
  const [showMetadataForm, setShowMetadataForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleBack = () => {
    window.history.back();
  };

  const handleSaveTemplate = async (
    elements: WishElement[],
    stepSequence: string[][]
  ) => {
    if (!templateMetadata.name.trim()) {
      alert('Please enter a template name');
      return;
    }
    setIsSaving(true);
    try {
      const newTemplate = TemplateService.createTemplate({
        name: templateMetadata.name,
        description: templateMetadata.description,
        occasion: templateMetadata.occasion,
        elements: elements.map(el => el.elementType),
        defaultElements: elements,
        stepSequence: stepSequence,
        thumbnail: '✨',
        color: 'from-purple-400 to-pink-500',
        difficulty: 'easy',
      });
      alert(`Template "${templateMetadata.name}" created successfully!`);
      window.location.href = '/admin/templates';
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Error creating template. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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
                WishLuu Admin
              </span>
            </div>
            <div className='flex items-center space-x-4'>
              <Link
                href='/admin/templates'
                className='text-gray-600 hover:text-purple-600 transition-colors'
              >
                ← Back to Templates
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Template Metadata Form */}
      {showMetadataForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>
              Template Information
            </h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Template Name *
                </label>
                <input
                  type='text'
                  value={templateMetadata.name}
                  onChange={e =>
                    setTemplateMetadata({
                      ...templateMetadata,
                      name: e.target.value,
                    })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  placeholder='e.g., Birthday Celebration'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Description
                </label>
                <textarea
                  value={templateMetadata.description}
                  onChange={e =>
                    setTemplateMetadata({
                      ...templateMetadata,
                      description: e.target.value,
                    })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  rows={3}
                  placeholder='Describe what this template is for...'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Occasion
                </label>
                <input
                  type='text'
                  value={templateMetadata.occasion}
                  onChange={e =>
                    setTemplateMetadata({
                      ...templateMetadata,
                      occasion: e.target.value,
                    })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  placeholder='e.g., birthday, wedding, etc.'
                />
              </div>
            </div>
            <div className='flex justify-end space-x-3 mt-6'>
              <Button
                variant='outline'
                onClick={() => setShowMetadataForm(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant='primary'
                onClick={() => setShowMetadataForm(false)}
                disabled={isSaving || !templateMetadata.name.trim()}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Main Builder */}
      <div className='h-[calc(100vh-80px)]'>
        <CustomWishBuilder
          onBack={handleBack}
          isTemplateMode={false}
          isAdminMode={true}
          onSaveTemplate={handleSaveTemplate}
          templateMetadata={templateMetadata}
          onShowMetadataForm={() => setShowMetadataForm(true)}
          adminIsSaving={isSaving}
        />
      </div>
    </div>
  );
}
