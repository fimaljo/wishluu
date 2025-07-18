in pr# Background Music Functionality

This document explains the background music functionality implemented in WishLuu.

## Overview

The background music feature allows users to add ambient music to their wishes, enhancing the emotional impact and creating a more immersive experience.

## Features

### Music Selection

- **5 Pre-defined Music Tracks**: Birthday, Romantic Piano, Celebration, Peaceful, and Upbeat
- **Standardized Duration**: All tracks are exactly 1:30 (90 seconds) for consistent looping
- **Easy Selection**: Dropdown menu in both template and regular modes
- **No Music Option**: Users can choose to have no background music

### Music Player

- **Floating Player**: Appears in the bottom-right corner during preview
- **Auto-Play**: Music starts automatically when loaded
- **Mute/Unmute Controls**: Simple mute/unmute button
- **Loop Toggle**: Enable/disable continuous looping (enabled by default)
- **Simplified UI**: Clean, minimal interface focused on essential controls

### Integration Points

- **Wish Builder**: Music selection in canvas settings
- **Preview Mode**: Music player appears during wish preview
- **Presentation Mode**: Music continues during full-screen presentation
- **Template Mode**: Music selection available in template creation

## Technical Implementation

### Components

1. **MusicPlayer** (`src/components/ui/MusicPlayer.tsx`)
   - Handles audio playback
   - Provides user controls
   - Shows error states for missing files

2. **CanvasSettingsPanel** (`src/features/wish-builder/components/ElementPropertiesPanel.tsx`)
   - Music selection dropdown
   - Integrated with theme selection

3. **WishCanvas** (`src/features/wish-builder/components/WishCanvas.tsx`)
   - Displays music player in preview mode
   - Passes music ID to player

4. **PresentationMode** (`src/components/ui/PresentationMode.tsx`)
   - Shows music player during full-screen presentation

### State Management

- **Music State**: Stored in `CustomWishBuilder` component
- **Persistence**: Music selection saved with wish data
- **Type Safety**: Music property added to `Wish` interface

### Audio Files

- **Location**: `/public/audio/`
- **Format**: MP3 files
- **Naming**: Must match exactly with music library IDs

## Music Library

| ID               | Name            | Duration | Category    | Description                       |
| ---------------- | --------------- | -------- | ----------- | --------------------------------- |
| `birthday-song`  | Happy Birthday  | 1:30     | Birthday    | Upbeat birthday celebration music |
| `romantic-piano` | Romantic Piano  | 1:30     | Romantic    | Soft, romantic piano melodies     |
| `celebration`    | Celebration     | 1:30     | Celebration | Joyful celebration music          |
| `peaceful`       | Peaceful Melody | 1:30     | Ambient     | Calm, peaceful background music   |
| `upbeat`         | Upbeat Joy      | 1:30     | Celebration | Energetic, happy music            |

## File Structure

```
public/
└── audio/
    ├── README.md              # Instructions for adding audio files
    ├── birthday-song.txt      # Placeholder (replace with .mp3)
    ├── romantic-piano.txt     # Placeholder (replace with .mp3)
    ├── celebration.txt        # Placeholder (replace with .mp3)
    ├── peaceful.txt           # Placeholder (replace with .mp3)
    └── upbeat.txt             # Placeholder (replace with .mp3)
```

## Usage Instructions

### For Users

1. **Create a Wish**: Go to `/wishes/create/custom-blank`
2. **Select Music**: In the Properties panel, choose background music
3. **Preview**: Go to Preview mode to hear the music
4. **Save**: Music selection is saved with the wish

### For Developers

1. **Add Audio Files**: Place MP3 files in `/public/audio/`
2. **Test Functionality**: Use the wish builder to test music playback
3. **Customize**: Modify `musicLibrary` in `MusicPlayer.tsx` to add more tracks

## Error Handling

### Missing Audio Files

- **Visual Indicator**: Shows "(File not found)" next to track name
- **Disabled Controls**: Play button and progress bar are disabled
- **Console Warning**: Logs helpful error messages
- **User Alert**: Shows alert with instructions when trying to play

### Browser Compatibility

- **Autoplay Restrictions**: Some browsers require user interaction before auto-play
- **Format Support**: MP3 format is widely supported
- **Mobile Support**: Works on mobile devices with touch controls
- **Graceful Fallback**: Auto-play failures are handled gracefully

## Future Enhancements

### Planned Features

- **Custom Upload**: Allow users to upload their own music
- **Fade Effects**: Smooth fade in/out transitions
- **Multiple Tracks**: Support for multiple music tracks per wish
- **Music Timing**: Sync music with wish presentation timing
- **Volume Presets**: Quick volume level presets (low, medium, high)

### Technical Improvements

- **Audio Preloading**: Preload audio files for better performance
- **Streaming**: Support for streaming audio from external sources
- **Compression**: Optimize audio file sizes (standardized 1:30 duration helps)
- **Caching**: Cache audio files for faster loading
- **Loop Optimization**: Efficient looping with minimal memory usage

## Troubleshooting

### Common Issues

1. **Music Not Playing**
   - Check if audio files exist in `/public/audio/`
   - Verify file names match exactly
   - Check browser console for errors
   - Ensure user has interacted with page (autoplay restrictions)

2. **Music Player Not Visible**
   - Only appears in preview mode
   - Check if music is selected
   - Verify component is properly imported

3. **Audio Quality Issues**
   - Use high-quality MP3 files (128-320 kbps)
   - Normalize audio volume
   - Keep file sizes reasonable (< 5MB)
   - Ensure all files are exactly 1:30 duration for proper looping

### Debug Steps

1. Open browser developer tools
2. Check Console tab for error messages
3. Verify audio files are accessible via direct URL
4. Test with different browsers
5. Check network tab for failed audio requests

## Cost-Saving Benefits

### Hosting Optimization

- **Standardized Duration**: All tracks are exactly 1:30, reducing storage requirements
- **Efficient Looping**: Continuous playback without multiple file requests
- **Smaller File Sizes**: 90-second tracks are much smaller than longer versions
- **Reduced Bandwidth**: Less data transfer due to looping instead of longer files

### User Experience Benefits

- **Seamless Looping**: No gaps or interruptions in music playback
- **Consistent Experience**: All music tracks have the same duration
- **Better Performance**: Faster loading times with smaller files
- **Mobile Friendly**: Reduced data usage on mobile devices

## Contributing

When adding new music tracks:

1. **Duration Requirement**: All files must be exactly 1:30 (90 seconds)
2. Add the audio file to `/public/audio/`
3. Update the `musicLibrary` array in `MusicPlayer.tsx`
4. Test the functionality thoroughly
5. Update this documentation
6. Ensure proper licensing for audio content
