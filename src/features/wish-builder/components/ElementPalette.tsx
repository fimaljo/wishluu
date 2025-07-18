'use client';

import React, { useState, useEffect } from 'react';
import { InteractiveElement } from '@/types/templates';
import { PremiumBadge } from '@/components/ui/PremiumPropertyWrapper';

interface ElementPaletteProps {
  elements: InteractiveElement[];
  onAddElement: (elementType: string) => void;
  selectedElements?: any[]; // Array of selected elements
  onSelectElement?: (elementId: string) => void;
  onUnselectElement?: (elementId: string) => void;
  isUserPremium?: boolean;
  isRestrictedMode?: boolean; // New prop for template mode
  canvasElements?: any[]; // Array of elements currently on the canvas
}

export function ElementPalette({
  elements,
  onAddElement,
  selectedElements = [],
  onSelectElement,
  onUnselectElement,
  isUserPremium,
  isRestrictedMode = false,
  canvasElements = [],
}: ElementPaletteProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Update selected category when restricted mode changes
  useEffect(() => {
    setSelectedCategory(isRestrictedMode ? 'selected' : 'all');
  }, [isRestrictedMode]);

  const categories = isRestrictedMode
    ? [
        { id: 'selected', name: 'Selected Elements', emoji: '📌' },
        { id: 'all', name: 'Template Elements', emoji: '✨' },
      ]
    : [
        { id: 'all', name: 'All Elements', emoji: '✨' },
        { id: 'selected', name: 'Selected', emoji: '📌' },
        { id: 'basic', name: 'Basic', emoji: '📝' },
        { id: 'birthday', name: 'Birthday', emoji: '🎂' },
        { id: 'valentine', name: 'Valentine', emoji: '💕' },
        { id: 'celebration', name: 'Celebration', emoji: '🎊' },
        { id: 'social', name: 'Social', emoji: '💬' },
      ];

  const getFilteredElements = () => {
    if (selectedCategory === 'selected') {
      // In template mode, show current canvas elements; in normal mode, show selected elements
      const elementsToShow = isRestrictedMode
        ? canvasElements
        : selectedElements;
      return elementsToShow.map((element, index) => ({
        id: element.id || `${element.elementType}_${index}`, // Ensure unique ID
        type: 'animation',
        name: element.elementType,
        description: isRestrictedMode
          ? 'Template element (can be customized)'
          : 'Selected element',
        icon:
          element.elementType === 'balloons-interactive'
            ? '🎈'
            : element.elementType === 'comment-wall'
              ? '💬'
              : '📝',
        category: 'selected',
        properties: element.properties,
        isPremium: false,
        isTemplateElement: isRestrictedMode, // Mark as template element
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
      // Find the element to get the correct ID to unselect
      const elementsToShow = isRestrictedMode
        ? canvasElements
        : selectedElements;
      const originalElement = elementsToShow.find(
        el =>
          el.id === elementId ||
          `${el.elementType}_${elementsToShow.indexOf(el)}` === elementId
      );
      if (originalElement) {
        onUnselectElement?.(originalElement.id || originalElement.elementType);
      }
    } else {
      // In restricted mode, check if this element type exists in the original template
      if (isRestrictedMode) {
        // Check if this element type exists in the original template elements (not current canvas)
        const elementTypeExists = selectedElements.some(
          selectedEl => selectedEl.elementType === elementId
        );
        if (elementTypeExists) {
          // If element type exists in template, allow adding it back
          onSelectElement?.(elementId);
        }
        // If element type doesn't exist in template, don't allow adding it
        return;
      }
      // In other views, always select (allow multiple instances)
      onSelectElement?.(elementId);
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border h-full flex flex-col'>
      {/* Header */}
      <div className='p-3 md:p-4 border-b flex-shrink-0'>
        <h3 className='text-base md:text-lg font-semibold text-gray-800 mb-2 md:mb-3'>
          {isRestrictedMode ? 'Template Management' : 'Elements'}
        </h3>

        {/* Restricted Mode Notice */}
        {isRestrictedMode && (
          <div className='mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
            <div className='flex items-center text-blue-800'>
              <span className='text-lg mr-2'>ℹ️</span>
              <div className='text-sm'>
                <p className='font-medium'>Template Mode</p>
                <p className='text-blue-600'>
                  Selected Elements: Remove elements from canvas. Template
                  Elements: Add back removed elements.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className='flex flex-wrap gap-1'>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium transition-colors ${
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
      <div className='flex-1 p-3 md:p-4 overflow-y-auto'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3'>
          {filteredElements.map(element => {
            const isSelected =
              selectedCategory === 'selected'
                ? true // In selected view, all elements are selected by definition
                : selectedElements.some(selected => selected.id === element.id);

            // In restricted mode, check if element type exists in original template
            const elementTypeExists =
              isRestrictedMode &&
              selectedElements.some(
                selectedEl => selectedEl.elementType === element.id
              );
            const canAdd = !isRestrictedMode || elementTypeExists;

            return (
              <button
                key={element.id}
                onClick={() => handleElementClick(element.id)}
                disabled={isRestrictedMode && !elementTypeExists}
                className={`p-2 md:p-3 rounded-lg border transition-all duration-200 text-left group relative ${
                  isSelected
                    ? 'bg-blue-50 border-blue-200 hover:bg-red-50 hover:border-red-200'
                    : isRestrictedMode && !elementTypeExists
                      ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                      : 'bg-gray-50 border-transparent hover:bg-purple-50 hover:border-purple-200'
                }`}
              >
                <div className='text-xl md:text-2xl mb-1 md:mb-2 relative'>
                  {element.icon}
                  {/* Premium Badge - positioned on top right of emoji */}
                  {element.isPremium && !isUserPremium && (
                    <div className='absolute -top-1 -right-1'>
                      <PremiumBadge label='Premium' />
                    </div>
                  )}

                  {/* Template Element Badge - show for template elements in selected view */}
                  {selectedCategory === 'selected' &&
                    (element as any).isTemplateElement && (
                      <div className='absolute -top-1 -right-1'>
                        <div className='bg-blue-500 text-white text-xs px-1 py-0.5 rounded-full'>
                          🎨
                        </div>
                      </div>
                    )}
                </div>
                <div
                  className={`text-xs md:text-sm font-medium ${
                    isSelected
                      ? 'text-blue-700 group-hover:text-red-700'
                      : isRestrictedMode && !elementTypeExists
                        ? 'text-gray-400'
                        : 'text-gray-800 group-hover:text-purple-700'
                  }`}
                >
                  {element.name}
                </div>
                <div className='text-xs text-gray-500 mt-1 hidden md:block'>
                  {selectedCategory === 'selected'
                    ? isRestrictedMode
                      ? ''
                      : 'Click to unselect (removes from canvas)'
                    : isRestrictedMode && !elementTypeExists
                      ? 'Not available in this template'
                      : isRestrictedMode && elementTypeExists
                        ? 'Click to add back to canvas'
                        : 'Click to add another instance'}
                </div>
                {isSelected && selectedCategory !== 'selected' && (
                  <div className='absolute top-1 md:top-2 right-1 md:right-2 text-blue-500 text-xs'>
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
          <div className='text-center py-6 md:py-8 text-gray-500'>
            <div className='text-3xl md:text-4xl mb-2'>
              {selectedCategory === 'selected' ? '📌' : '🔍'}
            </div>
            <p className='text-sm md:text-base'>
              {selectedCategory === 'selected'
                ? isRestrictedMode
                  ? 'No template elements found'
                  : 'No selected elements'
                : 'No elements in this category'}
            </p>
            {isRestrictedMode && selectedCategory !== 'selected' && (
              <p className='text-xs text-gray-400 mt-2'>
                Switch to "Selected" to see template elements you can customize
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
