'use client';

import React, { useState } from 'react';

interface LoveLetterProps {
  title: string;
  message: string;
  signature: string;
  initials: string;
  letterColor: string;
  inkColor: string;
  fontStyle: string;
  onClick?: () => void;
}

export function LoveLetter({
  title,
  message,
  signature,
  initials,
  letterColor = '#F5F5DC',
  inkColor = '#2F2F2F',
  fontStyle = 'handwriting',
  onClick,
}: LoveLetterProps) {
  const [isUnfolded, setIsUnfolded] = useState(false);
  const [isSealBroken, setIsSealBroken] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  // Font style mapping
  const fontMap = {
    handwriting: 'font-handwriting',
    cursive: 'font-cursive',
    calligraphy: 'font-calligraphy',
    romantic: 'font-romantic',
  };

  const selectedFont =
    fontMap[fontStyle as keyof typeof fontMap] || 'font-handwriting';

  const handleLetterClick = () => {
    if (!isUnfolded) {
      setIsUnfolded(true);
      setTimeout(() => {
        setIsSealBroken(true);
        setTimeout(() => {
          setShowContent(true);
          setTimeout(() => {
            setContentVisible(true);
          }, 100);
          onClick?.();
        }, 300);
      }, 500);
    }
  };

  const getFontClass = () => {
    switch (fontStyle) {
      case 'handwriting':
        return 'font-serif italic';
      case 'cursive':
        return 'font-serif italic tracking-wide';
      case 'calligraphy':
        return 'font-serif italic tracking-wider';
      case 'romantic':
        return 'font-serif italic tracking-wide';
      default:
        return 'font-serif italic';
    }
  };

  // Generate lined paper effect
  const generateLines = () => {
    const lines = [];
    const lineHeight = 24; // Height of each line - matches text line-height
    const totalLines = 12; // Reduced number of lines to prevent overflow
    const lineStartY = 40; // Start right after the title
    const lineWidth = 'calc(100% - 2rem)'; // Account for padding

    for (let i = 0; i < totalLines; i++) {
      lines.push(
        <div
          key={i}
          className='absolute border-b border-gray-300/40'
          style={{
            top: `${lineStartY + i * lineHeight}px`,
            left: '1rem',
            right: '1rem',
            height: '1px',
          }}
        />
      );
    }
    return lines;
  };

  return (
    <div className='relative w-full h-full flex items-center justify-center'>
      {/* Love Letter Container */}
      <div className='relative cursor-pointer' onClick={handleLetterClick}>
        {/* Letter Paper */}
        <div
          className={`relative w-80 h-96 rounded-lg shadow-2xl transition-all duration-500 ${
            isUnfolded ? 'scale-105' : 'scale-100'
          }`}
          style={{
            backgroundColor: letterColor,
          }}
        >
          {/* Paper Texture */}
          <div className='absolute inset-0 opacity-10'>
            <div
              className='w-full h-full'
              style={{
                backgroundImage:
                  'radial-gradient(circle, #000 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
          </div>

          {/* Wax Seal */}
          <div
            className={`absolute top-4 right-4 w-12 h-12 rounded-full transition-all duration-300 ${
              isSealBroken ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
            }`}
            style={{
              backgroundColor: '#8B0000',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            <div className='absolute inset-0 flex items-center justify-center'>
              <span className='text-white font-bold text-sm tracking-wider'>
                {initials}
              </span>
            </div>
            {/* Seal shine effect */}
            <div
              className='absolute top-1 left-1 w-3 h-3 rounded-full opacity-60'
              style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
            />
          </div>

          {/* Letter Content */}
          {showContent && (
            <div
              className={`absolute top-6 left-6 right-6 bottom-6 transition-all duration-500 ease-out ${
                contentVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                color: inkColor,
              }}
            >
              {/* Lined Paper Lines */}
              {generateLines()}

              <div className={`relative space-y-6 ${getFontClass()}`}>
                {/* Title */}
                {title && (
                  <h2
                    className='text-2xl font-bold mb-2 text-center'
                    style={{ color: inkColor }}
                  >
                    {title}
                  </h2>
                )}

                {/* Message with line spacing */}
                {message && (
                  <div
                    className='text-sm leading-6 text-left'
                    style={{
                      marginTop: '35px',
                      marginLeft: '1rem',
                      marginRight: '1rem',
                    }}
                  >
                    {message.split('\n').map((paragraph, index) => (
                      <p key={index} className='indent-4 mb-6'>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}

                {/* Signature */}
                {signature && (
                  <div className='text-right mt-8'>
                    <div
                      className='text-2xl font-bold italic tracking-widest transform -rotate-3'
                      style={{
                        color: inkColor,
                        fontFamily: 'Brush Script MT, cursive, serif',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {signature}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Click Prompt */}
        {!isUnfolded && (
          <div className='absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center'>
            <div className='bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-gray-700 shadow-lg animate-pulse'>
              Click to open 💌
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
