'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { audioManager } from '@/lib/audioManager';

interface MusicPlayerProps {
  musicId: string;
  isVisible?: boolean;
  onMusicEnd?: () => void;
}

const musicLibrary = [
  {
    id: 'birthday-song',
    name: 'Happy Birthday',
    url: '/audio/birthday-song.mp3',
    duration: '1:30',
    category: 'birthday',
  },
  {
    id: 'romantic-piano',
    name: 'Romantic Piano',
    url: '/audio/romantic-piano.mp3',
    duration: '1:30',
    category: 'romantic',
  },
  {
    id: 'celebration',
    name: 'Celebration',
    url: '/audio/celebration.mp3',
    duration: '1:30',
    category: 'celebration',
  },
  {
    id: 'peaceful',
    name: 'Peaceful Melody',
    url: '/audio/peaceful.mp3',
    duration: '1:30',
    category: 'ambient',
  },
  {
    id: 'upbeat',
    name: 'Upbeat Joy',
    url: '/audio/upbeat.mp3',
    duration: '1:30',
    category: 'celebration',
  },
];

export function MusicPlayer({
  musicId,
  isVisible = true,
  onMusicEnd,
}: MusicPlayerProps) {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const selectedMusic = musicLibrary.find(music => music.id === musicId);

  useEffect(() => {
    if (!selectedMusic || !audioRef.current) return;

    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setIsLoaded(true);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      // Music will loop automatically due to loop attribute
      console.log('Music looped');
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setIsLoaded(false);
      setIsPlaying(false);
      console.log(
        `Audio file not found: ${selectedMusic?.name}. Please add the actual MP3 file to /public/audio/${selectedMusic?.id}.mp3`
      );
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [selectedMusic, onMusicEnd]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (
        audioRef.current &&
        audioManager.isCurrentAudio(selectedMusic?.id || '')
      ) {
        audioManager.stopCurrentAudio();
      }
    };
  }, [selectedMusic?.id]);

  // Auto-play when music is loaded and ready
  useEffect(() => {
    if (isLoaded && selectedMusic && !isMuted && audioRef.current) {
      const playAudio = async () => {
        try {
          await audioManager.playAudio(audioRef.current!, selectedMusic.id);
        } catch (error) {
          console.error('Auto-play failed:', error);
          // Auto-play might fail due to browser policies, that's okay
        }
      };
      playAudio();
    }
  }, [isLoaded, selectedMusic, isMuted]);

  const toggleMute = useCallback(async () => {
    if (!audioRef.current || !selectedMusic || isToggling) {
      console.log('Toggle blocked - basic conditions not met');
      return;
    }

    // Only check transition state for unmuting (resuming) operations
    if (!isMuted && audioManager.isInTransition()) {
      console.log('Toggle blocked - audio in transition during unmute');
      return;
    }

    setIsToggling(true);

    try {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);

      if (newMutedState) {
        // Muting - pause playback
        console.log('Muting audio');
        audioManager.pauseCurrentAudio();
      } else {
        // Unmuting - resume playback
        console.log('Unmuting audio');
        try {
          await audioManager.resumeCurrentAudio();
        } catch (error) {
          console.error('Error resuming audio:', error);
          // If resume fails, keep the muted state
          setIsMuted(true);
        }
      }
    } catch (error) {
      console.error('Error toggling mute:', error);
    } finally {
      // Shorter delay to make button more responsive
      setTimeout(() => {
        setIsToggling(false);
      }, 200);
    }
  }, [isMuted, selectedMusic, isToggling]);

  if (!selectedMusic || !isVisible) return null;

  // Show a warning if the audio file is not available
  const isAudioAvailable = isLoaded;

  return (
    <div className='fixed bottom-28 right-4 z-[9999] sm:bottom-4 sm:right-4'>
      <audio
        ref={audioRef}
        src={selectedMusic.url}
        preload='metadata'
        loop={true}
        onError={e => console.error('Audio loading error:', e)}
      />

      <button
        onClick={toggleMute}
        disabled={!isAudioAvailable || isToggling}
        className={`w-14 h-14 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors shadow-lg border border-white/20 backdrop-blur-sm touch-manipulation ${
          !isAudioAvailable || isToggling
            ? 'bg-gray-300 cursor-not-allowed'
            : isMuted
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
        title={
          !isAudioAvailable
            ? `Audio file not found. Please add ${selectedMusic.id}.mp3 to /public/audio/`
            : isMuted
              ? 'Unmute'
              : 'Mute'
        }
      >
        {isMuted ? (
          <svg
            className='w-5 h-5 sm:w-4 sm:h-4'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.794L4.5 13.5H2a1 1 0 01-1-1v-5a1 1 0 011-1h2.5l3.883-3.794a1 1 0 011.617.794zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        ) : (
          <svg
            className='w-5 h-5 sm:w-4 sm:h-4'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.794L4.5 13.5H2a1 1 0 01-1-1v-5a1 1 0 011-1h2.5l3.883-3.794a1 1 0 011.617.794z'
              clipRule='evenodd'
            />
          </svg>
        )}
      </button>
    </div>
  );
}
