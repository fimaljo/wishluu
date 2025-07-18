# Environment Variables Setup Guide

## 🚀 Quick Setup for Development

Since you're using `.env.local` for development, here's what you need to set up:

### Required Variables (Must Have)

Add these to your `.env.local` file:

```env
# Firebase Configuration (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Admin Access (Recommended for development)
NEXT_PUBLIC_ADMIN_EMAILS=your_email@gmail.com

# Premium System (Optional - defaults to enabled)
NEXT_PUBLIC_PREMIUM_ENABLED=true

# Firebase Admin SDK (Production Only - for JWT verification)
# FIREBASE_PROJECT_ID=your_project_id
# FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
# FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
```

### Optional Variables (Nice to Have)

```env
# Premium Limits (Optional - has defaults)
NEXT_PUBLIC_FREE_WISH_LIMIT=2
NEXT_PUBLIC_PRO_WISH_LIMIT=20
NEXT_PUBLIC_PREMIUM_WISH_LIMIT=-1

# App Configuration (Optional - has defaults)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 🔧 How to Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon (⚙️) next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. Click the web app icon (</>)
7. Copy the configuration object
8. Extract the values to your `.env.local` file

Example Firebase config:

```javascript
const firebaseConfig = {
  apiKey: 'AIzaSyC...',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef123456',
};
```

## 🧪 Testing Your Setup

1. **Start your development server:**

   ```bash
   npm run dev
   ```

2. **Sign in to your app**

3. **Test the credit system:**
   - Go to `/test-credits` (or click the link in dashboard if you're admin)
   - Add some test credits
   - Try creating a wish to test credit deduction

4. **Check admin access:**
   - If you added your email to `NEXT_PUBLIC_ADMIN_EMAILS`, you should see admin features
   - You'll see a debug section in the dashboard

## 🚨 Common Issues

### "Firebase not configured" error

- Make sure all Firebase variables are set in `.env.local`
- Restart your development server after changing `.env.local`

### "No admin access"

- Add your email to `NEXT_PUBLIC_ADMIN_EMAILS` in `.env.local`
- Restart the development server
- Sign out and sign back in

### "Premium system disabled"

- Set `NEXT_PUBLIC_PREMIUM_ENABLED=true` in `.env.local`
- Restart the development server

### "Cannot read Firebase collections"

- Make sure your Firebase project has Firestore Database enabled
- Check that your Firebase security rules allow read/write access

## 🔒 Firebase Security Rules for Development

For development, you can use these permissive rules (NOT for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Warning:** These rules allow anyone to read/write your data. Only use for development!

## 📁 File Structure

Your `.env.local` should be in the root of your project:

```
wishluu/
├── .env.local          ← Your environment variables
├── src/
├── package.json
└── ...
```

## 🔄 Restart Required

After changing `.env.local`, you need to restart your development server:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

## 🎯 Next Steps

Once your `.env.local` is set up:

1. **Test the credit system** at `/test-credits`
2. **Create some wishes** to test the full flow
3. **Check the dashboard** for premium status
4. **Test admin features** if you have admin access

## 🔐 JWT Authentication (Production)

The premium API now uses proper JWT verification for security:

### How it works:

1. **Frontend**: Gets Firebase Auth token using `user.getIdToken()`
2. **API**: Verifies token using Firebase Admin SDK
3. **Security**: Prevents unauthorized access and user impersonation

### For Production:

1. **Enable Firebase Admin SDK** by uncommenting the Admin variables above
2. **Get service account key** from Firebase Console:
   - Go to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Extract the values to your environment variables

### Development:

- JWT verification works with your existing Firebase project
- No additional setup needed for development

## 🚀 Production Setup

When you're ready for production, you'll need:

1. **Production Firebase project**
2. **Proper security rules**
3. **Production environment variables**
4. **Firebase Admin SDK setup** (for JWT verification)
5. **Payment processing setup** (if needed)

See `DEPLOYMENT_CHECKLIST.md` for production setup details.

---

**Need Help?** Check the console for error messages or refer to the Firebase documentation.
