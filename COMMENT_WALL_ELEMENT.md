# Comment Wall Element

## Overview

The Comment Wall element is a powerful social interaction feature that allows visitors to leave comments, share photos, and upload videos on wish pages. It creates an engaging community experience where friends and family can share their thoughts and memories.

## Features

### Core Functionality

- **Comment System**: Users can leave text comments with customizable character limits
- **Media Upload**: Support for photos and videos with configurable file size limits
- **Anonymous Posting**: Option to post comments anonymously
- **User Avatars**: Automatic avatar generation for named users
- **Timestamps**: Display when comments were posted
- **Pagination**: Handle large numbers of comments efficiently

### Customization Options

- **Visual Styling**: Customizable colors, borders, and spacing
- **Content Control**: Enable/disable media uploads, anonymous posting, reactions
- **Form Fields**: Show/hide name and email fields
- **File Restrictions**: Configure allowed file formats and size limits
- **Display Settings**: Control comment count, media count, and sorting options

### Premium Features

- **Reactions**: Like/heart comments (Premium feature)
- **Advanced Sorting**: Sort by most liked (Premium feature)
- **Enhanced Animations**: 3D flip and rotate animations (Premium feature)

## Configuration Properties

### Basic Settings

- `title`: Wall title (e.g., "Leave a Message!")
- `subtitle`: Wall subtitle (e.g., "Share your thoughts, photos, or videos")
- `maxComments`: Maximum number of comments allowed
- `commentsPerPage`: Number of comments displayed per page

### Media Settings

- `allowMedia`: Enable/disable media uploads
- `allowPhotos`: Enable/disable photo uploads
- `allowVideos`: Enable/disable video uploads
- `maxPhotoSize`: Maximum photo file size in MB
- `maxVideoSize`: Maximum video file size in MB
- `allowedPhotoFormats`: Array of allowed photo formats
- `allowedVideoFormats`: Array of allowed video formats

### User Experience

- `allowAnonymous`: Enable/disable anonymous posting
- `showNameField`: Show/hide name input field
- `requireName`: Make name field required
- `allowEmojis`: Enable/disable emoji support
- `maxCommentLength`: Maximum comment character length

### Display Options

- `showTimestamps`: Show/hide comment timestamps
- `showUserAvatars`: Show/hide user avatars
- `showCommentCount`: Show/hide total comment count
- `showMediaCount`: Show/hide media count
- `sortBy`: Comment sorting (newest, oldest, mostLiked)

### Visual Styling

- `backgroundColor`: Wall background color
- `borderColor`: Border color
- `textColor`: Text color
- `accentColor`: Accent color for buttons and highlights
- `borderRadius`: Border radius in pixels
- `padding`: Internal padding in pixels
- `maxWidth`: Maximum width in pixels
- `animation`: Entry animation type

## Usage Examples

### Basic Comment Wall

```typescript
<CommentWall
  title="Leave a Message!"
  subtitle="Share your thoughts"
  allowAnonymous={true}
  allowMedia={true}
  maxComments={100}
  // ... other properties
/>
```

### Anonymous Only Wall

```typescript
<CommentWall
  title="Anonymous Messages"
  subtitle="Share your thoughts anonymously"
  allowAnonymous={true}
  allowMedia={false}
  showNameField={false}
  // ... other properties
/>
```

### Media Sharing Wall

```typescript
<CommentWall
  title="Share Your Memories"
  subtitle="Upload photos and videos"
  allowAnonymous={false}
  allowMedia={true}
  requireName={true}
  maxPhotoSize={10}
  maxVideoSize={100}
  // ... other properties
/>
```

## File Upload Support

### Supported Photo Formats

- JPG/JPEG
- PNG
- GIF
- WebP

### Supported Video Formats

- MP4
- WebM
- MOV

### File Size Limits

- Photos: 1-20 MB (configurable)
- Videos: 10-200 MB (configurable)

## Security Features

- File type validation
- File size restrictions
- XSS protection for comments
- Rate limiting (can be implemented)
- Content moderation (can be implemented)

## Integration

The Comment Wall element integrates seamlessly with the existing wish builder system:

1. **Element Palette**: Available in the "Social" category
2. **Property Panel**: Full customization through the properties panel
3. **Template System**: Can be included in templates
4. **Premium System**: Premium features are properly gated

## Future Enhancements

- Real-time comments with WebSocket
- Comment moderation tools
- Email notifications
- Social media sharing
- Comment threading/replies
- Advanced media gallery
- Comment analytics

## Technical Notes

- Uses client-side state management for immediate feedback
- File uploads are handled with URL.createObjectURL for demo
- In production, integrate with cloud storage (Firebase Storage, AWS S3, etc.)
- Comments are stored in component state; integrate with backend for persistence
- Responsive design works on all screen sizes
- Accessible with proper ARIA labels and keyboard navigation
