'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import {
  getAllTemplates,
  TEMPLATE_OCCASIONS,
  TEMPLATE_DIFFICULTIES,
} from '@/config/templates';
import { TemplateService } from '@/lib/templateService';
import { Template } from '@/types/templates';

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load templates on component mount (client-side only)
  useEffect(() => {
    const loadTemplates = () => {
      setTemplates(getAllTemplates());
      setIsLoading(false);
    };
    loadTemplates();
  }, []);

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsEditing(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      const success = TemplateService.deleteTemplate(templateId);
      if (success) {
        // Remove template from state directly
        setTemplates(prevTemplates =>
          prevTemplates.filter(t => t.id !== templateId)
        );
      }
    }
  };

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setIsEditing(false);
    setShowCreateForm(true);
  };

  const handleSaveTemplate = (templateData: Partial<Template>) => {
    if (isEditing && selectedTemplate) {
      // Update existing template
      const updatedTemplate = TemplateService.updateTemplate(
        selectedTemplate.id,
        templateData
      );
      if (updatedTemplate) {
        // Update templates state directly instead of calling getAllTemplates again
        setTemplates(prevTemplates =>
          prevTemplates.map(t =>
            t.id === selectedTemplate.id ? updatedTemplate : t
          )
        );
      }
    } else {
      // Create new template
      const newTemplate = TemplateService.createTemplate({
        name: templateData.name || 'New Template',
        description: templateData.description || '',
        occasion: templateData.occasion || 'custom',
        thumbnail: templateData.thumbnail || '✨',
        color: templateData.color || 'from-purple-400 to-pink-500',
        elements: templateData.elements || [],
        difficulty: templateData.difficulty || 'easy',
        defaultElements: templateData.defaultElements || [],
      });
      // Refresh templates list to avoid duplicates
      setTemplates(getAllTemplates());
    }

    setIsEditing(false);
    setShowCreateForm(false);
    setSelectedTemplate(null);
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
                href='/templates'
                className='text-gray-600 hover:text-purple-600 transition-colors'
              >
                View Templates
              </Link>
              <Link
                href='/'
                className='text-gray-600 hover:text-purple-600 transition-colors'
              >
                ← Back to Home
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
                Template Management
              </span>
            </h1>
            <p className='text-xl text-gray-600'>
              Create and manage templates for users to choose from
            </p>
          </div>
          <div className='flex items-center space-x-4'>
            <Button
              variant='outline'
              onClick={() => {
                const stats = TemplateService.getTemplateStats();
                alert(
                  `Template Statistics:\nTotal: ${stats.total}\nBy Occasion: ${JSON.stringify(stats.byOccasion, null, 2)}\nBy Difficulty: ${JSON.stringify(stats.byDifficulty, null, 2)}\nAverage Elements: ${stats.averageElements.toFixed(1)}`
                );
              }}
              className='text-sm'
            >
              📊 Stats
            </Button>
            <Button
              variant='outline'
              onClick={() => {
                const currentTemplates = getAllTemplates();
                const fixedTemplates =
                  TemplateService.fixDuplicateIds(currentTemplates);
                setTemplates(fixedTemplates);
                alert(`Duplicate ID fix completed. Check console for details.`);
              }}
              className='text-sm'
            >
              🔧 Fix Duplicates
            </Button>
            <Button
              variant='outline'
              onClick={() => {
                TemplateService.debugTemplateIds();
              }}
              className='text-sm'
            >
              🐛 Debug IDs
            </Button>
            <Button
              variant='outline'
              onClick={() => {
                if (
                  confirm(
                    'Are you sure you want to reset all templates to default? This will remove all custom templates.'
                  )
                ) {
                  TemplateService.resetToDefault();
                  setTemplates(getAllTemplates());
                }
              }}
              className='text-sm'
            >
              🔄 Reset to Default
            </Button>
            <Button
              variant='outline'
              onClick={() => {
                if (
                  confirm(
                    '⚠️ EMERGENCY: This will completely clear all templates and localStorage. Are you sure?'
                  )
                ) {
                  TemplateService.forceClearAllTemplates();
                  setTemplates(getAllTemplates());
                }
              }}
              className='text-sm text-red-600 hover:text-red-700'
            >
              🗑️ Force Clear All
            </Button>
            <Button
              variant='outline'
              onClick={() => {
                const json = TemplateService.exportTemplates();
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `wishluu-templates-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className='text-sm'
            >
              📤 Export
            </Button>
            <Button
              variant='primary'
              onClick={() => (window.location.href = '/admin/templates/create')}
              className='text-lg px-6 py-3'
            >
              + Create Template
            </Button>
          </div>
        </div>

        {/* Templates List */}
        <div className='bg-white rounded-2xl shadow-lg p-6'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6'>
            Current Templates
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
                          <div className='bg-gray-200 rounded-full h-6 w-20'></div>
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
              {templates.map(template => (
                <div
                  key={template.id}
                  className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-4'>
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${template.color} rounded-lg flex items-center justify-center text-2xl`}
                      >
                        {template.thumbnail}
                      </div>
                      <div>
                        <h3 className='text-lg font-semibold text-gray-800'>
                          {template.name}
                        </h3>
                        <p className='text-gray-600 text-sm'>
                          {template.description}
                        </p>
                        <div className='flex items-center space-x-4 mt-1'>
                          <span className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full'>
                            {template.occasion}
                          </span>
                          <span className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full'>
                            {template.difficulty}
                          </span>
                          <span className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full'>
                            {template.elements.length} elements
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleEditTemplate(template)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleDeleteTemplate(template.id)}
                        className='text-red-600 hover:text-red-700'
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && templates.length === 0 && (
            <div className='text-center py-12 text-gray-500'>
              <div className='text-4xl mb-4'>📝</div>
              <p className='text-lg'>No templates created yet</p>
              <p className='text-sm mb-4'>
                Create your first template to get started
              </p>
              <Button
                variant='primary'
                onClick={() =>
                  (window.location.href = '/admin/templates/create')
                }
                className='px-6 py-2'
              >
                + Create Your First Template
              </Button>
            </div>
          )}
        </div>

        {/* Template Form Modal */}
        {(isEditing || showCreateForm) && (
          <div className='fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm'>
            <div className='bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200'>
              <div className='p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-2xl font-bold text-gray-800'>
                    {isEditing ? 'Edit Template' : 'Create New Template'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setShowCreateForm(false);
                      setSelectedTemplate(null);
                    }}
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

                <TemplateForm
                  template={selectedTemplate}
                  onSave={handleSaveTemplate}
                  onCancel={() => {
                    setIsEditing(false);
                    setShowCreateForm(false);
                    setSelectedTemplate(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Template Form Component
interface TemplateFormProps {
  template: Template | null;
  onSave: (templateData: Partial<Template>) => void;
  onCancel: () => void;
}

function TemplateForm({ template, onSave, onCancel }: TemplateFormProps) {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    occasion: template?.occasion || 'custom',
    thumbnail: template?.thumbnail || '✨',
    color: template?.color || 'from-purple-400 to-pink-500',
    difficulty: template?.difficulty || 'easy',
    elements: template?.elements || [],
    defaultElements: template?.defaultElements || [],
  });

  // Element configuration state
  const [elementConfig, setElementConfig] = useState({
    balloons: {
      numberOfBalloons: 8,
      balloonSize: 70,
      transition: 'bounce',
      showHint: true,
    },
    text: {
      title: 'Happy Birthday!',
      message: 'Wishing you a wonderful day!',
      titleFont: 'playfair',
      messageFont: 'inter',
      titleColor: '#FF6B9D',
      messageColor: '#4A5568',
      titleSize: 48,
      messageSize: 18,
      alignment: 'center',
      animation: 'fade-in',
      shadow: true,
      gradient: true,
      padding: 20,
    },
  });

  const [showElementConfig, setShowElementConfig] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create defaultElements based on selected elements and their configuration
    const defaultElements: any[] = [];
    let order = 0;

    if (formData.elements.includes('balloons-interactive')) {
      defaultElements.push({
        id: `balloons-interactive_${Date.now()}`,
        elementType: 'balloons-interactive',
        properties: {
          numberOfBalloons: elementConfig.balloons.numberOfBalloons,
          balloonSize: elementConfig.balloons.balloonSize,
          transition: elementConfig.balloons.transition,
          showHint: elementConfig.balloons.showHint,
          balloonColors: [
            '#FF6B9D',
            '#4ECDC4',
            '#45B7D1',
            '#96CEB4',
            '#FFEAA7',
            '#FF9FF3',
            '#54A0FF',
            '#5F27CD',
          ],
        },
        order: order++,
      });
    }

    if (formData.elements.includes('beautiful-text')) {
      defaultElements.push({
        id: `beautiful-text_${Date.now()}`,
        elementType: 'beautiful-text',
        properties: {
          title: elementConfig.text.title,
          message: elementConfig.text.message,
          titleFont: elementConfig.text.titleFont,
          messageFont: elementConfig.text.messageFont,
          titleColor: elementConfig.text.titleColor,
          messageColor: elementConfig.text.messageColor,
          titleSize: elementConfig.text.titleSize,
          messageSize: elementConfig.text.messageSize,
          alignment: elementConfig.text.alignment,
          animation: elementConfig.text.animation,
          shadow: elementConfig.text.shadow,
          gradient: elementConfig.text.gradient,
          padding: elementConfig.text.padding,
        },
        order: order++,
      });
    }

    onSave({
      ...formData,
      defaultElements,
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Basic Information */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Template Name
          </label>
          <input
            type='text'
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Thumbnail Emoji
          </label>
          <input
            type='text'
            value={formData.thumbnail}
            onChange={e =>
              setFormData({ ...formData, thumbnail: e.target.value })
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
            placeholder='🎂'
            required
          />
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={e =>
            setFormData({ ...formData, description: e.target.value })
          }
          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
          rows={3}
          required
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Occasion
          </label>
          <select
            value={formData.occasion}
            onChange={e =>
              setFormData({ ...formData, occasion: e.target.value })
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
          >
            {TEMPLATE_OCCASIONS.map(occasion => (
              <option key={occasion.id} value={occasion.id}>
                {occasion.emoji} {occasion.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Difficulty
          </label>
          <select
            value={formData.difficulty}
            onChange={e =>
              setFormData({ ...formData, difficulty: e.target.value as any })
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
          >
            {TEMPLATE_DIFFICULTIES.map(difficulty => (
              <option key={difficulty.id} value={difficulty.id}>
                {difficulty.emoji} {difficulty.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Color Gradient
          </label>
          <select
            value={formData.color}
            onChange={e => setFormData({ ...formData, color: e.target.value })}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
          >
            <option value='from-pink-400 to-rose-500'>Pink to Rose</option>
            <option value='from-red-400 to-pink-500'>Red to Pink</option>
            <option value='from-purple-400 to-pink-500'>Purple to Pink</option>
            <option value='from-blue-400 to-purple-500'>Blue to Purple</option>
            <option value='from-green-400 to-blue-500'>Green to Blue</option>
            <option value='from-yellow-400 to-orange-500'>
              Yellow to Orange
            </option>
            <option value='from-indigo-400 to-purple-500'>
              Indigo to Purple
            </option>
          </select>
        </div>
      </div>

      {/* Element Configuration */}
      <div className='border-t pt-6'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-gray-800'>
            Default Elements
          </h3>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => setShowElementConfig(!showElementConfig)}
          >
            {showElementConfig ? 'Hide' : 'Configure'} Elements
          </Button>
        </div>

        {showElementConfig && (
          <div className='bg-gray-50 rounded-lg p-4'>
            <p className='text-sm text-gray-600 mb-4'>
              Configure the default elements that will be included in this
              template. Users can customize these elements but cannot add new
              ones.
            </p>

            <div className='space-y-4'>
              {/* Balloons Interactive Element */}
              <div className='border border-gray-200 rounded-lg p-4 bg-white'>
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center space-x-2'>
                    <span className='text-2xl'>🎈</span>
                    <span className='font-medium'>Interactive Balloons</span>
                  </div>
                  <input
                    type='checkbox'
                    checked={formData.elements.includes('balloons-interactive')}
                    onChange={e => {
                      const newElements = e.target.checked
                        ? [...formData.elements, 'balloons-interactive']
                        : formData.elements.filter(
                            el => el !== 'balloons-interactive'
                          );
                      setFormData({ ...formData, elements: newElements });
                    }}
                    className='w-4 h-4 text-purple-600'
                  />
                </div>

                {formData.elements.includes('balloons-interactive') && (
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div>
                      <label className='block text-gray-700 mb-1'>
                        Number of Balloons
                      </label>
                      <input
                        type='number'
                        min='1'
                        max='20'
                        value={elementConfig.balloons.numberOfBalloons}
                        onChange={e =>
                          setElementConfig({
                            ...elementConfig,
                            balloons: {
                              ...elementConfig.balloons,
                              numberOfBalloons: parseInt(e.target.value) || 8,
                            },
                          })
                        }
                        className='w-full px-2 py-1 border border-gray-300 rounded'
                      />
                    </div>
                    <div>
                      <label className='block text-gray-700 mb-1'>
                        Balloon Size
                      </label>
                      <input
                        type='number'
                        min='30'
                        max='100'
                        value={elementConfig.balloons.balloonSize}
                        onChange={e =>
                          setElementConfig({
                            ...elementConfig,
                            balloons: {
                              ...elementConfig.balloons,
                              balloonSize: parseInt(e.target.value) || 70,
                            },
                          })
                        }
                        className='w-full px-2 py-1 border border-gray-300 rounded'
                      />
                    </div>
                    <div>
                      <label className='block text-gray-700 mb-1'>
                        Transition
                      </label>
                      <select
                        value={elementConfig.balloons.transition}
                        onChange={e =>
                          setElementConfig({
                            ...elementConfig,
                            balloons: {
                              ...elementConfig.balloons,
                              transition: e.target.value,
                            },
                          })
                        }
                        className='w-full px-2 py-1 border border-gray-300 rounded'
                      >
                        <option value='fade'>Fade</option>
                        <option value='bounce'>Bounce</option>
                        <option value='zoom-in'>Zoom In</option>
                        <option value='slide-up'>Slide Up</option>
                      </select>
                    </div>
                    <div>
                      <label className='flex items-center space-x-2'>
                        <input
                          type='checkbox'
                          checked={elementConfig.balloons.showHint}
                          onChange={e =>
                            setElementConfig({
                              ...elementConfig,
                              balloons: {
                                ...elementConfig.balloons,
                                showHint: e.target.checked,
                              },
                            })
                          }
                          className='w-4 h-4 text-purple-600'
                        />
                        <span className='text-gray-700'>Show Hints</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Beautiful Text Element */}
              <div className='border border-gray-200 rounded-lg p-4 bg-white'>
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center space-x-2'>
                    <span className='text-2xl'>📝</span>
                    <span className='font-medium'>Beautiful Text</span>
                  </div>
                  <input
                    type='checkbox'
                    checked={formData.elements.includes('beautiful-text')}
                    onChange={e => {
                      const newElements = e.target.checked
                        ? [...formData.elements, 'beautiful-text']
                        : formData.elements.filter(
                            el => el !== 'beautiful-text'
                          );
                      setFormData({ ...formData, elements: newElements });
                    }}
                    className='w-4 h-4 text-purple-600'
                  />
                </div>

                {formData.elements.includes('beautiful-text') && (
                  <div className='space-y-3 text-sm'>
                    <div>
                      <label className='block text-gray-700 mb-1'>Title</label>
                      <input
                        type='text'
                        value={elementConfig.text.title}
                        onChange={e =>
                          setElementConfig({
                            ...elementConfig,
                            text: {
                              ...elementConfig.text,
                              title: e.target.value,
                            },
                          })
                        }
                        placeholder='Enter title...'
                        className='w-full px-2 py-1 border border-gray-300 rounded'
                      />
                    </div>
                    <div>
                      <label className='block text-gray-700 mb-1'>
                        Message
                      </label>
                      <textarea
                        value={elementConfig.text.message}
                        onChange={e =>
                          setElementConfig({
                            ...elementConfig,
                            text: {
                              ...elementConfig.text,
                              message: e.target.value,
                            },
                          })
                        }
                        placeholder='Enter message...'
                        rows={2}
                        className='w-full px-2 py-1 border border-gray-300 rounded'
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                      <div>
                        <label className='block text-gray-700 mb-1'>
                          Title Color
                        </label>
                        <input
                          type='color'
                          value={elementConfig.text.titleColor}
                          onChange={e =>
                            setElementConfig({
                              ...elementConfig,
                              text: {
                                ...elementConfig.text,
                                titleColor: e.target.value,
                              },
                            })
                          }
                          className='w-full h-8 border border-gray-300 rounded'
                        />
                      </div>
                      <div>
                        <label className='block text-gray-700 mb-1'>
                          Message Color
                        </label>
                        <input
                          type='color'
                          value={elementConfig.text.messageColor}
                          onChange={e =>
                            setElementConfig({
                              ...elementConfig,
                              text: {
                                ...elementConfig.text,
                                messageColor: e.target.value,
                              },
                            })
                          }
                          className='w-full h-8 border border-gray-300 rounded'
                        />
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                      <div>
                        <label className='block text-gray-700 mb-1'>
                          Title Size
                        </label>
                        <input
                          type='number'
                          min='24'
                          max='72'
                          value={elementConfig.text.titleSize}
                          onChange={e =>
                            setElementConfig({
                              ...elementConfig,
                              text: {
                                ...elementConfig.text,
                                titleSize: parseInt(e.target.value) || 48,
                              },
                            })
                          }
                          className='w-full px-2 py-1 border border-gray-300 rounded'
                        />
                      </div>
                      <div>
                        <label className='block text-gray-700 mb-1'>
                          Message Size
                        </label>
                        <input
                          type='number'
                          min='12'
                          max='32'
                          value={elementConfig.text.messageSize}
                          onChange={e =>
                            setElementConfig({
                              ...elementConfig,
                              text: {
                                ...elementConfig.text,
                                messageSize: parseInt(e.target.value) || 18,
                              },
                            })
                          }
                          className='w-full px-2 py-1 border border-gray-300 rounded'
                        />
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                      <div>
                        <label className='block text-gray-700 mb-1'>
                          Animation
                        </label>
                        <select
                          value={elementConfig.text.animation}
                          onChange={e =>
                            setElementConfig({
                              ...elementConfig,
                              text: {
                                ...elementConfig.text,
                                animation: e.target.value,
                              },
                            })
                          }
                          className='w-full px-2 py-1 border border-gray-300 rounded'
                        >
                          <option value='fade-in'>Fade In</option>
                          <option value='slide-up'>Slide Up</option>
                          <option value='zoom-in'>Zoom In</option>
                          <option value='bounce'>Bounce</option>
                        </select>
                      </div>
                      <div>
                        <label className='block text-gray-700 mb-1'>
                          Alignment
                        </label>
                        <select
                          value={elementConfig.text.alignment}
                          onChange={e =>
                            setElementConfig({
                              ...elementConfig,
                              text: {
                                ...elementConfig.text,
                                alignment: e.target.value,
                              },
                            })
                          }
                          className='w-full px-2 py-1 border border-gray-300 rounded'
                        >
                          <option value='left'>Left</option>
                          <option value='center'>Center</option>
                          <option value='right'>Right</option>
                        </select>
                      </div>
                    </div>
                    <div className='flex items-center space-x-4'>
                      <label className='flex items-center space-x-2'>
                        <input
                          type='checkbox'
                          checked={elementConfig.text.shadow}
                          onChange={e =>
                            setElementConfig({
                              ...elementConfig,
                              text: {
                                ...elementConfig.text,
                                shadow: e.target.checked,
                              },
                            })
                          }
                          className='w-4 h-4 text-purple-600'
                        />
                        <span className='text-gray-700'>Shadow</span>
                      </label>
                      <label className='flex items-center space-x-2'>
                        <input
                          type='checkbox'
                          checked={elementConfig.text.gradient}
                          onChange={e =>
                            setElementConfig({
                              ...elementConfig,
                              text: {
                                ...elementConfig.text,
                                gradient: e.target.checked,
                              },
                            })
                          }
                          className='w-4 h-4 text-purple-600'
                        />
                        <span className='text-gray-700'>Gradient</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className='flex items-center justify-end space-x-4 pt-6 border-t'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit' variant='primary'>
          {template ? 'Update Template' : 'Create Template'}
        </Button>
      </div>
    </form>
  );
}
