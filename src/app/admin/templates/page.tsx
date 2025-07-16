'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Template } from '@/types/templates';
import { useFirebaseTemplates } from '@/hooks/useFirebaseTemplates';

export default function AdminTemplatesPage() {
  // Use Firebase templates hook for admin (show all templates, not just public)
  const {
    templates,
    isLoading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refreshTemplates,
    getTemplateStats,
    exportTemplates,
    importTemplates,
  } = useFirebaseTemplates({
    // Don't filter by isPublic - show all templates for admin
    orderBy: 'name', // Use name ordering to avoid index issues
    orderDirection: 'asc',
  }); // Show all templates for admin

  const handleEditTemplate = (template: Template) => {
    // Navigate to the admin template edit page
    window.location.href = `/admin/templates/edit/${template.id}`;
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      const result = await deleteTemplate(templateId);
      if (!result.success) {
        alert(`Failed to delete template: ${result.error}`);
      }
    }
  };

  const handleCreateTemplate = () => {
    // Navigate to the admin template creation page
    window.location.href = '/admin/templates/create';
  };

  return (
    <AuthGuard requireAdmin={true}>
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
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
                  href='/admin/cleanup'
                  className='text-gray-600 hover:text-purple-600 transition-colors'
                >
                  Cleanup
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
                onClick={async () => {
                  const result = await getTemplateStats();
                  if (result.success && result.data) {
                    const stats = result.data;
                    alert(
                      `Template Statistics:\nTotal: ${stats.total}\nBy Occasion: ${JSON.stringify(stats.byOccasion, null, 2)}\nBy Difficulty: ${JSON.stringify(stats.byDifficulty, null, 2)}\nAverage Elements: ${stats.averageElements.toFixed(1)}`
                    );
                  } else {
                    alert(`Failed to get stats: ${result.error}`);
                  }
                }}
                className='text-sm'
              >
                📊 Stats
              </Button>
              <Button
                variant='outline'
                onClick={async () => {
                  const result = await exportTemplates();
                  if (result.success && result.data) {
                    const blob = new Blob([result.data], {
                      type: 'application/json',
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `wishluu-templates-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  } else {
                    alert(`Failed to export templates: ${result.error}`);
                  }
                }}
                className='text-sm'
              >
                📤 Export
              </Button>
              <Button
                variant='primary'
                onClick={handleCreateTemplate}
                className='text-lg px-6 py-3'
              >
                + Create Template
              </Button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className='bg-red-50 border border-red-200 rounded-2xl p-6 mb-6'>
              <div className='flex items-center'>
                <div className='text-red-500 text-2xl mr-3'>⚠️</div>
                <div>
                  <h3 className='text-lg font-semibold text-red-800 mb-1'>
                    Error Loading Templates
                  </h3>
                  <p className='text-red-600 mb-3'>{error}</p>
                  <button
                    onClick={refreshTemplates}
                    className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors'
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

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

            {!isLoading && !error && templates.length === 0 && (
              <div className='text-center py-12 text-gray-500'>
                <div className='text-4xl mb-4'>📝</div>
                <p className='text-lg'>No templates found in Firebase</p>
                <p className='text-sm'>
                  Templates will appear here once created
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
