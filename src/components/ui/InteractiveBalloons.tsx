'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Balloon {
  id: number;
  color: string;
  x: number;
  y: number;
  targetY: number;
  isPopped: boolean;
  isAnimating: boolean;
  delay: number;
  imageUrl?: string | null; // Individual image for each balloon
}

interface InteractiveBalloonsProps {
  numberOfBalloons?: number;
  balloonColors?: string[];
  imageUrl?: string | null; // Fallback image if individual images not set
  balloonImages?: (string | null)[]; // Array of individual balloon images
  balloonSize?: number;
  startAnimation?: boolean;
  resetAnimation?: boolean;
  onBalloonPop?: (balloonId: number) => void;
  onAllBalloonsPopped?: () => void; // Callback when all balloons are popped
  className?: string;
  showHint?: boolean; // New prop to control hint visibility
}

export function InteractiveBalloons({
  numberOfBalloons = 5,
  balloonColors = ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
  imageUrl = null,
  balloonImages = [],
  balloonSize = 60,
  startAnimation = false,
  resetAnimation = false,
  onBalloonPop,
  onAllBalloonsPopped,
  className = '',
  showHint = true, // Default to showing hint
}: InteractiveBalloonsProps) {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [poppedImages, setPoppedImages] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showInteractionHint, setShowInteractionHint] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ensure numberOfBalloons is within valid range
  const validNumberOfBalloons = Math.max(1, Math.min(20, numberOfBalloons));

  // Helper function to adjust color brightness
  const adjustBrightness = (color: string, percent: number): string => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      '#' +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  // Initialize balloons
  useEffect(() => {
    // Only initialize if balloons array is empty or if numberOfBalloons changed
    if (balloons.length === 0 || balloons.length !== validNumberOfBalloons) {
      // Create a grid-based distribution to prevent overlapping
      const gridCols = Math.ceil(Math.sqrt(validNumberOfBalloons));
      const gridRows = Math.ceil(validNumberOfBalloons / gridCols);
      const cellWidth = 80 / gridCols; // 80% of canvas width divided by columns
      const cellHeight = 60 / gridRows; // 60% of canvas height divided by rows

      const newBalloons: Balloon[] = Array.from(
        { length: validNumberOfBalloons },
        (_, index) => {
          const row = Math.floor(index / gridCols);
          const col = index % gridCols;

          // Add some randomness within each grid cell to avoid perfect grid alignment
          const randomX = (Math.random() - 0.5) * (cellWidth * 0.6); // 60% of cell width for randomness
          const randomY = (Math.random() - 0.5) * (cellHeight * 0.6); // 60% of cell height for randomness

          const x = 10 + col * cellWidth + cellWidth / 2 + randomX; // Start at 10%, center in cell, add randomness
          const targetY = 10 + row * cellHeight + cellHeight / 2 + randomY; // Start at 10%, center in cell, add randomness

          return {
            id: index,
            color: balloonColors[index % balloonColors.length] || '#FF6B9D',
            x: Math.max(5, Math.min(95, x)), // Keep within 5% to 95% bounds
            y: 100, // Always start from bottom
            targetY: Math.max(10, Math.min(70, targetY)), // Keep within 10% to 70% bounds
            isPopped: false,
            isAnimating: false,
            delay: index * 300, // Stagger animation with longer delay
            imageUrl: balloonImages[index] || null, // Only use individual balloon image
          };
        }
      );
      setBalloons(newBalloons);
    }
  }, [validNumberOfBalloons, balloonColors, balloonImages]);

  // Update balloon images when balloonImages prop changes (without resetting positions)
  useEffect(() => {
    if (balloons.length > 0 && balloonImages.length > 0) {
      setBalloons(prev =>
        prev.map((balloon, index) => ({
          ...balloon,
          imageUrl: balloonImages[index] || null,
        }))
      );
    }
  }, [balloonImages]);

  // Handle animation state
  useEffect(() => {
    if (startAnimation && balloons.length > 0) {
      // Reset all balloons to bottom and start animation
      setBalloons(prev =>
        prev.map(b => ({
          ...b,
          y: 100, // Reset to bottom
          isPopped: false,
          isAnimating: false,
        }))
      );

      // Start animation after a short delay to ensure balloons are positioned
      const timer = setTimeout(() => {
        setIsAnimating(true);

        // Show interaction hint after balloons start floating
        if (showHint && !hintDismissed) {
          setTimeout(() => {
            setShowInteractionHint(true);
          }, 2000); // Show hint 2 seconds after animation starts
        }
      }, 100);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [startAnimation, balloons.length, showHint, hintDismissed]);

  // Handle reset animation
  useEffect(() => {
    if (resetAnimation) {
      setBalloons(prev =>
        prev.map(b => ({
          ...b,
          y: 100, // Reset to bottom
          isPopped: false,
          isAnimating: false,
        }))
      );
      setIsAnimating(false);
      setShowInteractionHint(false);
      setHintDismissed(false);
    }
  }, [resetAnimation]);

  const handleBalloonClick = (balloonId: number) => {
    // Hide hint when user interacts with balloons
    if (showInteractionHint) {
      setShowInteractionHint(false);
      setHintDismissed(true);
    }

    setBalloons(prev =>
      prev.map(b => (b.id === balloonId ? { ...b, isPopped: true } : b))
    );

    // Check if all balloons are popped
    const updatedBalloons = balloons.map(b =>
      b.id === balloonId ? { ...b, isPopped: true } : b
    );

    const allPopped = updatedBalloons.every(b => b.isPopped);
    if (allPopped && onAllBalloonsPopped) {
      // Add a small delay before triggering next step
      setTimeout(() => {
        onAllBalloonsPopped();
      }, 1000);
    }
  };

  const renderBalloon = (balloon: Balloon) => {
    if (balloon.isPopped) {
      // Show popped balloon or image
      if (balloon.imageUrl) {
        return (
          <div
            key={balloon.id}
            className='absolute'
            style={{
              left: `${balloon.x}%`,
              top: `${balloon.targetY}%`, // Use target position where balloon was floating
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
          >
            <img
              src={balloon.imageUrl}
              alt='Popped balloon surprise'
              className='w-24 h-24 object-cover rounded-lg shadow-lg border-2 border-white'
            />
          </div>
        );
      } else {
        // Just show popped balloon effect (no image)
        return (
          <div
            key={balloon.id}
            className='absolute'
            style={{
              left: `${balloon.x}%`,
              top: `${balloon.targetY}%`, // Use target position where balloon was floating
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
          >
            <div
              className='w-8 h-8 rounded-full opacity-50'
              style={{
                background: `radial-gradient(circle, ${balloon.color}40 0%, transparent 70%)`,
              }}
            />
          </div>
        );
      }
    }

    return (
      <div
        key={balloon.id}
        className='absolute cursor-pointer transition-all duration-300 hover:scale-110'
        style={{
          left: `${balloon.x}%`,
          top: isAnimating ? `${balloon.targetY}%` : `${balloon.y}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 5,
          transition:
            isAnimating && !balloon.isPopped
              ? `top 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${balloon.delay}ms`
              : 'none',
          pointerEvents: balloon.isPopped ? 'none' : 'auto', // Disable clicks when popped
        }}
        onClick={() => handleBalloonClick(balloon.id)}
      >
        {/* Balloon */}
        <div
          className='relative'
          style={{
            width: `${balloonSize}px`,
            height: `${balloonSize * 1.3}px`,
          }}
        >
          {/* Balloon body */}
          <div
            className='rounded-full shadow-lg border-2 border-white/20'
            style={{
              width: `${balloonSize}px`,
              height: `${balloonSize}px`,
              backgroundColor: balloon.color,
              backgroundImage: `radial-gradient(circle at 30% 30%, ${balloon.color}dd, ${balloon.color})`,
            }}
          />

          {/* Balloon string */}
          <div
            className='absolute bottom-0 left-1/2 transform -translate-x-1/2'
            style={{
              width: 2,
              height: balloonSize * 0.3,
              backgroundColor: '#666',
              borderRadius: '1px',
            }}
          />

          {/* Balloon highlight */}
          <div
            className='absolute top-2 left-2 w-3 h-3 rounded-full opacity-60'
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}
    >
      {/* Render balloons */}
      {balloons.map(renderBalloon)}

      {/* Render popped images */}
      {poppedImages.map(poppedImage => (
        <div
          key={`popped-${poppedImage.id}`}
          className='absolute animate-bounce'
          style={{
            left: `${poppedImage.x}%`,
            top: `${poppedImage.y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 15,
          }}
        >
          {imageUrl && (
            <img
              src={imageUrl}
              alt='Popped balloon surprise'
              className='w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full shadow-lg'
            />
          )}
        </div>
      ))}

      {/* Simple Bottom Hint */}
      {showInteractionHint && showHint && !hintDismissed && (
        <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none'>
          <div className='bg-black/60 text-white px-4 py-2 rounded-lg text-sm font-medium animate-pulse'>
            👆 Pop the balloons!
          </div>
        </div>
      )}
    </div>
  );
}
