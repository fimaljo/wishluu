# Vercel Deployment Guide

## 🚀 Free Hosting for Development & Testing

Vercel is the perfect free alternative for hosting your Next.js app. It's built by the Next.js team and offers excellent performance.

## Quick Setup

### 1. Deploy to Vercel

```bash
# Deploy to production
npm run deploy

# Deploy preview (for testing)
npm run deploy:preview

# Deploy development version
npm run deploy:dev
```

### 2. First Time Setup

When you run the deploy command for the first time:

1. Vercel will ask you to login (opens browser)
2. Choose to link to existing project or create new
3. Select your project settings
4. Deploy!

## What You Get (Free Tier)

✅ **Unlimited deployments**  
✅ **Custom domains** (your-app.vercel.app)  
✅ **SSL certificates** (automatic)  
✅ **Global CDN**  
✅ **API routes support**  
✅ **Environment variables**  
✅ **Preview deployments**  
✅ **Analytics**

## Your App URLs

After deployment, you'll get:

- **Production**: `https://your-app.vercel.app`
- **Preview**: `https://your-app-git-branch.vercel.app`
- **Development**: `https://your-app-dev.vercel.app`

## Environment Variables

Set up your environment variables in Vercel Dashboard:

1. Go to your project in Vercel Dashboard
2. Settings → Environment Variables
3. Add your Firebase config:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   ```

## API Routes

Your API routes (`/api/auth/user`, `/api/premium`) will work perfectly on Vercel. No additional setup needed!

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate is automatically provisioned

## Deployment Commands

```bash
# Production deployment
npm run deploy

# Preview deployment (for testing)
npm run deploy:preview

# Development deployment
npm run deploy:dev

# Local development
npm run dev
```

## Benefits Over Firebase Hosting

- ✅ **Completely free** (no paid plan required)
- ✅ **Better Next.js integration**
- ✅ **Faster deployments**
- ✅ **Built-in analytics**
- ✅ **Automatic HTTPS**
- ✅ **Global edge network**

## Migration to Firebase Later

When you're ready to move to Firebase:

1. Update your deployment scripts
2. Configure Firebase hosting
3. Update DNS records
4. No code changes needed!

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Next.js Documentation](https://nextjs.org/docs)
