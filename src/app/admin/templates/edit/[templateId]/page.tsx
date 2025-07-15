'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CustomWishBuilder } from '@/features/wish-builder/components/CustomWishBuilder';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import { FirebaseTemplateService } from '@/lib/firebaseTemplateService';
import { Template, WishElement } from '@/types/templates';
import { elementIdsToWishElements } from '@/config/elements';

export default function AdminEditTemplatePage() {
  const params = useParams();
  const templateId = params.templateId as string;
  const { user } = useAuth();

  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [templateMetadata, setTemplateMetadata] = useState({
    name: '',
    description: '',
    occasion: 'custom',
  });
  const [showMetadataForm, setShowMetadataForm] = useState(false);

  // Load template data
  useEffect(() => {
    const loadTemplate = async () => {
      if (!templateId) return;

      setIsLoading(true);
      setError(null);

      try {
        const result =
          await FirebaseTemplateService.getTemplateById(templateId);
        if (result.success && result.data) {
          setTemplate(result.data);
          setTemplateMetadata({
            name: result.data.name,
            description: result.data.description,
            occasion: result.data.occasion,
          });
        } else {
          setError(result.error || 'Failed to load template');
        }
      } catch (err) {
        setError('An error occurred while loading the template');
        console.error('Error loading template:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplate();
  }, [templateId]);

  const handleSaveTemplate = async (
    elements: WishElement[],
    stepSequence: string[][]
  ) => {
    if (!user || !template) {
      alert('You must be signed in to update templates');
      return;
    }

    if (!templateMetadata.name.trim()) {
      alert('Please enter a template name');
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

      const result = await FirebaseTemplateService.updateTemplate(
        templateId,
        {
          name: templateMetadata.name,
          description: templateMetadata.description,
          occasion: templateMetadata.occasion,
          thumbnail: template.thumbnail,
          color: template.color,
          elements: elements.map(el => el.elementType),
          difficulty: template.difficulty,
          defaultElementIds: elements.map(el => el.elementType),
          stepSequence: convertedStepSequence,
        },
        user.uid
      );

      if (result.success) {
        alert('Template updated successfully!');
        window.location.href = '/admin/templates';
      } else {
        alert(`Failed to update template: ${result.error}`);
      }
    } catch (error) {
      console.error('Error updating template:', error);
      alert('An error occurred while updating the template.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShowMetadataForm = () => {
    setShowMetadataForm(true);
  };

  if (isLoading) {
    return (
      <AuthGuard requireAdmin={true}>
        <div className='min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4'></div>
            <p className='text-gray-600'>Loading template...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard requireAdmin={true}>
        <div className='min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center'>
          <div className='text-center'>
            <div className='text-red-500 text-4xl mb-4'>⚠️</div>
            <h2 className='text-2xl font-bold text-gray-800 mb-2'>
              Error Loading Template
            </h2>
            <p className='text-gray-600 mb-4'>{error}</p>
            <button
              onClick={() => window.history.back()}
              className='bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors'
            >
              Go Back
            </button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (!template) {
    return (
      <AuthGuard requireAdmin={true}>
        <div className='min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center'>
          <div className='text-center'>
            <div className='text-gray-500 text-4xl mb-4'>📝</div>
            <h2 className='text-2xl font-bold text-gray-800 mb-2'>
              Template Not Found
            </h2>
            <p className='text-gray-600 mb-4'>
              The template you're looking for doesn't exist.
            </p>
            <button
              onClick={() => window.history.back()}
              className='bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors'
            >
              Go Back
            </button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAdmin={true}>
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
                  Edit Template
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
                    onClick={() => setShowMetadataForm(false)}
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
            templateId={templateId}
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
