'use client';

import React, { useState, useEffect, useRef } from 'react';

interface PuzzlePiece {
  id: number;
  currentPosition: number;
  correctPosition: number;
  x: number;
  y: number;
}

interface ImagePuzzleProps {
  imageUrl: string;
  gridSize: string;
  difficulty: string;
  secretMessage?: string;
  onClick?: () => void;
}

export function ImagePuzzle({
  imageUrl,
  gridSize = '3',
  difficulty = 'medium',
  secretMessage = '',
  onClick,
}: ImagePuzzleProps) {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
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
  const [showOriginal, setShowOriginal] = useState(false);
  const [showSecretMessage, setShowSecretMessage] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const gridSizeNum = parseInt(gridSize);
  const totalPieces = gridSizeNum * gridSizeNum;
  const pieceSize = 300 / gridSizeNum; // Base size, will be responsive

  // Initialize puzzle pieces
  useEffect(() => {
    if (imageUrl && isImageLoaded) {
      const newPieces: PuzzlePiece[] = [];
      for (let i = 0; i < totalPieces; i++) {
        newPieces.push({
          id: i,
          currentPosition: i,
          correctPosition: i,
          x: (i % gridSizeNum) * pieceSize,
          y: Math.floor(i / gridSizeNum) * pieceSize,
        });
      }
      setPieces(newPieces);
      setIsShuffled(false);
      setIsSolved(false);
      setMoves(0);
      setStartTime(null);
      setElapsedTime(0);
      setShowOriginal(true);

      // Show original image for 1 second, then auto-shuffle
      setTimeout(() => {
        setShowOriginal(false);
        shufflePieces();
      }, 1000);
    }
  }, [imageUrl, gridSizeNum, totalPieces, pieceSize, isImageLoaded]);

  // Shuffle pieces
  const shufflePieces = () => {
    setPieces(prevPieces => {
      const shuffled = [...prevPieces];
      let shuffleCount = 0;
      const maxShuffles =
        difficulty === 'easy' ? 50 : difficulty === 'medium' ? 100 : 200;

      while (shuffleCount < maxShuffles) {
        const randomIndex1 = Math.floor(Math.random() * shuffled.length);
        const randomIndex2 = Math.floor(Math.random() * shuffled.length);

        if (
          randomIndex1 !== randomIndex2 &&
          shuffled[randomIndex1] &&
          shuffled[randomIndex2]
        ) {
          const temp = shuffled[randomIndex1].currentPosition;
          shuffled[randomIndex1].currentPosition =
            shuffled[randomIndex2].currentPosition;
          shuffled[randomIndex2].currentPosition = temp;
          shuffleCount++;
        }
      }

      // Update positions
      shuffled.forEach(piece => {
        piece.x = (piece.currentPosition % gridSizeNum) * pieceSize;
        piece.y = Math.floor(piece.currentPosition / gridSizeNum) * pieceSize;
      });

      return shuffled;
    });
    setIsShuffled(true);
    setStartTime(Date.now());
  };

  // Check if puzzle is solved
  useEffect(() => {
    if (isShuffled && pieces.length > 0) {
      const isComplete = pieces.every(
        piece => piece.currentPosition === piece.correctPosition
      );
      if (isComplete && !isSolved) {
        setIsSolved(true);
        createConfetti();
        onClick?.();

        // Show secret message after a short delay if one is provided
        if (secretMessage) {
          setTimeout(() => {
            setShowSecretMessage(true);
          }, 2000); // Show after 2 seconds of celebration
        }
      }
    }
  }, [pieces, isShuffled, isSolved, onClick]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && !isSolved) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [startTime, isSolved]);

  // Create confetti celebration
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
    const newConfetti = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)] || '#FF6B9D',
      rotation: Math.random() * 360,
      speed: 2 + Math.random() * 4,
    }));
    setConfetti(newConfetti);
  };

  // Animate confetti
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

  // Handle piece drag start
  const handleDragStart = (e: React.DragEvent, pieceId: number) => {
    setDraggedPiece(pieceId);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle piece drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle piece drop
  const handleDrop = (e: React.DragEvent, targetPosition: number) => {
    e.preventDefault();
    if (draggedPiece !== null) {
      setPieces(prevPieces => {
        const newPieces = [...prevPieces];
        const draggedPieceObj = newPieces.find(p => p.id === draggedPiece);
        const targetPieceObj = newPieces.find(
          p => p.currentPosition === targetPosition
        );

        if (draggedPieceObj && targetPieceObj) {
          // Swap positions
          const tempPosition = draggedPieceObj.currentPosition;
          draggedPieceObj.currentPosition = targetPieceObj.currentPosition;
          targetPieceObj.currentPosition = tempPosition;

          // Update coordinates
          draggedPieceObj.x =
            (draggedPieceObj.currentPosition % gridSizeNum) * pieceSize;
          draggedPieceObj.y =
            Math.floor(draggedPieceObj.currentPosition / gridSizeNum) *
            pieceSize;
          targetPieceObj.x =
            (targetPieceObj.currentPosition % gridSizeNum) * pieceSize;
          targetPieceObj.y =
            Math.floor(targetPieceObj.currentPosition / gridSizeNum) *
            pieceSize;

          setMoves(prev => prev + 1);
        }

        return newPieces;
      });
    }
    setDraggedPiece(null);
  };

  // Handle image load
  const handleImageLoad = () => {
    setIsImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsImageLoaded(false);
    setImageError(true);
  };

  // Format time
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Container classes
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
    'min-h-[400px]',
    'sm:min-h-[450px]',
    'md:min-h-[500px]',
    'mx-auto',
    'transform',
    'transition-all',
    'duration-500',
    'hover:scale-[1.02]',
    'hover:shadow-blue-500/20',
  ].join(' ');

  if (!imageUrl) {
    return (
      <div className={containerClass} onClick={e => e.stopPropagation()}>
        <div className='flex flex-col items-center justify-center h-full text-center space-y-4'>
          <div className='text-6xl mb-4'>🧩</div>
          <h3 className='text-xl font-bold text-gray-800'>Image Puzzle</h3>
          <p className='text-gray-600'>Add an image URL to start the puzzle!</p>
        </div>
      </div>
    );
  }

  if (imageError) {
    return (
      <div className={containerClass} onClick={e => e.stopPropagation()}>
        <div className='flex flex-col items-center justify-center h-full text-center space-y-4'>
          <div className='text-6xl mb-4'>❌</div>
          <h3 className='text-xl font-bold text-gray-800'>Image Error</h3>
          <p className='text-gray-600'>
            Could not load the image. Please check the URL.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass} onClick={e => e.stopPropagation()}>
      {/* Hidden image for reference */}
      <img
        src={imageUrl}
        alt='Puzzle reference'
        className='hidden'
        onLoad={handleImageLoad}
        onError={handleImageError}
      />

      {/* Confetti Overlay - shown when puzzle is solved */}
      {isSolved && confetti.length > 0 && (
        <div className='absolute inset-0 pointer-events-none overflow-hidden z-20'>
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

      {/* Original Image Overlay - shown for 1 second */}
      {showOriginal && (
        <div className='absolute inset-0 bg-white rounded-3xl flex items-center justify-center z-10'>
          <div className='text-center space-y-4'>
            <div className='text-4xl mb-4'>👀</div>
            <h3 className='text-xl font-bold text-gray-800'>
              Remember this image!
            </h3>
            <div className='text-sm text-gray-600 mb-4'>
              Puzzle will start in 1 second...
            </div>
            <div
              className='bg-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden'
              style={{
                width: `${pieceSize * gridSizeNum}px`,
                height: `${pieceSize * gridSizeNum}px`,
                maxWidth: '100%',
                maxHeight: '300px',
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>
        </div>
      )}

      {/* Secret Message Overlay - shown after puzzle is solved */}
      {showSecretMessage && secretMessage && (
        <div className='absolute inset-0 bg-black/80 backdrop-blur-sm rounded-3xl flex items-center justify-center z-30'>
          <div className='bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl'>
            <div className='text-4xl mb-4'>💌</div>
            <h3 className='text-xl font-bold text-gray-800 mb-4'>
              Secret Message
            </h3>
            <div className='text-gray-700 mb-6 leading-relaxed'>
              {secretMessage}
            </div>
            <button
              onClick={() => setShowSecretMessage(false)}
              className='px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg'
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className='flex flex-col items-center justify-center w-full h-full space-y-6'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <h3 className='text-xl font-bold text-gray-800'>Image Puzzle</h3>
          {isShuffled && (
            <div className='flex gap-4 text-sm text-gray-600'>
              <span>Moves: {moves}</span>
              <span>Time: {formatTime(elapsedTime)}</span>
            </div>
          )}
          {isSolved && (
            <div className='text-lg font-bold text-green-600 animate-pulse'>
              🎉 Puzzle Solved! 🎉
            </div>
          )}
        </div>

        {/* Puzzle Container */}
        <div
          ref={containerRef}
          className='relative bg-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden'
          style={{
            width: `${pieceSize * gridSizeNum}px`,
            height: `${pieceSize * gridSizeNum}px`,
            maxWidth: '100%',
            maxHeight: '300px',
          }}
        >
          {pieces.map(piece => (
            <div
              key={piece.id}
              draggable={isShuffled && !isSolved}
              onDragStart={e => handleDragStart(e, piece.id)}
              onDragOver={handleDragOver}
              onDrop={e => handleDrop(e, piece.currentPosition)}
              className='absolute cursor-move transition-all duration-300 ease-out hover:scale-105'
              style={{
                width: `${pieceSize}px`,
                height: `${pieceSize}px`,
                left: `${piece.x}px`,
                top: `${piece.y}px`,
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: `${pieceSize * gridSizeNum}px ${pieceSize * gridSizeNum}px`,
                backgroundPosition: `-${(piece.correctPosition % gridSizeNum) * pieceSize}px -${Math.floor(piece.correctPosition / gridSizeNum) * pieceSize}px`,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            />
          ))}
        </div>

        {/* Instructions */}
        {!isShuffled && !showOriginal && (
          <div className='text-center text-sm text-gray-600 max-w-xs'>
            <p>
              Image will be shown for 1 second, then automatically shuffled!
            </p>
          </div>
        )}

        {isShuffled && !isSolved && (
          <div className='text-center text-sm text-gray-600 max-w-xs'>
            <p>Drag and drop pieces to solve the puzzle!</p>
          </div>
        )}
      </div>
    </div>
  );
}
