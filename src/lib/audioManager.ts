// Global audio manager to prevent multiple audio instances from playing
class AudioManager {
  private static instance: AudioManager;
  private currentAudio: HTMLAudioElement | null = null;
  private currentMusicId: string | null = null;
  private isPlaying: boolean = false;
  private isTransitioning: boolean = false;

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  async playAudio(
    audioElement: HTMLAudioElement,
    musicId: string
  ): Promise<void> {
    if (this.isTransitioning) {
      console.log('Audio transition in progress, skipping play request');
      return;
    }

    try {
      this.isTransitioning = true;

      // If this is the same audio that's already playing, don't restart it
      if (this.currentAudio === audioElement && this.isPlaying) {
        console.log('Audio already playing, skipping');
        return;
      }

      // Stop any currently playing audio
      this.stopCurrentAudio();

      // Set the new audio as current
      this.currentAudio = audioElement;
      this.currentMusicId = musicId;

      // Play the new audio
      await audioElement.play();
      this.isPlaying = true;
      console.log('Audio started playing:', musicId);
    } catch (error) {
      console.error('Error playing audio:', error);
      this.isPlaying = false;
      throw error;
    } finally {
      this.isTransitioning = false;
    }
  }

  stopCurrentAudio(): void {
    if (this.currentAudio && this.isTransitioning) {
      console.log('Audio transition in progress, skipping stop request');
      return;
    }

    if (this.currentAudio) {
      try {
        this.isTransitioning = true;
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        console.log('Audio stopped');
      } catch (error) {
        console.error('Error stopping audio:', error);
      } finally {
        this.currentAudio = null;
        this.currentMusicId = null;
        this.isPlaying = false;
        this.isTransitioning = false;
      }
    }
  }

  pauseCurrentAudio(): void {
    if (this.isTransitioning) {
      console.log('Audio transition in progress, skipping pause request');
      return;
    }

    if (this.currentAudio && this.isPlaying) {
      try {
        this.isTransitioning = true;
        this.currentAudio.pause();
        this.isPlaying = false;
        console.log('Audio paused');
      } catch (error) {
        console.error('Error pausing audio:', error);
      } finally {
        this.isTransitioning = false;
      }
    }
  }

  async resumeCurrentAudio(): Promise<void> {
    if (this.isTransitioning) {
      console.log('Audio transition in progress, skipping resume request');
      return;
    }

    if (this.currentAudio && !this.isPlaying) {
      try {
        this.isTransitioning = true;
        await this.currentAudio.play();
        this.isPlaying = true;
        console.log('Audio resumed');
      } catch (error) {
        console.error('Error resuming audio:', error);
        throw error;
      } finally {
        this.isTransitioning = false;
      }
    }
  }

  isCurrentAudio(musicId: string): boolean {
    return this.currentMusicId === musicId;
  }

  getCurrentAudio(): HTMLAudioElement | null {
    return this.currentAudio;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  isInTransition(): boolean {
    return this.isTransitioning;
  }
}

export const audioManager = AudioManager.getInstance();
