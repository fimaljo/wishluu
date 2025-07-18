'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './Button';

interface DateQuestionProps {
  question: string;
  yesText?: string;
  noText?: string;
  onClick?: () => void;
}

export function DateQuestion({
  question,
  yesText = 'Yes',
  noText = 'No',
  onClick,
}: DateQuestionProps) {
  const [noClicks, setNoClicks] = useState(0);
  const [yesClicked, setYesClicked] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [confetti, setConfetti] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      color: string;
      rotation: number;
      speed: number;
    }>
  >([]);
  const [floatingParticles, setFloatingParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
    }>
  >([]);

  // Responsive button sizing
  const maxNoClicks = 5;
  const yesSize = Math.min(100 + noClicks * 20, 200);
  const noSize = Math.max(100 - noClicks * 20, 0);
  const noOpacity = Math.max(1 - noClicks * 0.2, 0);

  // Text validation - limit lengths
  const validatedQuestion =
    question.length > 100 ? question.substring(0, 100) + '...' : question;
  const validatedYesText =
    (yesText || 'Yes').length > 20
      ? (yesText || 'Yes').substring(0, 20)
      : yesText || 'Yes';
  const validatedNoText =
    (noText || 'No').length > 20
      ? (noText || 'No').substring(0, 20)
      : noText || 'No';

  // Create floating particles for background effect
  useEffect(() => {
    const particles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.3 + 0.1,
      speed: Math.random() * 0.5 + 0.2,
    }));
    setFloatingParticles(particles);
  }, []);

  // Animate floating particles
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingParticles(prev =>
        prev
          .map(particle => ({
            ...particle,
            y: particle.y - particle.speed,
            opacity:
              particle.opacity +
              Math.sin(Date.now() * 0.001 + particle.id) * 0.1,
          }))
          .map(particle =>
            particle.y < -10 ? { ...particle, y: 110 } : particle
          )
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleYesClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setYesClicked(true);
    setShowCelebration(true);
    createConfetti();
    onClick?.();
  };

  const handleNoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (noClicks < maxNoClicks) {
      setNoClicks(prev => prev + 1);
    }
  };

  const createConfetti = () => {
    const colors = [
      '#FF6B9D',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FFEAA7',
      '#FFD93D',
      '#FF6B6B',
      '#4ECDC4',
    ];
    const newConfetti = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)] || '#FF6B9D',
      rotation: Math.random() * 360,
      speed: 2 + Math.random() * 4,
    }));
    setConfetti(newConfetti);
  };

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowCelebration(false);
        setConfetti([]);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  useEffect(() => {
    if (confetti.length > 0) {
      const interval = setInterval(() => {
        setConfetti(prev =>
          prev
            .map(particle => ({
              ...particle,
              y: particle.y + particle.speed,
              rotation: particle.rotation + 8,
            }))
            .filter(particle => particle.y < 110)
        );
      }, 50);
      return () => clearInterval(interval);
    }
  }, [confetti]);

  // Beautiful container with glassmorphism and gradients
  const containerClass = [
    'relative',
    'bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50',
    'backdrop-blur-xl',
    'border border-white/40',
    'rounded-3xl',
    'shadow-2xl',
    'shadow-blue-500/10',
    'flex',
    'flex-col',
    'justify-center',
    'items-center',
    'overflow-hidden',
    'p-6',
    'sm:p-8',
    'md:p-10',
    'w-full',
    'max-w-sm',
    'sm:max-w-md',
    'md:max-w-lg',
    'lg:max-w-xl',
    'min-h-[360px]',
    'sm:min-h-[380px]',
    'md:min-h-[400px]',
    'mx-auto',
    'transform',
    'transition-all',
    'duration-500',
    'hover:scale-[1.02]',
    'hover:shadow-blue-500/20',
  ].join(' ');

  if (yesClicked) {
    return (
      <div className={containerClass} onClick={e => e.stopPropagation()}>
        {/* Enhanced Confetti Overlay */}
        {showCelebration && (
          <div className='absolute inset-0 pointer-events-none overflow-hidden'>
            {confetti.map(particle => (
              <div
                key={particle.id}
                className='absolute rounded-full animate-pulse'
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${Math.random() * 8 + 4}px`,
                  height: `${Math.random() * 8 + 4}px`,
                  backgroundColor: particle.color,
                  transform: `rotate(${particle.rotation}deg)`,
                  transition: 'all 0.1s linear',
                  boxShadow: `0 0 10px ${particle.color}80`,
                }}
              />
            ))}
          </div>
        )}

        {/* Celebration Content */}
        <div className='relative z-10 flex flex-col items-center justify-center h-full min-h-[200px] text-center'>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 animate-pulse'>
            Yay! 🎊
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass} onClick={e => e.stopPropagation()}>
      {/* Floating Background Particles */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        {floatingParticles.map(particle => (
          <div
            key={particle.id}
            className='absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20'
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animation: `float ${3 + particle.speed * 2}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      <div className='flex-1 flex flex-col justify-between w-full h-full relative z-10'>
        {/* Question Section with enhanced styling */}
        <div className='flex-1 flex flex-col justify-center items-center space-y-6 min-h-0 w-full'>
          <div className='text-center space-y-4'>
            <h2
              className='font-bold leading-tight text-xl sm:text-2xl md:text-3xl text-gray-800 break-words w-full bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'
              style={{ letterSpacing: '-0.02em' }}
            >
              {validatedQuestion}
            </h2>

            {/* Dynamic message with enhanced styling */}
            <div className='h-8 flex items-center justify-center w-full'>
              {noClicks > 0 && (
                <div className='px-4 py-2 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full border border-orange-200/50 shadow-sm'>
                  <p
                    className='text-sm sm:text-base font-medium text-orange-800'
                    style={{ fontWeight: '600' }}
                  >
                    {noClicks === 1 && 'Are you sure? 🤔'}
                    {noClicks === 2 && 'Really sure? 😅'}
                    {noClicks === 3 && 'Think again! 😊'}
                    {noClicks === 4 && 'Last chance! 😉'}
                    {noClicks >= 5 && "You're so stubborn! 😂"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Buttons Section */}
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full h-28 mt-4'>
          {/* Yes Button with enhanced styling */}
          <button
            onClick={handleYesClick}
            className='group font-bold transition-all duration-500 ease-out hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-500/30 w-full sm:w-auto text-white relative overflow-hidden'
            style={{
              background: `linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)`,
              padding: `${Math.max(yesSize * 0.2, 16)}px ${Math.max(yesSize * 0.6, 40)}px`,
              borderRadius: '16px',
              fontSize: `${Math.max(yesSize / 12, 18)}px`,
              minWidth: `${Math.max(yesSize, 100)}px`,
              minHeight: `${Math.max(yesSize * 0.5, 48)}px`,
              boxShadow:
                '0 10px 30px rgba(16, 185, 129, 0.4), 0 4px 15px rgba(0, 0, 0, 0.1)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '700',
              letterSpacing: '0.02em',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
              width: '100%',
              maxWidth: '280px',
            }}
          >
            <span className='relative z-10'>{validatedYesText}</span>
            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out' />
          </button>

          {/* No Button with enhanced styling */}
          {noClicks < maxNoClicks && (
            <button
              onClick={handleNoClick}
              className='group font-bold transition-all duration-500 ease-out hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-500/30 w-full sm:w-auto text-white relative overflow-hidden'
              style={{
                background: `linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)`,
                padding: `${Math.max(noSize * 0.2, 16)}px ${Math.max(noSize * 0.6, 40)}px`,
                borderRadius: '16px',
                fontSize: `${Math.max(noSize / 12, 18)}px`,
                minWidth: `${Math.max(noSize, 100)}px`,
                minHeight: `${Math.max(noSize * 0.5, 48)}px`,
                opacity: noOpacity,
                boxShadow:
                  '0 10px 30px rgba(239, 68, 68, 0.4), 0 4px 15px rgba(0, 0, 0, 0.1)',
                border: 'none',
                cursor: 'pointer',
                transform: `scale(${noOpacity})`,
                fontWeight: '700',
                letterSpacing: '0.02em',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                width: '100%',
                maxWidth: '280px',
              }}
            >
              <span className='relative z-10'>{validatedNoText}</span>
              <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out' />
            </button>
          )}
        </div>
      </div>

      {/* Add CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>
    </div>
  );
}
