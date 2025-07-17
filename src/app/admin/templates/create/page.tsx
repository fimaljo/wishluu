'use client';

import React, { useState } from 'react';
import { CustomWishBuilder } from '@/features/wish-builder/components/CustomWishBuilder';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { WishElement } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { FirebaseTemplateService } from '@/lib/firebaseTemplateService';
import { useNotification } from '@/components/ui/Notification';

export default function AdminCreateTemplatePage() {
  const { user } = useAuth();
  const { notification, showError, showInfo } = useNotification();
  const [templateMetadata, setTemplateMetadata] = useState({
    name: '',
    description: '',
    occasion: 'custom',
    thumbnail: '✨',
    color: 'from-purple-400 to-pink-500',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard' | 'expert',
  });
  const [showMetadataForm, setShowMetadataForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveTemplate = async (
    elements: WishElement[],
    stepSequence: string[][]
  ) => {
    if (!user) {
      showError('You must be signed in to create templates');
      return;
    }

    if (!templateMetadata.name.trim()) {
      showError('Please enter a template name');
      return;
    }

    if (elements.length === 0) {
      showError('Please add at least one element to the template');
      return;
    }

    setIsSaving(true);
    try {
      // Convert step sequence from full element IDs to element type IDs
      const convertedStepSequence = stepSequence.map(step =>
        step.map(elementId => {
          // Find the element and get its elementType
          const element = elements.find(el => el.id === elementId);
          return element ? element.elementType : elementId;
        })
      );

      const result = await FirebaseTemplateService.createTemplate(
        {
          name: templateMetadata.name,
          description: templateMetadata.description,
          occasion: templateMetadata.occasion,
          thumbnail: templateMetadata.thumbnail,
          color: templateMetadata.color,
          elements: elements.map(el => el.elementType),
          difficulty: templateMetadata.difficulty,
          defaultElementIds: elements.map(el => el.elementType),
          stepSequence: convertedStepSequence,
        },
        user.uid
      );

      if (result.success) {
        showInfo('Template created successfully!');
        window.location.href = '/admin/templates';
      } else {
        showError(`Failed to create template: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating template:', error);
      showError('An error occurred while creating the template.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShowMetadataForm = () => {
    setShowMetadataForm(true);
  };

  const handleSaveMetadata = () => {
    if (!templateMetadata.name.trim()) {
      showError('Please enter a template name');
      return;
    }
    setShowMetadataForm(false);
    showInfo('Template information saved!');
  };

  return (
    <AuthGuard requireAdmin={true}>
      <div className='min-h-screen bg-gradient-to-br from-purple-50 to-pink-50'>
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

        {/* Header */}
        <div className='bg-white shadow-sm'>
          <div className='w-full max-w-[1800px] mx-auto px-6 py-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
                  <span className='text-white font-bold text-lg'>W</span>
                </div>
                <span className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                  Create Template
                </span>
              </div>
              <div className='flex items-center space-x-4'>
                <a
                  href='/admin/templates'
                  className='text-gray-600 hover:text-purple-600 transition-colors'
                >
                  ← Back to Templates
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Template Metadata Form Modal */}
        {showMetadataForm && (
          <div className='fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm'>
            <div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200'>
              <div className='p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-2xl font-bold text-gray-800'>
                    Template Information
                  </h2>
                  <button
                    onClick={() => setShowMetadataForm(false)}
                    className='text-gray-400 hover:text-gray-600 transition-colors'
                  >
                    <svg
                      className='w-6 h-6'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </div>

                <div className='space-y-6'>
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
                      Thumbnail Emoji
                    </label>
                    <input
                      type='text'
                      value={templateMetadata.thumbnail}
                      onChange={e =>
                        setTemplateMetadata({
                          ...templateMetadata,
                          thumbnail: e.target.value,
                        })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      placeholder='🎂'
                      maxLength={2}
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Color Gradient
                    </label>
                    <select
                      value={templateMetadata.color}
                      onChange={e =>
                        setTemplateMetadata({
                          ...templateMetadata,
                          color: e.target.value,
                        })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    >
                      <option value='from-purple-400 to-pink-500'>
                        Purple to Pink
                      </option>
                      <option value='from-blue-400 to-purple-500'>
                        Blue to Purple
                      </option>
                      <option value='from-red-400 to-pink-500'>
                        Red to Pink
                      </option>
                      <option value='from-green-400 to-emerald-500'>
                        Green to Emerald
                      </option>
                      <option value='from-yellow-400 to-orange-500'>
                        Yellow to Orange
                      </option>
                      <option value='from-indigo-400 to-purple-500'>
                        Indigo to Purple
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Difficulty
                    </label>
                    <select
                      value={templateMetadata.difficulty}
                      onChange={e =>
                        setTemplateMetadata({
                          ...templateMetadata,
                          difficulty: e.target.value as
                            | 'easy'
                            | 'medium'
                            | 'hard'
                            | 'expert',
                        })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    >
                      <option value='easy'>Easy</option>
                      <option value='medium'>Medium</option>
                      <option value='hard'>Hard</option>
                      <option value='expert'>Expert</option>
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Occasion
                    </label>
                    <select
                      value={templateMetadata.occasion}
                      onChange={e =>
                        setTemplateMetadata({
                          ...templateMetadata,
                          occasion: e.target.value,
                        })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    >
                      <option value='custom'>Custom</option>
                      <option value='birthday'>Birthday</option>
                      <option value='anniversary'>Anniversary</option>
                      <option value='wedding'>Wedding</option>
                      <option value='graduation'>Graduation</option>
                      <option value='valentine'>Valentine's Day</option>
                      <option value='christmas'>Christmas</option>
                      <option value='new-year'>New Year</option>
                    </select>
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
                </div>

                <div className='flex justify-end space-x-3 pt-6 border-t mt-6'>
                  <button
                    onClick={() => setShowMetadataForm(false)}
                    className='px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveMetadata}
                    className='px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
                  >
                    Save Info
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wish Builder */}
        <div className='w-full max-w-[1800px] mx-auto px-6 py-8'>
          <CustomWishBuilder
            isTemplateMode={false}
            isAdminMode={true}
            onSaveTemplate={handleSaveTemplate}
            onShowMetadataForm={handleShowMetadataForm}
            adminIsSaving={isSaving}
            onBack={() => window.history.back()}
          />
        </div>
      </div>
    </AuthGuard>
  );
}
