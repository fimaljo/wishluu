'use client';

import React from 'react';
import {
  WishElement,
  ElementProperties,
  InteractiveElement,
  PropertyDefinition,
} from '@/types/templates';
import { Button } from '@/components/ui/Button';
import { ColorPicker } from '@/components/ui/ColorPicker';
import {
  PremiumPropertyWrapper,
  PremiumPropertyLabel,
  PremiumBadge,
} from '@/components/ui/PremiumPropertyWrapper';
import { getAllElements } from '@/config/elements';

interface ElementPropertiesPanelProps {
  element: WishElement | null;
  onUpdateElement: (elementId: string, properties: ElementProperties) => void;
  onDeleteElement: (elementId: string) => void;
  recipientName: string;
  message: string;
  theme: string;
  onUpdateRecipientName: (name: string) => void;
  onUpdateMessage: (message: string) => void;
  onUpdateTheme: (theme: string) => void;
  customBackgroundColor?: string;
  onUpdateCustomBackgroundColor?: (color: string) => void;
  showCanvasSettings?: boolean;
  isUserPremium?: boolean;
  onUpgradeClick?: () => void;
  selectedElements?: WishElement[];
  elements?: WishElement[];
  onSwitchToElement?: (elementId: string) => void;
}

export function ElementPropertiesPanel({
  element,
  onUpdateElement,
  onDeleteElement,
  recipientName,
  message,
  theme,
  onUpdateRecipientName,
  onUpdateMessage,
  onUpdateTheme,
  customBackgroundColor = '#ffffff',
  onUpdateCustomBackgroundColor,
  showCanvasSettings = true,
  isUserPremium = false,
  onUpgradeClick,
  selectedElements,
  elements = [],
  onSwitchToElement,
}: ElementPropertiesPanelProps) {
  const [localCustomBackgroundColor, setLocalCustomBackgroundColor] =
    React.useState(customBackgroundColor);
  const [animationState, setAnimationState] = React.useState({
    startAnimation: false,
    resetAnimation: false,
  });

  // Reset animation state after a short delay
  React.useEffect(() => {
    if (animationState.startAnimation || animationState.resetAnimation) {
      const timer = setTimeout(() => {
        setAnimationState({ startAnimation: false, resetAnimation: false });
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [animationState]);

  const handleAnimationControl = (type: 'start' | 'reset') => {
    if (element) {
      const newState =
        type === 'start'
          ? { startAnimation: true, resetAnimation: false }
          : { startAnimation: false, resetAnimation: true };

      setAnimationState(newState);

      // Update element properties with animation state
      const updatedProperties = {
        ...element.properties,
        ...newState,
      };
      onUpdateElement(element.id, updatedProperties);
    }
  };

  const themes = [
    {
      value: 'purple',
      name: 'Purple Dream',
      gradient: 'from-purple-400 to-pink-400',
      preview: 'bg-gradient-to-br from-purple-400 to-pink-400',
    },
    {
      value: 'ocean',
      name: 'Ocean Blue',
      gradient: 'from-blue-400 to-cyan-400',
      preview: 'bg-gradient-to-br from-blue-400 to-cyan-400',
    },
    {
      value: 'sunset',
      name: 'Sunset',
      gradient: 'from-orange-400 to-pink-400',
      preview: 'bg-gradient-to-br from-orange-400 to-pink-400',
    },
    {
      value: 'forest',
      name: 'Forest Green',
      gradient: 'from-green-400 to-emerald-400',
      preview: 'bg-gradient-to-br from-green-400 to-emerald-400',
    },
    {
      value: 'royal',
      name: 'Royal Gold',
      gradient: 'from-yellow-400 to-orange-400',
      preview: 'bg-gradient-to-br from-yellow-400 to-orange-400',
    },
    {
      value: 'midnight',
      name: 'Midnight',
      gradient: 'from-indigo-900 to-purple-900',
      preview: 'bg-gradient-to-br from-indigo-900 to-purple-900',
    },
    {
      value: 'cotton-candy',
      name: 'Cotton Candy',
      gradient: 'from-pink-300 to-purple-300',
      preview: 'bg-gradient-to-br from-pink-300 to-purple-300',
    },
    {
      value: 'aurora',
      name: 'Aurora',
      gradient: 'from-teal-400 to-blue-500',
      preview: 'bg-gradient-to-br from-teal-400 to-blue-500',
    },
  ];

  const musicLibrary = [
    {
      id: 'birthday-song',
      name: 'Happy Birthday',
      url: '/audio/birthday-song.mp3',
      duration: '2:30',
      category: 'birthday',
    },
    {
      id: 'romantic-piano',
      name: 'Romantic Piano',
      url: '/audio/romantic-piano.mp3',
      duration: '3:15',
      category: 'romantic',
    },
    {
      id: 'celebration',
      name: 'Celebration',
      url: '/audio/celebration.mp3',
      duration: '2:45',
      category: 'celebration',
    },
    {
      id: 'peaceful',
      name: 'Peaceful Melody',
      url: '/audio/peaceful.mp3',
      duration: '4:20',
      category: 'ambient',
    },
    {
      id: 'upbeat',
      name: 'Upbeat Joy',
      url: '/audio/upbeat.mp3',
      duration: '2:10',
      category: 'celebration',
    },
  ];

  const transitions = [
    { value: 'fade', name: 'Fade In', description: 'Smooth fade transition' },
    { value: 'slide-up', name: 'Slide Up', description: 'Slide from bottom' },
    { value: 'slide-down', name: 'Slide Down', description: 'Slide from top' },
    {
      value: 'slide-left',
      name: 'Slide Left',
      description: 'Slide from right',
    },
    {
      value: 'slide-right',
      name: 'Slide Right',
      description: 'Slide from left',
    },
    { value: 'zoom-in', name: 'Zoom In', description: 'Scale up from center' },
    {
      value: 'zoom-out',
      name: 'Zoom Out',
      description: 'Scale down to center',
    },
    { value: 'bounce', name: 'Bounce', description: 'Bouncy entrance' },
    { value: 'rotate', name: 'Rotate', description: 'Spin into view' },
    { value: 'flip', name: 'Flip', description: '3D flip effect' },
  ];

  const handlePropertyChange = (property: string, value: any) => {
    if (element) {
      const updatedProperties = {
        ...element.properties,
        [property]: value,
      };
      onUpdateElement(element.id, updatedProperties);
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border h-full flex flex-col'>
      {/* Header */}
      <div className='p-3 md:p-4 border-b flex-shrink-0'>
        <h3 className='text-base md:text-lg font-semibold text-gray-800'>
          Properties
        </h3>
        {element && !showCanvasSettings && (
          <p className='text-xs md:text-sm text-gray-500'>
            Editing: {element.elementType}
          </p>
        )}

        {/* Multiple Element Selector */}
        {elements && elements.length > 1 && onSwitchToElement && (
          <div className='mt-2 md:mt-3'>
            <label className='block text-xs font-medium text-gray-700 mb-1 md:mb-2'>
              Available Elements:
            </label>
            <div className='flex flex-wrap gap-1'>
              {elements.map((canvasElement, index) => (
                <div key={canvasElement.id} className='flex items-center'>
                  <button
                    onClick={() => onSwitchToElement(canvasElement.id)}
                    className={`px-1 md:px-2 py-1 text-xs rounded-l border transition-colors ${
                      element?.id === canvasElement.id
                        ? 'bg-purple-100 border-purple-300 text-purple-700'
                        : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {canvasElement.elementType} {index + 1}
                  </button>
                  <button
                    onClick={() => onDeleteElement(canvasElement.id)}
                    className='px-1 py-1 text-xs bg-red-100 border border-red-300 text-red-600 hover:bg-red-200 rounded-r transition-colors'
                    title='Remove this element'
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content - Scrollable */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-3 md:p-4 space-y-4 md:space-y-6'>
          {/* Canvas Settings Section - Only show if showCanvasSettings is true */}
          {showCanvasSettings && (
            <div className='border-b pb-6'>
              <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                🎨 Canvas Settings
              </h3>

              {/* Theme Selection */}
              <div className='mb-4 md:mb-6'>
                <label className='block text-sm font-medium text-gray-700 mb-2 md:mb-3'>
                  Background Theme
                </label>
                <div className='grid grid-cols-2 md:grid-cols-2 gap-2'>
                  {themes.map(themeOption => (
                    <button
                      key={themeOption.value}
                      onClick={() => {
                        onUpdateTheme(themeOption.value);
                      }}
                      className={`p-2 md:p-3 rounded-lg border-2 transition-all text-left ${
                        theme === themeOption.value
                          ? 'border-purple-500 ring-2 ring-purple-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className={`w-full h-6 md:h-8 rounded mb-1 md:mb-2 ${themeOption.preview}`}
                      ></div>
                      <div className='text-xs font-medium text-gray-800'>
                        {themeOption.name}
                      </div>
                    </button>
                  ))}
                </div>
                <div className='text-xs text-gray-500 mt-2'>
                  Current theme: {theme}
                </div>
              </div>

              {/* Custom Background Color */}
              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Custom Background Color
                </label>
                <div className='flex items-center gap-3'>
                  <input
                    type='color'
                    value={localCustomBackgroundColor}
                    onChange={e => {
                      setLocalCustomBackgroundColor(e.target.value);
                      onUpdateCustomBackgroundColor?.(e.target.value);
                    }}
                    className='w-12 h-10 rounded border border-gray-300 cursor-pointer'
                  />
                  <input
                    type='text'
                    value={localCustomBackgroundColor}
                    onChange={e => {
                      setLocalCustomBackgroundColor(e.target.value);
                      onUpdateCustomBackgroundColor?.(e.target.value);
                    }}
                    className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm'
                    placeholder='#ffffff'
                  />
                </div>
                <p className='text-xs text-gray-500 mt-1'>
                  Choose a custom color or use the theme above
                </p>
              </div>

              {/* Music Selection */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Background Music
                </label>
                <select className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'>
                  <option value=''>No music</option>
                  {musicLibrary.map(track => (
                    <option key={track.id} value={track.id}>
                      {track.name} ({track.duration})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Element Properties Section - Show when element is selected and canvas settings are off */}
          {element && !showCanvasSettings && (
            <div>
              <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                ⚙️ Element Properties
              </h3>

              {renderElementProperties()}
            </div>
          )}

          {/* No Element Selected Message - Show when no element is selected and canvas settings are off */}
          {!element && !showCanvasSettings && (
            <div className='text-center text-gray-500 py-8'>
              <div className='text-4xl mb-4'>✨</div>
              <p>Select an element from the canvas to edit its properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function renderElementProperties() {
    if (!element) return null;

    const { properties } = element;

    // Find the element definition to get property definitions
    const elementDefinition = getAllElements().find(
      el => el.id === element.elementType
    );
    const propertyDefinitions = elementDefinition?.propertyDefinitions || [];

    switch (element.elementType) {
      case 'balloons-interactive':
        return (
          <div className='space-y-4'>
            {/* Play/Start Animation Button - Moved to top */}
            <div className='space-y-3'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-3'>
                  Animation Control
                </label>
                <div className='flex gap-3'>
                  <button
                    onClick={() => handleAnimationControl('start')}
                    className='flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-purple-400 via-pink-500 to-purple-600 text-white rounded-xl hover:from-purple-500 hover:via-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium text-sm border border-purple-300/20'
                  >
                    <div className='relative'>
                      <div className='w-4 h-4 bg-white rounded-full animate-pulse shadow-sm'></div>
                      <div className='absolute inset-0 w-4 h-4 bg-white rounded-full animate-ping opacity-75'></div>
                    </div>
                    <span className='drop-shadow-sm'>Start Animation</span>
                  </button>
                  <button
                    onClick={() => handleAnimationControl('reset')}
                    className='flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-gray-400 via-slate-500 to-gray-600 text-white rounded-xl hover:from-gray-500 hover:via-slate-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium text-sm border border-gray-300/20'
                  >
                    <div className='relative'>
                      <div className='w-4 h-4 border-2 border-white rounded-full shadow-sm'></div>
                      <div className='absolute inset-0 w-4 h-4 border-2 border-white rounded-full animate-spin opacity-50'></div>
                    </div>
                    <span className='drop-shadow-sm'>Reset</span>
                  </button>
                </div>
                <p className='text-xs text-gray-500 mt-2 text-center font-medium'>
                  ✨ Start the balloon floating animation or reset to initial
                  state
                </p>
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Number of Balloons (1-20)
              </label>
              <input
                type='number'
                min='1'
                max='20'
                value={properties.numberOfBalloons || 5}
                onChange={e => {
                  const value = parseInt(e.target.value);
                  if (value >= 1 && value <= 20) {
                    handlePropertyChange('numberOfBalloons', value);
                  }
                }}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
              />
              <div className='text-xs text-gray-500 mt-1'>
                Current: {properties.numberOfBalloons || 5} balloons
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Balloon Size
              </label>
              <input
                type='range'
                min='30'
                max='120'
                value={properties.balloonSize || 60}
                onChange={e =>
                  handlePropertyChange('balloonSize', parseInt(e.target.value))
                }
                className='w-full'
              />
              <div className='text-xs text-gray-500 mt-1'>
                {properties.balloonSize || 60}px (Small: 30px, Large: 120px)
              </div>
            </div>

            {/* Element Transition */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Element Transition
              </label>
              <select
                value={properties.transition || 'fade'}
                onChange={e =>
                  handlePropertyChange('transition', e.target.value)
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
              >
                {transitions.map(transition => (
                  <option key={transition.value} value={transition.value}>
                    {transition.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Interaction Hint */}
            <div>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={properties.showHint !== false}
                  onChange={e =>
                    handlePropertyChange('showHint', e.target.checked)
                  }
                  className='rounded border-gray-300 text-purple-600 focus:ring-purple-500'
                />
                <span className='ml-2 text-sm font-medium text-gray-700'>
                  Show Interaction Hints
                </span>
              </label>
              <p className='text-xs text-gray-500 mt-1'>
                Display helpful hints to guide users on how to interact with the
                balloons
              </p>
            </div>

            {/* Balloon Images Section */}
            <div className='space-y-3'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Balloon Images
                </label>
                <p className='text-xs text-gray-500 mb-3'>
                  Assign images to individual balloons. Leave empty to show
                  nothing when popped.
                </p>

                {/* Individual balloon image inputs */}
                <div className='space-y-2'>
                  {Array.from(
                    { length: Math.min(properties.numberOfBalloons || 5, 20) },
                    (_, index) => (
                      <div key={index} className='flex items-center gap-2'>
                        <label className='text-xs text-gray-600 w-8'>
                          #{index + 1}
                        </label>
                        <input
                          type='url'
                          value={properties[`balloonImage${index}`] || ''}
                          onChange={e =>
                            handlePropertyChange(
                              `balloonImage${index}`,
                              e.target.value || null
                            )
                          }
                          className='flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent'
                          placeholder='Image URL for balloon'
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'beautiful-text':
        return (
          <div className='space-y-4'>
            {/* Render properties based on property definitions */}
            {propertyDefinitions.map((propDef: PropertyDefinition) => {
              const currentValue =
                properties[propDef.name] ?? propDef.defaultValue;

              return (
                <div key={propDef.name} className='relative pb-3'>
                  <PremiumPropertyWrapper
                    isPremium={propDef.isPremium || false}
                    premiumLabel={propDef.premiumLabel || 'Premium'}
                    upgradeMessage={
                      propDef.upgradeMessage || 'Upgrade to access this feature'
                    }
                    isUserPremium={isUserPremium}
                    onUpgradeClick={onUpgradeClick || (() => {})}
                    className='mb-3'
                  >
                    <div className='space-y-2'>
                      <PremiumPropertyLabel
                        label={propDef.label}
                        isPremium={propDef.isPremium || false}
                        premiumLabel={propDef.premiumLabel || 'Premium'}
                        className='mb-2'
                      />

                      {propDef.type === 'text' && (
                        <input
                          type='text'
                          value={currentValue}
                          onChange={e =>
                            handlePropertyChange(propDef.name, e.target.value)
                          }
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                          placeholder={propDef.label}
                        />
                      )}

                      {propDef.type === 'select' && (
                        <select
                          value={currentValue}
                          onChange={e =>
                            handlePropertyChange(propDef.name, e.target.value)
                          }
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                        >
                          {propDef.options?.map(
                            (option: {
                              value: string;
                              label: string;
                              isPremium?: boolean;
                            }) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                                {option.isPremium &&
                                  !isUserPremium &&
                                  ' ✨ (Premium)'}
                              </option>
                            )
                          )}
                        </select>
                      )}

                      {propDef.type === 'color' && (
                        <div className='flex items-center gap-3'>
                          <input
                            type='color'
                            value={currentValue}
                            onChange={e =>
                              handlePropertyChange(propDef.name, e.target.value)
                            }
                            className='w-12 h-10 rounded border border-gray-300 cursor-pointer'
                          />
                          <input
                            type='text'
                            value={currentValue}
                            onChange={e =>
                              handlePropertyChange(propDef.name, e.target.value)
                            }
                            className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm'
                            placeholder={propDef.label}
                          />
                        </div>
                      )}

                      {propDef.type === 'range' && (
                        <>
                          <input
                            type='range'
                            min={propDef.min}
                            max={propDef.max}
                            step={propDef.step}
                            value={currentValue}
                            onChange={e =>
                              handlePropertyChange(
                                propDef.name,
                                parseInt(e.target.value)
                              )
                            }
                            className='w-full'
                          />
                          <div className='text-xs text-gray-500 mt-1'>
                            {currentValue}
                            {propDef.name.includes('Size') && 'px'}
                            {propDef.name.includes('Speed') &&
                              ' (Slow: ' +
                                propDef.min +
                                ', Fast: ' +
                                propDef.max +
                                ')'}
                            {propDef.name.includes('Duration') && 'ms'}
                            {propDef.name.includes('Padding') &&
                              'px (None: ' +
                                propDef.min +
                                'px, Large: ' +
                                propDef.max +
                                'px)'}
                          </div>
                        </>
                      )}

                      {propDef.type === 'checkbox' && (
                        <label className='flex items-center'>
                          <input
                            type='checkbox'
                            checked={currentValue}
                            onChange={e =>
                              handlePropertyChange(
                                propDef.name,
                                e.target.checked
                              )
                            }
                            className='rounded border-gray-300 text-purple-600 focus:ring-purple-500'
                          />
                          <span className='ml-2 text-sm font-medium text-gray-700'>
                            {propDef.label}
                          </span>
                        </label>
                      )}
                    </div>
                  </PremiumPropertyWrapper>
                </div>
              );
            })}
          </div>
        );

      default:
        return (
          <div className='text-gray-500 text-sm'>
            Properties for this element type are not yet implemented.
          </div>
        );
    }
  }
}
