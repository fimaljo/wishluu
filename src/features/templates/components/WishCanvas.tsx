'use client';

import React from 'react';
import { WishElement, ElementProperties } from '@/types/templates';
import { InteractiveBalloons } from '@/components/ui/InteractiveBalloons';
import { BeautifulText } from '@/components/ui/BeautifulText';

interface WishCanvasProps {
  elements: WishElement[];
  selectedElement: WishElement | null;
  onSelectElement: (element: WishElement | null) => void;
  onUpdateElement: (elementId: string, properties: ElementProperties) => void;
  recipientName: string;
  message: string;
  theme: string;
  customBackgroundColor?: string;
  onCanvasSettingsToggle?: (show: boolean) => void;
  isPreviewMode?: boolean;
  stepSequence?: string[][]; // Custom step sequence from user
}

export function WishCanvas({
  elements,
  selectedElement,
  onSelectElement,
  onUpdateElement,
  recipientName,
  message,
  theme,
  customBackgroundColor,
  onCanvasSettingsToggle,
  isPreviewMode = false,
  stepSequence,
}: WishCanvasProps) {
  const [showCanvasSettings, setShowCanvasSettings] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0); // Track current step in sequence
  const [completedSteps, setCompletedSteps] = React.useState<Set<string>>(
    new Set()
  ); // Track completed elements

  const themeGradients = {
    purple: 'from-purple-400 to-pink-400',
    ocean: 'from-blue-400 to-cyan-400',
    sunset: 'from-orange-400 to-pink-400',
    forest: 'from-green-400 to-emerald-400',
    royal: 'from-yellow-400 to-orange-400',
    midnight: 'from-indigo-900 to-purple-900',
    'cotton-candy': 'from-pink-300 to-purple-300',
    aurora: 'from-teal-400 to-blue-500',
  };

  // Debug theme changes
  // console.log('WishCanvas - Current theme:', theme);
  // console.log('WishCanvas - Theme gradient:', themeGradients[theme as keyof typeof themeGradients] || themeGradients.purple);
  // console.log('WishCanvas - Available theme keys:', Object.keys(themeGradients));
  // console.log('WishCanvas - Custom background color:', customBackgroundColor);

  const handleSettingsToggle = () => {
    const newState = !showCanvasSettings;
    setShowCanvasSettings(newState);
    onCanvasSettingsToggle?.(newState);
  };

  // Add fade transition for step changes
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const handleElementComplete = (elementId: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCompletedSteps(prev => new Set([...prev, elementId]));
      setCurrentStep(prev => prev + 1);
      setIsTransitioning(false);
    }, 300);
  };

  // Determine which elements should be visible at current step
  const getVisibleElements = () => {
    if (isPreviewMode) {
      // In preview mode, show elements based on step sequence
      if (stepSequence && stepSequence.length > 0) {
        if (currentStep < stepSequence.length) {
          const currentStepElements = stepSequence[currentStep];
          return elements.filter(
            element => currentStepElements?.includes(element.id) || false
          );
        }
        return [];
      } else {
        // Fallback: show all elements in preview mode if no step sequence
        return elements.filter(
          el =>
            el.elementType === 'balloons-interactive' ||
            el.elementType === 'beautiful-text' ||
            el.elementType === 'confetti' ||
            el.elementType === 'music-player'
        );
      }
    } else {
      // In edit mode, only show the selected element for focused editing
      if (selectedElement) {
        return [selectedElement];
      }
      // If no element is selected, show all elements so user can click to select
      return elements;
    }
  };

  const renderElement = (element: WishElement) => {
    const isSelected = selectedElement?.id === element.id;
    const { properties } = element;

    const baseClasses = `absolute cursor-pointer transition-all duration-200 ${
      isSelected
        ? 'ring-2 ring-purple-500 ring-offset-2'
        : 'hover:ring-2 hover:ring-purple-300'
    }`;

    // Add a visual indicator for the currently selected element
    const selectedIndicator = isSelected && (
      <div className='absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold z-10'>
        ✏️
      </div>
    );

    // Apply transition classes based on element properties
    const getTransitionClasses = (transition?: string) => {
      switch (transition) {
        case 'fade':
          return 'animate-fade-in';
        case 'slide-up':
          return 'animate-slide-up';
        case 'slide-down':
          return 'animate-slide-down';
        case 'slide-left':
          return 'animate-slide-left';
        case 'slide-right':
          return 'animate-slide-right';
        case 'zoom-in':
          return 'animate-zoom-in';
        case 'zoom-out':
          return 'animate-zoom-out';
        case 'bounce':
          return 'animate-bounce';
        case 'rotate':
          return 'animate-spin';
        case 'flip':
          return 'animate-flip';
        default:
          return 'animate-fade-in';
      }
    };

    switch (element.elementType) {
      case 'balloons-interactive':
        return (
          <div
            key={element.id}
            className={`${baseClasses} ${getTransitionClasses(properties.transition)}`}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
            }}
            onClick={() => {
              // console.log('Element clicked:', element.id, element.elementType);
              onSelectElement(element);
            }}
          >
            {selectedIndicator}
            <InteractiveBalloons
              key={`${element.id}-${isPreviewMode ? 'preview' : 'edit'}`}
              numberOfBalloons={properties.numberOfBalloons || 5}
              balloonColors={
                properties.balloonColors || [
                  '#FF6B9D',
                  '#4ECDC4',
                  '#45B7D1',
                  '#96CEB4',
                  '#FFEAA7',
                ]
              }
              imageUrl={properties.imageUrl || null}
              balloonSize={properties.balloonSize || 60}
              startAnimation={
                isPreviewMode ? true : properties.startAnimation || false
              }
              resetAnimation={properties.resetAnimation || false}
              onBalloonPop={balloonId => {
                // console.log(`Balloon ${balloonId} popped!`);
                // Check if all balloons are popped and trigger next step
                if (isPreviewMode) {
                  // This will be handled by the InteractiveBalloons component
                }
              }}
              onAllBalloonsPopped={() => {
                if (isPreviewMode) {
                  handleElementComplete(element.id);
                }
              }}
              balloonImages={Array.from(
                { length: properties.numberOfBalloons || 5 },
                (_, index) => properties[`balloonImage${index}`] || null
              )}
            />
          </div>
        );

      case 'beautiful-text':
        return (
          <div
            key={element.id}
            className={`${baseClasses} ${getTransitionClasses(properties.transition)}`}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'auto',
              maxWidth: '80%',
            }}
            onClick={() => {
              if (isPreviewMode) {
                // In preview mode, clicking text progresses to next step
                handleElementComplete(element.id);
              } else {
                // In edit mode, clicking selects the element
                // console.log('Element clicked:', element.id, element.elementType);
                onSelectElement(element);
              }
            }}
          >
            {selectedIndicator}
            <BeautifulText
              title={properties.title || 'Happy Birthday!'}
              message={properties.message || 'Wishing you a wonderful day!'}
              titleFont={properties.titleFont || 'playfair'}
              messageFont={properties.messageFont || 'inter'}
              titleColor={properties.titleColor || '#FF6B9D'}
              messageColor={properties.messageColor || '#4A5568'}
              titleSize={properties.titleSize || 48}
              messageSize={properties.messageSize || 18}
              alignment={properties.alignment || 'center'}
              animation={properties.animation || 'fade-in'}
              shadow={properties.shadow !== false}
              gradient={properties.gradient || false}
              padding={properties.padding || 20}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border h-full flex flex-col'>
      {/* Canvas Header - Hidden in preview mode */}
      {!isPreviewMode && (
        <div className='p-4 border-b flex-shrink-0'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-semibold text-gray-800'>
                Wish Canvas
              </h3>
              <p className='text-sm text-gray-500'>
                {selectedElement
                  ? `Editing: ${selectedElement.elementType} (Use Properties Panel to switch elements)`
                  : 'Click elements to select and edit them'}
              </p>
            </div>
            <button
              onClick={handleSettingsToggle}
              className={`p-2 rounded-lg transition-colors ${
                showCanvasSettings
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title='Canvas Settings'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Canvas Area - Responsive */}
      <div
        className={`relative bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden ${isPreviewMode ? 'h-full' : 'flex-1'}`}
      >
        {/* Background */}
        {customBackgroundColor ? (
          <div
            className='absolute inset-0 opacity-60'
            style={{ backgroundColor: customBackgroundColor }}
          />
        ) : (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${themeGradients[theme as keyof typeof themeGradients] || themeGradients.purple} opacity-60`}
          />
        )}

        {/* Canvas Content - Responsive */}
        <div className='relative w-full h-full p-4 sm:p-6 md:p-8 overflow-auto'>
          {/* Progress Indicator - Only show in preview mode */}
          {isPreviewMode && (
            <div className='absolute top-4 right-4 z-20'>
              <div className='bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-700 shadow-lg'>
                Step {currentStep + 1} of{' '}
                {stepSequence && stepSequence.length > 0
                  ? stepSequence.length
                  : elements.filter(
                      el =>
                        el.elementType === 'balloons-interactive' ||
                        el.elementType === 'beautiful-text' ||
                        el.elementType === 'confetti' ||
                        el.elementType === 'music-player'
                    ).length}
              </div>
            </div>
          )}

          {/* Next Button - Only show in preview mode for non-interactive elements */}
          {isPreviewMode &&
            getVisibleElements().length > 0 &&
            (() => {
              // Use custom step sequence if provided, otherwise auto-generate
              const sequenceToUse: string[][] =
                stepSequence && stepSequence.length > 0
                  ? stepSequence
                  : elements
                      .filter(
                        el =>
                          el.elementType === 'balloons-interactive' ||
                          el.elementType === 'beautiful-text' ||
                          el.elementType === 'confetti' ||
                          el.elementType === 'music-player'
                      )
                      .map(el => [el.id]);

              // Only show Next button if there are more steps to complete
              const hasMoreSteps = currentStep < sequenceToUse.length - 1;

              return hasMoreSteps ? (
                <div className='absolute bottom-4 right-4 z-20'>
                  <button
                    onClick={() => {
                      const currentElement = getVisibleElements()[0];
                      if (currentElement) {
                        handleElementComplete(currentElement.id);
                      }
                    }}
                    className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300'
                  >
                    Next →
                  </button>
                </div>
              ) : null;
            })()}

          {/* Default Content */}
          {elements.length === 0 && (
            <div className='flex items-center justify-center h-full'>
              <div className='text-center text-gray-500 px-4'>
                <div className='text-4xl sm:text-6xl mb-4'>✨</div>
                <h3 className='text-lg sm:text-xl font-semibold mb-2'>
                  Start Building Your Wish
                </h3>
                <p className='text-sm sm:text-base'>
                  Add elements from the palette to create your special wish
                </p>
              </div>
            </div>
          )}

          {/* Rendered Elements */}
          <div
            className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'} min-h-full`}
          >
            {getVisibleElements().map(renderElement)}
          </div>

          {/* Click to add element hint */}
          {elements.length === 0 && (
            <div className='absolute bottom-4 right-4 text-xs text-gray-400'>
              Click elements in the palette to add them
            </div>
          )}
        </div>

        {/* Canvas Grid Overlay (for positioning) - Hidden on mobile */}
        <div className='absolute inset-0 pointer-events-none opacity-5 hidden md:block'>
          <div
            className='w-full h-full'
            style={{
              backgroundImage:
                'radial-gradient(circle, #000 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
        </div>
      </div>
    </div>
  );
}
