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
  music?: string;
  onUpdateMusic?: (music: string) => void;
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
  music,
  onUpdateMusic,
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
      value: 'white',
      name: 'Pure White',
      gradient: 'from-white to-gray-50',
      preview: 'bg-gradient-to-br from-white to-gray-50 border border-gray-200',
    },
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

              {/* Custom Background Color - Commented out */}
              {/* <div className='mb-6'>
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
              </div> */}

              {/* Music Selection */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Background Music
                </label>
                <select
                  value={music || ''}
                  onChange={e => onUpdateMusic && onUpdateMusic(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                >
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

      case 'comment-wall':
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

      case 'date-question':
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
                        <div>
                          <input
                            type='text'
                            value={currentValue}
                            onChange={e => {
                              let newValue = e.target.value;
                              // Apply length limits based on property name
                              if (propDef.name === 'question') {
                                newValue = newValue.substring(0, 100);
                              } else if (
                                propDef.name === 'yesText' ||
                                propDef.name === 'noText'
                              ) {
                                newValue = newValue.substring(0, 20);
                              }
                              handlePropertyChange(propDef.name, newValue);
                            }}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                            placeholder={propDef.label}
                            maxLength={
                              propDef.name === 'question'
                                ? 100
                                : propDef.name === 'yesText' ||
                                    propDef.name === 'noText'
                                  ? 20
                                  : undefined
                            }
                          />
                          {/* Show character count for date-question properties */}
                          {(propDef.name === 'question' ||
                            propDef.name === 'yesText' ||
                            propDef.name === 'noText') && (
                            <div className='text-xs text-gray-500 mt-1'>
                              {currentValue.length}/
                              {propDef.name === 'question' ? 100 : 20}{' '}
                              characters
                              {((propDef.name === 'question' &&
                                currentValue.length >= 90) ||
                                ((propDef.name === 'yesText' ||
                                  propDef.name === 'noText') &&
                                  currentValue.length >= 15)) && (
                                <span className='text-orange-600 ml-2'>
                                  {propDef.name === 'question'
                                    ? 100 - currentValue.length
                                    : 20 - currentValue.length}{' '}
                                  remaining
                                </span>
                              )}
                            </div>
                          )}
                        </div>
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

      case 'image-puzzle':
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
                        <div>
                          <input
                            type='text'
                            value={currentValue}
                            onChange={e => {
                              let newValue = e.target.value;
                              // Apply length limits based on property name
                              if (propDef.name === 'imageUrl') {
                                newValue = newValue.substring(0, 500);
                              } else if (propDef.name === 'secretMessage') {
                                newValue = newValue.substring(0, 300);
                              }
                              handlePropertyChange(propDef.name, newValue);
                            }}
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                            placeholder={propDef.label}
                            maxLength={
                              propDef.name === 'imageUrl'
                                ? 500
                                : propDef.name === 'secretMessage'
                                  ? 300
                                  : undefined
                            }
                          />
                          {/* Show character count for image URL */}
                          {propDef.name === 'imageUrl' && (
                            <div className='text-xs text-gray-500 mt-1'>
                              {currentValue.length}/500 characters
                              {currentValue.length >= 450 && (
                                <span className='text-orange-600 ml-2'>
                                  {500 - currentValue.length} remaining
                                </span>
                              )}
                            </div>
                          )}
                          {/* Show character count for secret message */}
                          {propDef.name === 'secretMessage' && (
                            <div className='text-xs text-gray-500 mt-1'>
                              {currentValue.length}/300 characters
                              {currentValue.length >= 250 && (
                                <span className='text-orange-600 ml-2'>
                                  {300 - currentValue.length} remaining
                                </span>
                              )}
                            </div>
                          )}
                        </div>
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

      case 'interactive-quiz':
        return (
          <div className='space-y-4'>
            {/* Quiz Title */}
            <div className='relative pb-3'>
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Quiz Title
                </label>
                <input
                  type='text'
                  value={properties.title || 'How Well Do You Know Me?'}
                  onChange={e => {
                    const newValue = e.target.value.substring(0, 100);
                    handlePropertyChange('title', newValue);
                  }}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  placeholder='How Well Do You Know Me?'
                  maxLength={100}
                />
                <div className='text-xs text-gray-500 mt-1'>
                  {(properties.title || 'How Well Do You Know Me?').length}/100
                  characters
                  {(properties.title || 'How Well Do You Know Me?').length >=
                    80 && (
                    <span className='text-orange-600 ml-2'>
                      {100 -
                        (properties.title || 'How Well Do You Know Me?')
                          .length}{' '}
                      remaining
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Dynamic Questions */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <label className='block text-sm font-medium text-gray-700'>
                  Questions (
                  {properties.questions && properties.questions.length > 0
                    ? properties.questions.length
                    : 1}
                  /10)
                </label>
                <div className='flex gap-2'>
                  {properties.questions && properties.questions.length > 1 && (
                    <button
                      onClick={() => {
                        const currentQuestions = properties.questions || [];
                        const newQuestions = currentQuestions.slice(0, -1);
                        handlePropertyChange('questions', newQuestions);
                      }}
                      className='px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors'
                    >
                      Remove Last
                    </button>
                  )}
                  {(properties.questions && properties.questions.length > 0
                    ? properties.questions.length
                    : 1) < 10 && (
                    <button
                      onClick={() => {
                        const currentQuestions =
                          properties.questions &&
                          properties.questions.length > 0
                            ? properties.questions
                            : [];
                        const newQuestions = [
                          ...currentQuestions,
                          {
                            question: '',
                            options: ['', '', '', ''],
                            correctAnswer: 0,
                          },
                        ];
                        handlePropertyChange('questions', newQuestions);
                      }}
                      className='px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors'
                    >
                      Add Question
                    </button>
                  )}
                </div>
              </div>

              {/* Render current questions */}
              {(properties.questions && properties.questions.length > 0
                ? properties.questions
                : [
                    {
                      question: '',
                      options: ['', '', '', ''],
                      correctAnswer: 0,
                    },
                  ]
              ).map((question: any, index: number) => (
                <div
                  key={index}
                  className='p-4 border border-gray-200 rounded-lg bg-gray-50'
                >
                  <div className='space-y-3'>
                    {/* Question Text */}
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Question {index + 1}
                      </label>
                      <input
                        type='text'
                        value={question.question}
                        onChange={e => {
                          const newValue = e.target.value.substring(0, 150);
                          const currentQuestions = properties.questions || [];
                          const newQuestions = [...currentQuestions];
                          newQuestions[index] = {
                            ...newQuestions[index],
                            question: newValue,
                          };
                          handlePropertyChange('questions', newQuestions);
                        }}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                        placeholder={`Question ${index + 1}`}
                        maxLength={150}
                      />
                      <div className='text-xs text-gray-500 mt-1'>
                        {question.question.length}/150 characters
                        {question.question.length >= 120 && (
                          <span className='text-orange-600 ml-2'>
                            {150 - question.question.length} remaining
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Options */}
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Options (comma separated)
                      </label>
                      <input
                        type='text'
                        value={question.options.join(', ')}
                        onChange={e => {
                          const newValue = e.target.value.substring(0, 300);
                          // Split by comma and trim, but keep empty options for now
                          const options = newValue
                            .split(',')
                            .map(opt => opt.trim());
                          const currentQuestions = properties.questions || [];
                          const newQuestions = [...currentQuestions];
                          newQuestions[index] = {
                            ...newQuestions[index],
                            options: options,
                          };
                          handlePropertyChange('questions', newQuestions);
                        }}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                        placeholder='Blue, Red, Green, Purple'
                        maxLength={300}
                      />
                      <div className='text-xs text-gray-500 mt-1'>
                        {question.options.join(', ').length}/300 characters
                        {question.options.join(', ').length >= 240 && (
                          <span className='text-orange-600 ml-2'>
                            {300 - question.options.join(', ').length} remaining
                          </span>
                        )}
                        <div className='text-blue-600 mt-1'>
                          💡 Separate options with commas (e.g., "Blue, Red,
                          Green, Purple")
                        </div>
                        {question.options.some(
                          (opt: string) => opt.length === 0
                        ) && (
                          <div className='text-orange-600 mt-1'>
                            ⚠️ Empty options will be ignored
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Correct Answer */}
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Correct Answer
                      </label>
                      <select
                        value={question.correctAnswer}
                        onChange={e => {
                          const currentQuestions = properties.questions || [];
                          const newQuestions = [...currentQuestions];
                          newQuestions[index] = {
                            ...newQuestions[index],
                            correctAnswer: parseInt(e.target.value),
                          };
                          handlePropertyChange('questions', newQuestions);
                        }}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      >
                        {question.options.map(
                          (option: string, optionIndex: number) => (
                            <option key={optionIndex} value={optionIndex}>
                              {option || `Option ${optionIndex + 1}`}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Score Messages */}
            <div className='space-y-4'>
              <h4 className='text-sm font-medium text-gray-700'>
                Score Messages
              </h4>

              {/* Perfect Score Message */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Perfect Score Message (90-100%)
                </label>
                <input
                  type='text'
                  value={
                    properties.perfectScoreMessage ||
                    'Wow! You know me perfectly! We must be soulmates! 💕'
                  }
                  onChange={e => {
                    const newValue = e.target.value.substring(0, 200);
                    handlePropertyChange('perfectScoreMessage', newValue);
                  }}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  placeholder='Perfect score message'
                  maxLength={200}
                />
                <div className='text-xs text-gray-500 mt-1'>
                  {
                    (
                      properties.perfectScoreMessage ||
                      'Wow! You know me perfectly! We must be soulmates! 💕'
                    ).length
                  }
                  /200 characters
                  {(
                    properties.perfectScoreMessage ||
                    'Wow! You know me perfectly! We must be soulmates! 💕'
                  ).length >= 160 && (
                    <span className='text-orange-600 ml-2'>
                      {200 -
                        (
                          properties.perfectScoreMessage ||
                          'Wow! You know me perfectly! We must be soulmates! 💕'
                        ).length}{' '}
                      remaining
                    </span>
                  )}
                </div>
              </div>

              {/* Good Score Message */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Good Score Message (70-89%)
                </label>
                <input
                  type='text'
                  value={
                    properties.goodScoreMessage ||
                    'Great job! You know me pretty well! 😊'
                  }
                  onChange={e => {
                    const newValue = e.target.value.substring(0, 200);
                    handlePropertyChange('goodScoreMessage', newValue);
                  }}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  placeholder='Good score message'
                  maxLength={200}
                />
                <div className='text-xs text-gray-500 mt-1'>
                  {
                    (
                      properties.goodScoreMessage ||
                      'Great job! You know me pretty well! 😊'
                    ).length
                  }
                  /200 characters
                  {(
                    properties.goodScoreMessage ||
                    'Great job! You know me pretty well! 😊'
                  ).length >= 160 && (
                    <span className='text-orange-600 ml-2'>
                      {200 -
                        (
                          properties.goodScoreMessage ||
                          'Great job! You know me pretty well! 😊'
                        ).length}{' '}
                      remaining
                    </span>
                  )}
                </div>
              </div>

              {/* Average Score Message */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Average Score Message (50-69%)
                </label>
                <input
                  type='text'
                  value={
                    properties.averageScoreMessage ||
                    'Not bad! You know some things about me! 🤔'
                  }
                  onChange={e => {
                    const newValue = e.target.value.substring(0, 200);
                    handlePropertyChange('averageScoreMessage', newValue);
                  }}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  placeholder='Average score message'
                  maxLength={200}
                />
                <div className='text-xs text-gray-500 mt-1'>
                  {
                    (
                      properties.averageScoreMessage ||
                      'Not bad! You know some things about me! 🤔'
                    ).length
                  }
                  /200 characters
                  {(
                    properties.averageScoreMessage ||
                    'Not bad! You know some things about me! 🤔'
                  ).length >= 160 && (
                    <span className='text-orange-600 ml-2'>
                      {200 -
                        (
                          properties.averageScoreMessage ||
                          'Not bad! You know some things about me! 🤔'
                        ).length}{' '}
                      remaining
                    </span>
                  )}
                </div>
              </div>

              {/* Low Score Message */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Low Score Message (0-49%)
                </label>
                <input
                  type='text'
                  value={
                    properties.lowScoreMessage ||
                    'Hmm... We need to spend more time together! 😅'
                  }
                  onChange={e => {
                    const newValue = e.target.value.substring(0, 200);
                    handlePropertyChange('lowScoreMessage', newValue);
                  }}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  placeholder='Low score message'
                  maxLength={200}
                />
                <div className='text-xs text-gray-500 mt-1'>
                  {
                    (
                      properties.lowScoreMessage ||
                      'Hmm... We need to spend more time together! 😅'
                    ).length
                  }
                  /200 characters
                  {(
                    properties.lowScoreMessage ||
                    'Hmm... We need to spend more time together! 😅'
                  ).length >= 160 && (
                    <span className='text-orange-600 ml-2'>
                      {200 -
                        (
                          properties.lowScoreMessage ||
                          'Hmm... We need to spend more time together! 😅'
                        ).length}{' '}
                      remaining
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'love-letter':
        return (
          <div className='space-y-4'>
            {/* Letter Title */}
            <div className='relative pb-3'>
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Letter Title
                </label>
                <input
                  type='text'
                  value={properties.title || 'My Dearest'}
                  onChange={e => {
                    const newValue = e.target.value.substring(0, 100);
                    handlePropertyChange('title', newValue);
                  }}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  placeholder='My Dearest'
                  maxLength={100}
                />
                <div className='text-xs text-gray-500 mt-1'>
                  {(properties.title || 'My Dearest').length}/100 characters
                  {(properties.title || 'My Dearest').length >= 80 && (
                    <span className='text-orange-600 ml-2'>
                      {100 - (properties.title || 'My Dearest').length}{' '}
                      remaining
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Love Message */}
            <div className='relative pb-3'>
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Love Message
                </label>
                <textarea
                  value={
                    properties.message ||
                    'Every moment with you feels like a beautiful dream come true. Your love has filled my heart with endless joy and happiness. I promise to cherish and adore you forever.'
                  }
                  onChange={e => {
                    const newValue = e.target.value.substring(0, 500);
                    handlePropertyChange('message', newValue);
                  }}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none'
                  placeholder='Write your romantic message here...'
                  rows={6}
                  maxLength={500}
                />
                <div className='text-xs text-gray-500 mt-1'>
                  {
                    (
                      properties.message ||
                      'Every moment with you feels like a beautiful dream come true. Your love has filled my heart with endless joy and happiness. I promise to cherish and adore you forever.'
                    ).length
                  }
                  /500 characters
                  {(
                    properties.message ||
                    'Every moment with you feels like a beautiful dream come true. Your love has filled my heart with endless joy and happiness. I promise to cherish and adore you forever.'
                  ).length >= 400 && (
                    <span className='text-orange-600 ml-2'>
                      {500 -
                        (
                          properties.message ||
                          'Every moment with you feels like a beautiful dream come true. Your love has filled my heart with endless joy and happiness. I promise to cherish and adore you forever.'
                        ).length}{' '}
                      remaining
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Signature */}
            <div className='relative pb-3'>
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Signature
                </label>
                <input
                  type='text'
                  value={properties.signature || 'With all my love'}
                  onChange={e => {
                    const newValue = e.target.value.substring(0, 100);
                    handlePropertyChange('signature', newValue);
                  }}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  placeholder='With all my love'
                  maxLength={100}
                />
                <div className='text-xs text-gray-500 mt-1'>
                  {(properties.signature || 'With all my love').length}/100
                  characters
                  {(properties.signature || 'With all my love').length >=
                    80 && (
                    <span className='text-orange-600 ml-2'>
                      {100 -
                        (properties.signature || 'With all my love')
                          .length}{' '}
                      remaining
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Wax Seal Settings */}
            <div className='space-y-4'>
              <h4 className='text-sm font-medium text-gray-700'>Wax Seal</h4>

              {/* Initials */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Wax Seal Initials
                </label>
                <input
                  type='text'
                  value={properties.initials || 'JD'}
                  onChange={e => {
                    const newValue = e.target.value
                      .substring(0, 4)
                      .toUpperCase();
                    handlePropertyChange('initials', newValue);
                  }}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center font-bold tracking-wider'
                  placeholder='JD'
                  maxLength={4}
                />
                <div className='text-xs text-gray-500 mt-1'>
                  {(properties.initials || 'JD').length}/4 characters
                </div>
              </div>

              {/* Seal Color */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Wax Seal Color
                </label>
                <div className='flex items-center gap-3'>
                  <input
                    type='color'
                    value={properties.sealColor || '#8B0000'}
                    onChange={e =>
                      handlePropertyChange('sealColor', e.target.value)
                    }
                    className='w-12 h-10 rounded border border-gray-300 cursor-pointer'
                  />
                  <input
                    type='text'
                    value={properties.sealColor || '#8B0000'}
                    onChange={e =>
                      handlePropertyChange('sealColor', e.target.value)
                    }
                    className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm'
                    placeholder='#8B0000'
                  />
                </div>
              </div>
            </div>

            {/* Letter Appearance */}
            <div className='space-y-4'>
              <h4 className='text-sm font-medium text-gray-700'>
                Letter Appearance
              </h4>

              {/* Letter Color */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Letter Paper Color
                </label>
                <div className='flex items-center gap-3'>
                  <input
                    type='color'
                    value={properties.letterColor || '#F5F5DC'}
                    onChange={e =>
                      handlePropertyChange('letterColor', e.target.value)
                    }
                    className='w-12 h-10 rounded border border-gray-300 cursor-pointer'
                  />
                  <input
                    type='text'
                    value={properties.letterColor || '#F5F5DC'}
                    onChange={e =>
                      handlePropertyChange('letterColor', e.target.value)
                    }
                    className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm'
                    placeholder='#F5F5DC'
                  />
                </div>
              </div>

              {/* Ink Color */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Ink Color
                </label>
                <div className='flex items-center gap-3'>
                  <input
                    type='color'
                    value={properties.inkColor || '#2F2F2F'}
                    onChange={e =>
                      handlePropertyChange('inkColor', e.target.value)
                    }
                    className='w-12 h-10 rounded border border-gray-300 cursor-pointer'
                  />
                  <input
                    type='text'
                    value={properties.inkColor || '#2F2F2F'}
                    onChange={e =>
                      handlePropertyChange('inkColor', e.target.value)
                    }
                    className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm'
                    placeholder='#2F2F2F'
                  />
                </div>
              </div>

              {/* Font Style */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Handwriting Font
                </label>
                <select
                  value={properties.fontStyle || 'handwriting'}
                  onChange={e =>
                    handlePropertyChange('fontStyle', e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                >
                  <option value='handwriting'>Elegant Handwriting</option>
                  <option value='cursive'>Flowing Cursive</option>
                  <option value='calligraphy'>Calligraphy Style</option>
                  <option value='romantic'>Romantic Script</option>
                </select>
              </div>
            </div>
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

export function CanvasSettingsPanel({
  theme,
  onUpdateTheme,
  music,
  onUpdateMusic,
  showCanvasSettings = true,
  isUserPremium = false,
}: {
  theme: string;
  onUpdateTheme: (theme: string) => void;
  music?: string;
  onUpdateMusic?: (music: string) => void;
  showCanvasSettings?: boolean;
  isUserPremium?: boolean;
}) {
  const themes = [
    {
      value: 'white',
      name: 'Pure White',
      gradient: 'from-white to-gray-50',
      preview: 'bg-gradient-to-br from-white to-gray-50 border border-gray-200',
    },
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
    { value: '', label: 'No Music' },
    { value: 'birthday-song', label: 'Happy Birthday' },
    { value: 'romantic-piano', label: 'Romantic Piano' },
    { value: 'celebration', label: 'Celebration' },
    { value: 'peaceful', label: 'Peaceful Melody' },
    { value: 'upbeat', label: 'Upbeat Joy' },
  ];

  if (!showCanvasSettings) return null;

  return (
    <div className='bg-white rounded-lg shadow-sm border h-full flex flex-col'>
      <div className='p-4 border-b flex-shrink-0'>
        <h3 className='text-lg font-semibold text-gray-800 mb-3'>
          Canvas Settings
        </h3>
        <p className='text-sm text-gray-600'>
          Choose a background theme for your wish
        </p>
      </div>
      <div className='flex-1 p-4 overflow-y-auto'>
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
        {/* Background Music Section */}
        <div className='mb-4 md:mb-6'>
          <label className='block text-sm font-medium text-gray-700 mb-2 md:mb-3'>
            Background Music
          </label>
          <select
            value={music || ''}
            onChange={e => onUpdateMusic && onUpdateMusic(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded text-sm'
          >
            {musicLibrary.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
