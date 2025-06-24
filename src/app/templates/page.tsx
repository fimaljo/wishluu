'use client';

import React from 'react';
import Link from 'next/link';
import { TemplateCard } from '@/features/templates';

export default function TemplatesPage() {
  const templates = [
    {
      id: 'birthday',
      name: 'Birthday Celebration',
      description: 'Create a magical birthday wish with animations and music',
      category: 'Birthday',
      preview: '🎂',
      color: 'from-pink-400 to-rose-500'
    },
    {
      id: 'valentine',
      name: 'Valentine\'s Love',
      description: 'Express your love with an interactive Valentine\'s wish',
      category: 'Valentine\'s Day',
      preview: '💕',
      color: 'from-red-400 to-pink-500'
    },
    {
      id: 'mothers-day',
      name: 'Mother\'s Day Tribute',
      description: 'Show your appreciation with a heartfelt Mother\'s Day wish',
      category: 'Mother\'s Day',
      preview: '🌷',
      color: 'from-purple-400 to-pink-500'
    },
    {
      id: 'proposal',
      name: 'Romantic Proposal',
      description: 'Make your proposal unforgettable with this special template',
      category: 'Proposal',
      preview: '💍',
      color: 'from-blue-400 to-purple-500'
    },
    {
      id: 'anniversary',
      name: 'Anniversary Celebration',
      description: 'Celebrate your love story with this anniversary template',
      category: 'Anniversary',
      preview: '💑',
      color: 'from-green-400 to-blue-500'
    },
    {
      id: 'graduation',
      name: 'Graduation Achievement',
      description: 'Congratulate graduates with this achievement template',
      category: 'Graduation',
      preview: '🎓',
      color: 'from-yellow-400 to-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="w-full max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                WishLuu
              </span>
            </div>
            <Link 
              href="/"
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[1800px] mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Choose Your Template
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select from our beautiful collection of templates to create your perfect interactive wish
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <Link key={template.id} href={`/wishes/create/${template.id}`}>
              <div className="group cursor-pointer">
                <div className={`bg-gradient-to-r ${template.color} p-8 rounded-2xl text-white text-center transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl h-full flex flex-col justify-center`}>
                  <div className="text-6xl mb-4">{template.preview}</div>
                  <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                  <p className="text-purple-100 text-sm mb-4">{template.description}</p>
                  <div className="bg-white/20 rounded-full px-4 py-1 text-sm font-medium">
                    {template.category}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Custom Template Option */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-2xl font-bold mb-4">Create Your Own Custom Wish</h2>
            <p className="text-gray-600 mb-6">
              Start from scratch and build a completely unique interactive wish with our powerful drag-and-drop builder.
            </p>
            <Link 
              href="/wishes/create/custom-blank"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-block"
            >
              Start Building Now
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              ✨ Preview your wish in real-time • 🎨 Customize every element • 📤 Share with a single click
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 