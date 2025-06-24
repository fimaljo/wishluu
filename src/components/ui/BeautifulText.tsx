'use client';

import React, { useEffect } from 'react';

interface BeautifulTextProps {
  title: string;
  message: string;
  titleFont: string;
  messageFont: string;
  titleColor: string;
  messageColor: string;
  titleSize: number;
  messageSize: number;
  alignment: 'left' | 'center' | 'right';
  animation: string;
  shadow: boolean;
  gradient: boolean;
  padding: number;
  onClick?: () => void;
}

// Font families mapping
const fontFamilies = {
  // Standard fonts
  playfair: 'var(--font-playfair)',
  inter: 'var(--font-inter)',
  poppins: 'var(--font-poppins)',
  montserrat: 'var(--font-montserrat)',
  roboto: 'var(--font-roboto)',
  opensans: 'var(--font-opensans)',
  lato: 'var(--font-lato)',
  raleway: 'var(--font-raleway)',
  dancing: 'var(--font-dancing)',
  pacifico: 'var(--font-pacifico)',
  'great-vibes': 'var(--font-great-vibes)',
  satisfy: 'var(--font-satisfy)',
  kaushan: 'var(--font-kaushan)',
  allura: 'var(--font-allura)',
  
  // Premium bubble fonts (using web-safe alternatives)
  fredoka: '"Fredoka One", cursive',
  bangers: '"Bangers", cursive',
  righteous: '"Righteous", cursive',
  bubblegum: '"Bubblegum Sans", cursive',
  comic: '"Comic Neue", cursive',
  indie: '"Indie Flower", cursive',
  architects: '"Architects Daughter", cursive',
  marker: '"Permanent Marker", cursive',
  caveat: '"Caveat", cursive'
};

// Animation classes
const animationClasses = {
  'fade-in': 'animate-fade-in',
  'slide-up': 'animate-slide-up',
  'slide-down': 'animate-slide-down',
  'zoom-in': 'animate-zoom-in',
  'bounce': 'animate-bounce',
  'pulse': 'animate-pulse',
  'none': ''
};

export function BeautifulText({
  title,
  message,
  titleFont,
  messageFont,
  titleColor,
  messageColor,
  titleSize,
  messageSize,
  alignment,
  animation,
  shadow,
  gradient,
  padding,
  onClick
}: BeautifulTextProps) {
  
  // Add gradient animation styles
  const gradientStyles = gradient ? `
    <style>
      @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        25% { background-position: 100% 50%; }
        50% { background-position: 100% 100%; }
        75% { background-position: 0% 100%; }
        100% { background-position: 0% 50%; }
      }
    </style>
  ` : '';
  
  const getAlignmentClass = () => {
    switch (alignment) {
      case 'left': return 'text-left';
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-center';
    }
  };

  const getShadowClass = () => {
    return shadow ? 'drop-shadow-lg' : '';
  };

  const getGradientStyle = (color: string) => {
    if (!gradient) return { color };
    
    // Create beautiful multi-color gradients with different patterns
    const createGradient = (baseColor: string) => {
      // Enhanced color variations for more vibrant gradients
      const lighter1 = adjustColor(baseColor, 60);
      const lighter2 = adjustColor(baseColor, 30);
      const darker1 = adjustColor(baseColor, -20);
      const darker2 = adjustColor(baseColor, -40);
      
      // Create multiple gradient patterns for variety
      const gradients = [
        `linear-gradient(135deg, ${baseColor}, ${lighter1}, ${darker1}, ${lighter2})`,
        `linear-gradient(45deg, ${baseColor}, ${darker1}, ${lighter1}, ${baseColor})`,
        `linear-gradient(90deg, ${baseColor}, ${lighter2}, ${darker2}, ${lighter1})`,
        `linear-gradient(180deg, ${baseColor}, ${lighter1}, ${darker1}, ${baseColor})`
      ];
      
      // Use different gradients for title and message
      const gradientIndex = Math.abs(baseColor.length) % gradients.length;
      return gradients[gradientIndex];
    };
    
    const gradientStyle = createGradient(color);
    
    return {
      backgroundImage: gradientStyle,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      backgroundSize: '300% 300%',
      animation: 'gradient-shift 4s ease-in-out infinite'
    };
  };

  const adjustColor = (color: string, amount: number) => {
    // Improved color adjustment for better gradients
    const hex = color.replace('#', '');
    if (hex.length !== 6) return color;
    
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const getSpecialEffects = (fontType: string) => {
    const effects = {
      fredoka: {
        textShadow: '2px 2px 4px rgba(0,0,0,0.1), -1px -1px 2px rgba(255,255,255,0.8)',
        letterSpacing: '0.5px'
      },
      bangers: {
        textShadow: '3px 3px 0px rgba(0,0,0,0.2), -1px -1px 2px rgba(255,255,255,0.9)',
        letterSpacing: '1px'
      },
      righteous: {
        textShadow: '2px 2px 4px rgba(0,0,0,0.15)',
        letterSpacing: '0.3px'
      },
      bubblegum: {
        textShadow: '1px 1px 2px rgba(0,0,0,0.1), -1px -1px 1px rgba(255,255,255,0.7)',
        letterSpacing: '0.2px'
      },
      comic: {
        textShadow: '2px 2px 0px rgba(0,0,0,0.1)',
        letterSpacing: '0.1px'
      },
      indie: {
        textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
        letterSpacing: '0px'
      },
      architects: {
        textShadow: '1px 1px 1px rgba(0,0,0,0.1)',
        letterSpacing: '0.1px'
      },
      marker: {
        textShadow: '2px 2px 3px rgba(0,0,0,0.2)',
        letterSpacing: '0.3px'
      },
      caveat: {
        textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
        letterSpacing: '0px'
      },
      satisfy: {
        textShadow: '1px 1px 3px rgba(0,0,0,0.1)',
        letterSpacing: '0.2px'
      },
      default: {
        textShadow: 'none',
        letterSpacing: 'normal'
      }
    };
    
    return effects[fontType as keyof typeof effects] || effects.default;
  };

  useEffect(() => {
    if (gradient) {
      const styleElement = document.createElement('style');
      styleElement.innerHTML = `
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
          100% { background-position: 0% 50%; }
        }
      `;
      document.head.appendChild(styleElement);

      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, [gradient]);

  return (
    <div
      className={`${getAlignmentClass()} ${animationClasses[animation as keyof typeof animationClasses]} ${getShadowClass()} cursor-pointer transition-all duration-300 hover:scale-105`}
      style={{
        padding: `${padding}px`,
        fontFamily: fontFamilies[titleFont as keyof typeof fontFamilies] || fontFamilies.playfair
      }}
      onClick={onClick}
    >
      {/* Title */}
      <h1
        className="font-bold leading-tight mb-4"
        style={{
          fontSize: `${titleSize}px`,
          fontFamily: fontFamilies[titleFont as keyof typeof fontFamilies] || fontFamilies.playfair,
          ...getGradientStyle(titleColor),
          ...getSpecialEffects(titleFont)
        }}
      >
        {title}
      </h1>

      {/* Message */}
      <p
        className="leading-relaxed"
        style={{
          fontSize: `${messageSize}px`,
          fontFamily: fontFamilies[messageFont as keyof typeof fontFamilies] || fontFamilies.inter,
          ...getGradientStyle(messageColor),
          ...getSpecialEffects(messageFont)
        }}
      >
        {message}
      </p>
    </div>
  );
} 