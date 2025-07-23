# Environment Setup Guide

This guide explains how to set up all required environment variables for the WishLuu application.

## Required Environment Variables

### Firebase Configuration

```env
# Firebase Project Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (for server-side operations)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

### Stripe Payment Configuration

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Stripe Webhook Secret (get this from Stripe Dashboard)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Base URL for your application (used in payment redirects)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Application Configuration

```env
# Welcome bonus credits for new users
NEXT_PUBLIC_WELCOME_BONUS_CREDITS=10

# Admin email addresses (comma-separated)
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com,admin2@example.com
```

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication (Google, Email/Password)
4. Create a Firestore database
5. Go to Project Settings > General
6. Copy the Firebase config object values to your environment variables
7. Go to Project Settings > Service Accounts
8. Generate a new private key and download the JSON file
9. Extract the values from the JSON file to your environment variables

### 2. Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create an account or sign in
3. Go to Developers > API Keys
4. Copy your publishable key and secret key
5. Go to Developers > Webhooks
6. Create a new webhook endpoint:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events to send: `checkout.session.completed`, `payment_intent.payment_failed`, `payment_intent.succeeded`
7. Copy the webhook signing secret

### 3. Local Development

1. Create a `.env.local` file in your project root
2. Add all the environment variables listed above
3. For local development, use Stripe test keys
4. Set `NEXT_PUBLIC_BASE_URL=http://localhost:3000`

### 4. Production Deployment

1. Set up environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Use Stripe live keys for production
3. Set `NEXT_PUBLIC_BASE_URL` to your production domain
4. Configure the webhook URL to point to your production domain

## Security Notes

- Never commit `.env.local` or any files containing secrets to version control
- Use different Stripe keys for development and production
- Regularly rotate your Firebase service account keys
- Monitor your Stripe webhook events for any failed deliveries

## Testing Payment Integration

1. Use Stripe test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Expired: `4000 0000 0000 0069`

2. Test webhook delivery using Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

## Troubleshooting

### Common Issues

1. **Firebase Admin SDK errors**: Ensure your service account has the correct permissions
2. **Stripe webhook failures**: Check that your webhook secret is correct and the endpoint is accessible
3. **Payment redirect issues**: Verify `NEXT_PUBLIC_BASE_URL` is set correctly
4. **CORS errors**: Ensure your domain is whitelisted in Firebase Auth settings

### Getting Help

- Check the Firebase and Stripe documentation
- Review the application logs for detailed error messages
- Test with the provided test credentials first
