'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
  showCustomPicker?: boolean;
}

export function ColorPicker({
  value,
  onChange,
  label = 'Color',
  className = '',
  showCustomPicker = true,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value);
  const pickerRef = useRef<HTMLDivElement>(null);

  const predefinedColors = [
    // Warm Colors
    '#FF6B6B',
    '#FF8E8E',
    '#FFB3B3',
    '#FFD8D8',
    '#FF9F43',
    '#FFB366',
    '#FFC789',
    '#FFDBAC',
    '#FECA57',
    '#FFD580',
    '#FFE0A3',
    '#FFEBC6',
    '#FF9FF3',
    '#FFB3F7',
    '#FFC7FB',
    '#FFDBFF',

    // Cool Colors
    '#48DB71',
    '#6BE08A',
    '#8EE5A3',
    '#B1EABC',
    '#54A0FF',
    '#77B3FF',
    '#9AC6FF',
    '#BDD9FF',
    '#5F27CD',
    '#8254D4',
    '#A581DB',
    '#C8AEE2',
    '#00D2D3',
    '#33DBDC',
    '#66E4E5',
    '#99EDEE',

    // Neutral Colors
    '#C8D6E5',
    '#D1DCE8',
    '#DAE2EB',
    '#E3E8EE',
    '#8395A7',
    '#96A5B5',
    '#A9B5C3',
    '#BCC5D1',
    '#576574',
    '#6A7482',
    '#7D8390',
    '#90929E',
    '#2F3542',
    '#424A5A',
    '#555F72',
    '#68748A',

    // Gradients (represented as solid colors)
    '#FF6B9D',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleColorSelect = (color: string) => {
    onChange(color);
    setCustomColor(color);
    setIsOpen(false);
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    onChange(color);
  };

  return (
    <div className={`relative ${className}`}>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        {label}
      </label>

      <div className='flex items-center space-x-2'>
        {/* Current Color Display */}
        <div
          className='w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors'
          style={{ backgroundColor: value }}
          onClick={() => setIsOpen(!isOpen)}
        />

        {/* Color Value Display */}
        <div className='flex-1'>
          <input
            type='text'
            value={value}
            onChange={e => handleCustomColorChange(e.target.value)}
            className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
            placeholder='#FFFFFF'
          />
        </div>
      </div>

      {/* Color Picker Dropdown */}
      {isOpen && (
        <div
          ref={pickerRef}
          className='absolute z-50 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg w-80'
        >
          {/* Predefined Colors Grid */}
          <div className='mb-4'>
            <h4 className='text-sm font-medium text-gray-700 mb-3'>
              Quick Colors
            </h4>
            <div className='grid grid-cols-8 gap-2'>
              {predefinedColors.map((color, index) => (
                <button
                  key={index}
                  className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                    value === color
                      ? 'border-gray-800 scale-110'
                      : 'border-gray-300 hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Custom Color Picker */}
          {showCustomPicker && (
            <div className='border-t pt-4'>
              <h4 className='text-sm font-medium text-gray-700 mb-3'>
                Custom Color
              </h4>
              <div className='flex items-center space-x-3'>
                <input
                  type='color'
                  value={customColor}
                  onChange={e => handleCustomColorChange(e.target.value)}
                  className='w-12 h-12 border border-gray-300 rounded-lg cursor-pointer'
                />
                <input
                  type='text'
                  value={customColor}
                  onChange={e => handleCustomColorChange(e.target.value)}
                  className='flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  placeholder='#FFFFFF'
                />
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className='mt-4 pt-3 border-t'>
            <button
              onClick={() => setIsOpen(false)}
              className='w-full px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
