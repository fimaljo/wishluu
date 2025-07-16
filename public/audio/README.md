# Background Music Audio Files

This directory contains audio files for the background music functionality in WishLuu.

## Required Audio Files

To enable background music, you need to add the following MP3 files to this directory:

**IMPORTANT: All audio files must be exactly 1:30 (90 seconds) duration for consistent looping!**

1. `birthday-song.mp3` - Happy birthday music (1:30)
2. `romantic-piano.mp3` - Romantic piano music (1:30)
3. `celebration.mp3` - Celebration music (1:30)
4. `peaceful.mp3` - Peaceful ambient music (1:30)
5. `upbeat.mp3` - Upbeat joyful music (1:30)

## How to Add Audio Files

1. **Download or create MP3 files** with the exact names listed above
2. **Place them in this directory** (`public/audio/`)
3. **Ensure they are MP3 format** and have reasonable file sizes (under 5MB each)
4. **Test the functionality** by going to the wish builder and selecting background music

## Audio File Recommendations

- **Duration**: Exactly 1:30 (90 seconds) for all tracks
- **Quality**: 128-320 kbps MP3
- **Volume**: Normalized to avoid sudden volume changes
- **Content**: Royalty-free or properly licensed music
- **Looping**: Music will automatically loop for continuous playback

## Testing

Once you add the audio files:

1. Go to the wish builder (`/wishes/create/custom-blank`)
2. Navigate to the "Create" step
3. Open the Properties panel (right side)
4. Select a background music option
5. Go to Preview mode to test the music player
6. Music will auto-play when loaded
7. Use the mute/unmute button to control audio

## Troubleshooting

- If music doesn't play, check the browser console for errors
- Ensure audio files are properly named and in MP3 format
- Some browsers require user interaction before playing audio
- Check that the audio files are accessible via the web server

## Current Status

Currently, placeholder files are present. Replace them with actual MP3 files to enable the background music functionality.
