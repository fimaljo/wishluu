# Firebase Authentication Setup

This guide will help you set up Firebase Google Sign-In for the WishLuu application.

## 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google provider
   - Add your authorized domains

## 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Admin Emails (comma-separated)
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com,another-admin@example.com
```

## 3. Getting Firebase Config

1. In Firebase Console, go to Project Settings
2. Scroll down to "Your apps" section
3. Click on the web app (</>) icon
4. Copy the configuration object
5. Extract the values to your `.env.local` file

## 4. Admin Access

To grant admin access to users:

1. Add their email addresses to the `NEXT_PUBLIC_ADMIN_EMAILS` environment variable
2. Separate multiple emails with commas
3. Restart the development server after changing environment variables

## 5. Features

### For Regular Users:

- Google Sign-In
- Access to templates and wish creation
- User profile management

### For Admins:

- All regular user features
- Template management (create, edit, delete)
- Admin-only navigation
- Template statistics and debugging tools

## 6. Security Rules

Make sure to set up proper Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Allow admins to manage templates
    match /templates/{templateId} {
      allow read: if true; // Anyone can read templates
      allow write: if request.auth != null &&
        request.auth.token.email in ['admin@example.com']; // Only admins can write
    }
  }
}
```

## 7. Testing

1. Start the development server: `npm run dev`
2. Try signing in with Google
3. Test admin access by adding your email to `NEXT_PUBLIC_ADMIN_EMAILS`
4. Verify that admin users can access the template management section

## 8. Troubleshooting

### Common Issues:

1. **"Firebase not installed" error**: Run `npm install firebase`
2. **Authentication not working**: Check your Firebase configuration and domain settings
3. **Admin access not working**: Verify your email is in `NEXT_PUBLIC_ADMIN_EMAILS`
4. **Environment variables not loading**: Restart the development server

### Debug Mode:

The application includes debug features for admins:

- Template statistics
- Duplicate ID fixing
- Template export/import
- Force clear all templates

## 9. Production Deployment

For production deployment:

1. Set up proper Firebase security rules
2. Configure authorized domains in Firebase Console
3. Use production Firebase project
4. Set up proper environment variables in your hosting platform
5. Consider using Firebase App Check for additional security
