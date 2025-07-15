'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllTemplates, TEMPLATE_OCCASIONS } from '@/config/templates';
import { Template } from '@/types/templates';

export default function TemplatesPage() {
  const [selectedOccasion, setSelectedOccasion] = useState('all');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load templates on component mount (client-side only)
  useEffect(() => {
    const loadTemplates = () => {
      setTemplates(getAllTemplates());
      setIsLoading(false);
    };
    loadTemplates();
  }, []);

  const filteredTemplates =
    selectedOccasion === 'all'
      ? templates
      : templates.filter(template => template.occasion === selectedOccasion);

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
                WishLuu
              </span>
            </div>
            <div className='flex items-center space-x-4'>
              <Link
                href='/admin/templates'
                className='text-gray-600 hover:text-purple-600 transition-colors'
              >
                Manage Templates
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
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>
            <span className='bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
              Choose Your Template
            </span>
          </h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Select from our beautiful collection of templates to create your
            perfect interactive wish
          </p>
        </div>

        {/* Occasion Filter */}
        <div className='flex flex-wrap justify-center gap-4 mb-8'>
          {TEMPLATE_OCCASIONS.map(occasion => (
            <button
              key={occasion.id}
              onClick={() => setSelectedOccasion(occasion.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedOccasion === occasion.id
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              <span className='mr-2'>{occasion.emoji}</span>
              {occasion.name}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        {isLoading ? (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className='bg-white rounded-2xl shadow-lg p-8 animate-pulse'
              >
                <div className='bg-gray-200 rounded-lg h-24 mb-4'></div>
                <div className='bg-gray-200 rounded h-6 mb-2'></div>
                <div className='bg-gray-200 rounded h-4 mb-4'></div>
                <div className='bg-gray-200 rounded-full h-6 w-24'></div>
              </div>
            ))}
          </div>
        ) : (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {filteredTemplates.map(template => (
              <Link key={template.id} href={`/wishes/create/${template.id}`}>
                <div className='group cursor-pointer'>
                  <div
                    className={`bg-gradient-to-r ${template.color} p-8 rounded-2xl text-white text-center transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl h-full flex flex-col justify-center`}
                  >
                    <div className='text-6xl mb-4'>{template.thumbnail}</div>
                    <h3 className='text-xl font-semibold mb-2'>
                      {template.name}
                    </h3>
                    <p className='text-purple-100 text-sm mb-4'>
                      {template.description}
                    </p>
                    <div className='bg-white/20 rounded-full px-4 py-1 text-sm font-medium'>
                      {template.occasion === 'custom'
                        ? 'Custom'
                        : template.occasion}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Custom Template Option */}
        <div className='mt-16 text-center'>
          <div className='bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto'>
            <div className='text-6xl mb-4'>✨</div>
            <h2 className='text-2xl font-bold mb-4'>
              Create Your Own Custom Wish
            </h2>
            <p className='text-gray-600 mb-6'>
              Start from scratch and build a completely unique interactive wish
              with our powerful drag-and-drop builder.
            </p>
            <Link
              href='/wishes/create/custom-blank'
              className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-block'
            >
              Start Building Now
            </Link>
            <p className='text-sm text-gray-500 mt-4'>
              ✨ Preview your wish in real-time • 🎨 Customize every element •
              📤 Share with a single click
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
