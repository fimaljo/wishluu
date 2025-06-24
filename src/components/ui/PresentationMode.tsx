'use client';

import React, { useState, useEffect } from 'react';
import { InteractiveBalloons } from './InteractiveBalloons';
import { BeautifulText } from './BeautifulText';
import { Wish } from '@/types';

interface PresentationModeProps {
  wish: Wish;
  onClose: () => void;
  isOpen: boolean;
}

export function PresentationMode({ wish, onClose, isOpen }: PresentationModeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [stepElements, setStepElements] = useState<any[]>([]);

  // Parse step sequence from wish elements
  useEffect(() => {
    if (wish.elements && wish.elements.length > 0) {
      // Group elements by step if step sequence exists
      // For now, we'll show all elements in a single presentation
      setStepElements(wish.elements);
    }
  }, [wish]);

  useEffect(() => {
    if (isOpen) {
      // Start auto-play after 2 seconds
      const timer = setTimeout(() => {
        if (autoPlay) {
          setIsPlaying(true);
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoPlay]);

  useEffect(() => {
    if (isPlaying && stepElements.length > 1) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < stepElements.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 3000); // 3 seconds per step

      return () => clearInterval(interval);
    }
  }, [isPlaying, stepElements.length]);

  const handleNext = () => {
    if (currentStep < stepElements.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleAutoPlayToggle = () => {
    setAutoPlay(!autoPlay);
    if (!autoPlay) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  // Hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (!showControls) return;

    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showControls]);

  const handleMouseMove = () => {
    setShowControls(true);
  };

  if (!isOpen) return null;

  const themes = {
    purple: 'from-purple-400 to-pink-400',
    ocean: 'from-blue-400 to-cyan-400',
    sunset: 'from-orange-400 to-pink-400',
    forest: 'from-green-400 to-emerald-400',
    royal: 'from-yellow-400 to-orange-400',
  };

  const themeGradient = themes[wish.theme as keyof typeof themes] || themes.purple;

  const renderElement = (element: any) => {
    const { properties } = element;
    
    switch (element.elementType) {
      case 'balloons-interactive':
        return (
          <div className="absolute inset-0 w-full h-full">
            <InteractiveBalloons
              numberOfBalloons={properties.numberOfBalloons || 5}
              balloonColors={properties.balloonColors || ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']}
              imageUrl={properties.imageUrl || null}
              balloonSize={properties.balloonSize || 60}
              startAnimation={true}
              resetAnimation={false}
              onBalloonPop={(balloonId) => {
                console.log(`Balloon ${balloonId} popped!`);
              }}
              balloonImages={Array.from({ length: properties.numberOfBalloons || 5 }, (_, index) => 
                properties[`balloonImage${index}`] || null
              )}
            />
          </div>
        );

      case 'beautiful-text':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <BeautifulText
              title={properties.title || wish.recipientName}
              message={properties.message || wish.message}
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
    <div 
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onClick={() => setShowControls(!showControls)}
    >
      {/* Background */}
      {wish.customBackgroundColor ? (
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: wish.customBackgroundColor }}
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${themeGradient}`} />
      )}

      {/* Content */}
      <div className="relative w-full h-full flex items-center justify-center">
        {stepElements.length > 0 ? (
          <div className="relative w-full h-full">
            {renderElement(stepElements[currentStep])}
          </div>
        ) : (
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-4">{wish.recipientName}</h1>
            <p className="text-xl max-w-2xl mx-auto leading-relaxed">{wish.message}</p>
          </div>
        )}
      </div>

      {/* Controls */}
      {showControls && (
        <>
          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <span className="text-white font-medium">
                {wish.recipientName}'s Wish
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAutoPlayToggle}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  autoPlay 
                    ? 'bg-white text-black' 
                    : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70'
                }`}
              >
                {autoPlay ? 'Auto' : 'Manual'}
              </button>
              <button
                onClick={handleFullscreen}
                className="bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="bg-black bg-opacity-50 text-white p-3 rounded-lg hover:bg-opacity-70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handlePlayPause}
                className="bg-white text-black p-4 rounded-full hover:bg-gray-100 transition-all"
              >
                {isPlaying ? (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>

              <button
                onClick={handleNext}
                disabled={currentStep === stepElements.length - 1}
                className="bg-black bg-opacity-50 text-white p-3 rounded-lg hover:bg-opacity-70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            {stepElements.length > 1 && (
              <div className="mt-4 flex items-center justify-center">
                <div className="bg-black bg-opacity-30 rounded-full h-2 w-64">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / stepElements.length) * 100}%` }}
                  />
                </div>
                <span className="ml-3 text-white text-sm">
                  {currentStep + 1} / {stepElements.length}
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Step Indicator */}
      {stepElements.length > 1 && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <div className="flex flex-col space-y-2">
            {stepElements.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStep 
                    ? 'bg-white' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 