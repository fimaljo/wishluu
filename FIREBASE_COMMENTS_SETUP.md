# Firebase Comments Setup for Comment Wall Element

This document explains how to set up Firebase integration for the Comment Wall element, which provides comment functionality with spam prevention.

## Overview

The Comment Wall element supports two modes:

- **Local Mode**: Comments are stored in memory only (during wish creation/editing)
- **Firebase Mode**: Comments are saved to Firebase (after wish is shared)

## Features

- ✅ Comment creation with optional names
- ✅ Anonymous commenting (when no name is provided)
- ✅ Spam prevention and detection
- ✅ Real-time comment updates
- ✅ Comment statistics
- ✅ Responsive Instagram-style UI
- ✅ Media support (photos, videos, YouTube)
- ✅ Conditional Firebase integration

## Firebase Setup

### 1. Firestore Database Structure

Create a `comments` collection in your Firestore database:

```javascript
// Collection: comments
{
  id: "auto-generated",
  wishId: "string",           // Reference to the wish
  name: "string",             // Commenter name
  message: "string",          // Comment content
  isAnonymous: "boolean",     // Whether comment is anonymous
  userAvatar: "string?",      // Optional avatar URL
  userId: "string?",          // Optional user ID if authenticated
  userEmail: "string?",       // Optional user email if authenticated
  ipAddress: "string?",       // For spam prevention
  userAgent: "string?",       // For spam prevention
  createdAt: "timestamp",     // When comment was created
  updatedAt: "timestamp",     // When comment was last updated
  spamScore: "number",        // Spam detection score (0-1)
  isSpam: "boolean"           // Whether comment is flagged as spam
}
```

### 2. Firestore Security Rules

Add these security rules to your `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Comments collection
    match /comments/{commentId} {
      // Allow read access to all comments
      allow read: if true;

      // Allow create if user is authenticated or anonymous
      allow create: if
        // Basic validation
        request.resource.data.keys().hasAll(['wishId', 'name', 'message', 'isAnonymous', 'createdAt', 'updatedAt']) &&
        request.resource.data.wishId is string &&
        request.resource.data.name is string &&
        request.resource.data.message is string &&
        request.resource.data.isAnonymous is bool &&
        request.resource.data.createdAt is timestamp &&
        request.resource.data.updatedAt is timestamp &&

        // Message length validation
        request.resource.data.message.size() >= 3 &&
        request.resource.data.message.size() <= 500 &&

        // Name length validation (if not anonymous)
        (request.resource.data.isAnonymous == true ||
         (request.resource.data.name.size() >= 1 && request.resource.data.name.size() <= 50)) &&

        // Timestamp validation
        request.resource.data.createdAt == request.time &&
        request.resource.data.updatedAt == request.time;

      // Allow delete only by comment author or wish owner
      allow delete: if
        request.auth != null && (
          resource.data.userId == request.auth.uid ||
          // Add wish owner check here if needed
          false
        );

      // Allow update only by comment author
      allow update: if
        request.auth != null &&
        resource.data.userId == request.auth.uid &&
        request.resource.data.updatedAt == request.time;
    }
  }
}
```

### 3. Firebase Configuration

Ensure your Firebase configuration is set up in `src/lib/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

## Usage

### 1. Basic Usage

```tsx
import { CommentWall } from '@/components/ui/CommentWall';

// Local mode (during creation/editing)
<CommentWall
  postType="photo"
  mediaUrl="https://example.com/image.jpg"
  postDescription="Beautiful sunset!"
/>

// Firebase mode (after sharing)
<CommentWall
  postType="photo"
  mediaUrl="https://example.com/image.jpg"
  postDescription="Beautiful sunset!"
  wishId="wish-123"
/>
```

### 2. Element Configuration

The Comment Wall element is configured in `src/config/elements.ts`:

```typescript
{
  id: 'comment-wall',
  name: 'Comment Wall',
  category: 'social',
  icon: '💬',
  description: 'Instagram-style post with comments',
  properties: [
    {
      id: 'postType',
      name: 'Post Type',
      type: 'select',
      options: [
        { value: 'photo', label: 'Photo' },
        { value: 'video', label: 'Video' }
      ],
      default: 'photo'
    },
    {
      id: 'mediaUrl',
      name: 'Media URL',
      type: 'text',
      placeholder: 'Enter photo or video URL',
      default: ''
    },
    {
      id: 'postDescription',
      name: 'Description',
      type: 'textarea',
      placeholder: 'Share your thoughts...',
      default: ''
    }
  ]
}
```

## Spam Prevention

The system includes several spam prevention measures:

### 1. Content Analysis

- **Message Length**: Must be 3-500 characters
- **Repeated Words**: Detects excessive word repetition
- **Capital Letters**: Flags excessive ALL CAPS text
- **Punctuation**: Detects excessive punctuation usage

### 2. User Behavior

- **Comment Frequency**: Tracks comments per user per wish
- **Anonymous Comments**: Monitors anonymous comment patterns

### 3. Spam Scoring

- Score ranges from 0.0 to 1.0
- Comments with score > 0.7 are blocked
- Comments with score > 0.5 are flagged as spam

## API Reference

### FirebaseCommentService

```typescript
class FirebaseCommentService {
  // Create a new comment
  async createComment(
    wishId: string,
    commentData: CommentData
  ): Promise<CreateCommentResult>;

  // Get comments for a wish
  async getComments(
    wishId: string,
    pageSize?: number
  ): Promise<{ comments: CommentDocument[]; lastDoc?: QueryDocumentSnapshot }>;

  // Delete a comment
  async deleteComment(commentId: string, userId?: string): Promise<boolean>;

  // Get comment statistics
  async getCommentStats(wishId: string): Promise<CommentsStats>;
}
```

### useFirebaseComments Hook

```typescript
function useFirebaseComments(wishId: string): {
  comments: CommentDocument[];
  isLoading: boolean;
  error: string | null;
  createComment: (
    commentData: CommentData
  ) => Promise<{ success: boolean; error?: string }>;
  deleteComment: (commentId: string) => Promise<boolean>;
  stats: { total: number; anonymous: number; named: number };
};
```

## Testing

Use the test page at `/test-comment-wall` to:

1. **Test Local Mode**: Leave Wish ID empty
2. **Test Firebase Mode**: Enter a Wish ID
3. **Test Media**: Use photo/video URLs
4. **Test Comments**: Add comments with/without names
5. **Test Spam Prevention**: Try various comment patterns

## Environment Variables

Add these to your `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Troubleshooting

### Common Issues

1. **Firebase Index Error**: The system uses simple queries that don't require complex indexes
2. **CSP Errors**: Ensure YouTube domains are allowed in your Content Security Policy
3. **Permission Denied**: Check Firestore security rules
4. **Comments Not Loading**: Verify Firebase configuration and network connectivity

### Debug Mode

Enable debug logging by checking the browser console for detailed error messages and spam scores.

## Performance Considerations

- Comments are paginated (20 per page by default)
- Spam detection is lightweight and fast
- Real-time updates are efficient
- Media loading includes error handling and fallbacks

## Security Notes

- User authentication is optional but recommended
- IP addresses are collected for spam prevention
- Comments are validated on both client and server
- Spam detection runs on every comment creation
