'use client';

import React from 'react';
import { Template } from '@/types/templates';

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onSelect: () => void;
}

export function TemplateCard({ template, isSelected, onSelect }: TemplateCardProps) {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-orange-100 text-orange-700',
    expert: 'bg-red-100 text-red-700'
  };

  const difficultyLabels = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    expert: 'Expert'
  };

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${
        isSelected ? 'ring-4 ring-purple-500 scale-105' : 'hover:scale-105'
      }`}
      onClick={onSelect}
    >
      {/* Template Preview */}
      <div className={`bg-gradient-to-r ${template.color} p-6 text-white text-center relative overflow-hidden`}>
        <div className="text-6xl mb-4">{template.thumbnail}</div>
        
        {/* Difficulty Badge */}
        <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[template.difficulty]}`}>
          {difficultyLabels[template.difficulty]}
        </div>
        
        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-4 left-4 w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          </div>
        )}
      </div>

      {/* Template Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{template.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{template.description}</p>
        
        {/* Elements Preview */}
        <div className="flex flex-wrap gap-1 mb-4">
          {template.elements.slice(0, 3).map((element, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {element}
            </span>
          ))}
          {template.elements.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{template.elements.length - 3} more
            </span>
          )}
        </div>

        {/* Occasion Badge */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 capitalize">
            {template.occasion === 'general' ? 'All Occasions' : template.occasion}
          </span>
          
          {/* Action Button */}
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isSelected
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700'
            }`}
          >
            {isSelected ? 'Selected' : 'Choose'}
          </button>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
} 