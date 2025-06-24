'use client';

import React, { useState } from 'react';
import { InteractiveElement } from '@/types/templates';
import { PremiumBadge } from '@/components/ui/PremiumPropertyWrapper';

interface ElementPaletteProps {
  elements: InteractiveElement[];
  onAddElement: (elementType: string) => void;
  selectedElements?: any[]; // Array of selected elements
  onSelectElement?: (elementId: string) => void;
  onUnselectElement?: (elementId: string) => void;
  isUserPremium?: boolean;
}

export function ElementPalette({
  elements,
  onAddElement,
  selectedElements = [],
  onSelectElement,
  onUnselectElement,
  isUserPremium,
}: ElementPaletteProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Elements', emoji: '✨' },
    { id: 'selected', name: 'Selected', emoji: '📌' },
    { id: 'basic', name: 'Basic', emoji: '📝' },
    { id: 'birthday', name: 'Birthday', emoji: '🎂' },
    { id: 'valentine', name: 'Valentine', emoji: '💕' },
    { id: 'celebration', name: 'Celebration', emoji: '🎊' },
  ];

  const getFilteredElements = () => {
    if (selectedCategory === 'selected') {
      // Return selected elements directly with proper display data
      return selectedElements.map((selectedElement, index) => ({
        id: selectedElement.id || `${selectedElement.elementType}_${index}`, // Ensure unique ID
        type: 'animation',
        name: selectedElement.elementType,
        description: 'Selected element',
        icon:
          selectedElement.elementType === 'balloons-interactive' ? '🎈' : '📝',
        category: 'selected',
        properties: selectedElement.properties,
        isPremium: false,
      }));
    } else if (selectedCategory === 'all') {
      return elements;
    } else {
      return elements.filter(el => el.category === selectedCategory);
    }
  };

  const filteredElements = getFilteredElements();

  const handleElementClick = (elementId: string) => {
    if (selectedCategory === 'selected') {
      // In selected view, clicking unselects
      // Find the original selected element to get the correct ID to unselect
      const originalElement = selectedElements.find(
        el =>
          el.id === elementId ||
          `${el.elementType}_${selectedElements.indexOf(el)}` === elementId
      );
      if (originalElement) {
        onUnselectElement?.(originalElement.id || originalElement.elementType);
      }
    } else {
      // In other views, always select (allow multiple instances)
      onSelectElement?.(elementId);
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border h-full flex flex-col'>
      {/* Header */}
      <div className='p-4 border-b flex-shrink-0'>
        <h3 className='text-lg font-semibold text-gray-800 mb-3'>Elements</h3>

        {/* Category Tabs */}
        <div className='flex flex-wrap gap-1'>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.emoji} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Elements List */}
      <div className='flex-1 p-4 overflow-y-auto'>
        <div className='grid grid-cols-2 gap-3'>
          {filteredElements.map(element => {
            const isSelected =
              selectedCategory === 'selected'
                ? true // In selected view, all elements are selected by definition
                : selectedElements.some(selected => selected.id === element.id);

            return (
              <button
                key={element.id}
                onClick={() => handleElementClick(element.id)}
                className={`p-3 rounded-lg border transition-all duration-200 text-left group relative ${
                  isSelected
                    ? 'bg-blue-50 border-blue-200 hover:bg-red-50 hover:border-red-200'
                    : 'bg-gray-50 border-transparent hover:bg-purple-50 hover:border-purple-200'
                }`}
              >
                <div className='text-2xl mb-2 relative'>
                  {element.icon}
                  {/* Premium Badge - positioned on top right of emoji */}
                  {element.isPremium && !isUserPremium && (
                    <div className='absolute -top-1 -right-1'>
                      <PremiumBadge label='Premium' />
                    </div>
                  )}
                </div>
                <div
                  className={`text-sm font-medium ${
                    isSelected
                      ? 'text-blue-700 group-hover:text-red-700'
                      : 'text-gray-800 group-hover:text-purple-700'
                  }`}
                >
                  {element.name}
                </div>
                <div className='text-xs text-gray-500 mt-1'>
                  {selectedCategory === 'selected'
                    ? 'Click to unselect (removes from canvas)'
                    : 'Click to add another instance'}
                </div>
                {isSelected && selectedCategory !== 'selected' && (
                  <div className='absolute top-2 right-2 text-blue-500 text-xs'>
                    {
                      selectedElements.filter(
                        selected => selected.id === element.id
                      ).length
                    }
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {filteredElements.length === 0 && (
          <div className='text-center py-8 text-gray-500'>
            <div className='text-4xl mb-2'>
              {selectedCategory === 'selected' ? '📌' : '🔍'}
            </div>
            <p>
              {selectedCategory === 'selected'
                ? 'No selected elements'
                : 'No elements in this category'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
