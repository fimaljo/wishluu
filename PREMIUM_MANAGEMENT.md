# Premium Management System

This document outlines the comprehensive premium management system implemented for WishLuu, including user limitations, feature access control, and upgrade flows.

## 🏗️ Architecture Overview

### Core Components

1. **FirebasePremiumService** (`src/lib/firebasePremiumService.ts`)
   - Handles all premium-related Firebase operations
   - Manages user plans, usage tracking, and feature access
   - Provides plan limits and upgrade/downgrade functionality

2. **usePremiumManagement Hook** (`src/hooks/usePremiumManagement.ts`)
   - React hook for managing premium state
   - Provides easy access to premium features and limitations
   - Handles user upgrades and usage tracking

3. **PremiumUpgradeModal** (`src/components/ui/PremiumUpgradeModal.tsx`)
   - Beautiful upgrade modal with plan comparison
   - Handles user plan selection and upgrade process
   - Shows current usage and plan benefits

4. **PremiumGuard Components** (`src/components/ui/PremiumGuard.tsx`)
   - Guards components based on user permissions
   - Automatically shows upgrade prompts when needed
   - Provides usage display and permission checking

5. **Premium API** (`src/app/api/premium/route.ts`)
   - RESTful API for premium operations
   - Handles user upgrades, usage tracking, and feature checks
   - Provides server-side validation and security

## 📊 Plan Structure

### Free Plan

- **Wishes per month**: 2
- **Templates per month**: 5
- **Features**: Basic elements, standard support
- **Price**: $0

### Pro Plan

- **Wishes per month**: 20
- **Templates per month**: 50
- **Features**: Custom backgrounds, unlimited elements, priority templates
- **Price**: $9.99/month

### Premium Plan

- **Wishes per month**: Unlimited
- **Templates per month**: Unlimited
- **Features**: All Pro features + priority support, analytics dashboard, custom branding
- **Price**: $19.99/month

## 🔧 Setup Instructions

### 1. Firebase Collections

Create the following Firestore collections:

```javascript
// premium_users collection
{
  userId: string,
  email: string,
  planType: 'free' | 'pro' | 'premium',
  isPremium: boolean,
  subscriptionId?: string,
  expiresAt?: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp,
  lastBillingDate?: timestamp,
  nextBillingDate?: timestamp,
  paymentMethod?: string,
  status: 'active' | 'cancelled' | 'past_due' | 'trialing'
}

// user_usage collection
{
  userId_month: string, // Format: "userId_YYYY-MM"
  userId: string,
  month: string, // Format: "YYYY-MM"
  wishesCreated: number,
  wishesViewed: number,
  templatesUsed: number,
  premiumFeaturesUsed: number,
  lastResetDate: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 2. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Premium users collection
    match /premium_users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // User usage collection
    match /user_usage/{usageId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }

    // Premium features collection (admin only)
    match /premium_features/{featureId} {
      allow read: if true;
      allow write: if request.auth != null &&
        request.auth.token.email in ['admin@example.com'];
    }
  }
}
```

### 3. Environment Variables

Add to your `.env.local`:

```env
# Premium Management
NEXT_PUBLIC_PREMIUM_ENABLED=true
NEXT_PUBLIC_FREE_WISH_LIMIT=2
NEXT_PUBLIC_PRO_WISH_LIMIT=20
NEXT_PUBLIC_PREMIUM_WISH_LIMIT=-1
```

## 🚀 Usage Examples

### Basic Usage in Components

```tsx
import { usePremiumManagement } from '@/hooks/usePremiumManagement';
import { WishCreationGuard, UsageDisplay } from '@/components/ui/PremiumGuard';

function MyComponent() {
  const { user, usage, limits, canCreateWish, incrementWishCreated } =
    usePremiumManagement();

  const handleCreateWish = async () => {
    const permission = await canCreateWish();
    if (permission.canCreate) {
      // Create wish logic
      await incrementWishCreated();
    } else {
      // Show upgrade prompt
      console.log(permission.reason);
    }
  };

  return (
    <div>
      <UsageDisplay />
      <WishCreationGuard>
        <button onClick={handleCreateWish}>Create Wish</button>
      </WishCreationGuard>
    </div>
  );
}
```

### Feature Access Control

```tsx
import { FeatureAccessGuard } from '@/components/ui/PremiumGuard';
import { useFeatureAccess } from '@/hooks/usePremiumManagement';

function PremiumFeature() {
  const { hasAccess, isLoading } = useFeatureAccess('custom_backgrounds');

  if (isLoading) return <div>Loading...</div>;

  return (
    <FeatureAccessGuard featureId='custom_backgrounds'>
      <div>
        {/* Premium feature content */}
        <ColorPicker />
      </div>
    </FeatureAccessGuard>
  );
}
```

### Manual Upgrade Trigger

```tsx
import { PremiumUpgradeModal } from '@/components/ui/PremiumUpgradeModal';
import { useState } from 'react';

function UpgradeButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>Upgrade Plan</button>
      <PremiumUpgradeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        trigger='manual'
      />
    </>
  );
}
```

## 🔄 Integration with Existing Code

### 1. Wish Creation Integration

Modify your wish creation logic to check permissions:

```tsx
// In your wish creation component
const handleSaveWish = async () => {
  const permission = await canCreateWish();
  if (!permission.canCreate) {
    setError(permission.reason || 'Cannot create wish');
    return;
  }

  // Proceed with wish creation
  const result = await createWish(wishData);
  if (result.success) {
    await incrementWishCreated(); // Track usage
  }
};
```

### 2. Dashboard Integration

Add usage display to user dashboard:

```tsx
import { UsageDisplay } from '@/components/ui/PremiumGuard';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <UsageDisplay />
      {/* Other dashboard content */}
    </div>
  );
}
```

### 3. API Integration

Use the premium API for server-side operations:

```typescript
// Check if user can create wish
const response = await fetch(
  `/api/premium?action=canCreateWish&userId=${userId}`
);
const result = await response.json();

if (result.success && result.data.canCreate) {
  // Allow wish creation
} else {
  // Show upgrade prompt
}
```

## 🔐 Security Considerations

### 1. Server-Side Validation

Always validate premium status on the server side:

```typescript
// In your API routes
export async function POST(request: NextRequest) {
  const { userId } = await request.json();

  // Check premium status
  const canCreate = await firebasePremiumService.canCreateWish(userId);
  if (!canCreate.success || !canCreate.data.canCreate) {
    return NextResponse.json({ error: 'Premium required' }, { status: 403 });
  }

  // Proceed with operation
}
```

### 2. Rate Limiting

Implement rate limiting for premium operations:

```typescript
// Example with rate limiting
const rateLimit = new Map();
const MAX_REQUESTS = 100;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(request: NextRequest) {
  const userId = request.headers.get('user-id');
  const now = Date.now();

  if (rateLimit.has(userId)) {
    const userRequests = rateLimit.get(userId);
    if (
      now - userRequests.timestamp < WINDOW_MS &&
      userRequests.count >= MAX_REQUESTS
    ) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
  }

  // Update rate limit
  rateLimit.set(userId, { count: 1, timestamp: now });
}
```

## 📈 Analytics and Monitoring

### 1. Usage Tracking

Track user behavior for business insights:

```typescript
// Track feature usage
await firebasePremiumService.incrementFeatureUsage(
  userId,
  'custom_backgrounds'
);

// Track upgrade conversions
await firebasePremiumService.trackUpgradeEvent(userId, 'free_to_pro');
```

### 2. Revenue Metrics

Monitor subscription metrics:

```typescript
// Get revenue metrics
const metrics = await firebasePremiumService.getRevenueMetrics();
console.log('Monthly Recurring Revenue:', metrics.mrr);
console.log('Churn Rate:', metrics.churnRate);
```

## 🔄 Payment Integration (Future)

### 1. Stripe Integration

```typescript
// Example Stripe integration
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createSubscription(userId: string, planType: string) {
  const subscription = await stripe.subscriptions.create({
    customer: userId,
    items: [{ price: getPriceId(planType) }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  });

  return subscription;
}
```

### 2. Webhook Handling

```typescript
// Handle Stripe webhooks
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  switch (event.type) {
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
  }
}
```

## 🧪 Testing

### 1. Unit Tests

```typescript
// Test premium service
describe('FirebasePremiumService', () => {
  it('should check wish creation permission', async () => {
    const result = await firebasePremiumService.canCreateWish('test-user');
    expect(result.success).toBe(true);
    expect(result.data.canCreate).toBeDefined();
  });

  it('should upgrade user to pro plan', async () => {
    const result = await firebasePremiumService.upgradeUser(
      'test-user',
      'test@example.com',
      'pro'
    );
    expect(result.success).toBe(true);
    expect(result.data.planType).toBe('pro');
  });
});
```

### 2. Integration Tests

```typescript
// Test API endpoints
describe('Premium API', () => {
  it('should return user status', async () => {
    const response = await fetch('/api/premium?action=status&userId=test-user');
    const result = await response.json();
    expect(result.success).toBe(true);
  });
});
```

## 🚀 Deployment Checklist

- [ ] Set up Firebase collections and security rules
- [ ] Configure environment variables
- [ ] Test premium flow end-to-end
- [ ] Set up monitoring and analytics
- [ ] Configure payment provider (when ready)
- [ ] Set up webhook endpoints
- [ ] Test upgrade/downgrade flows
- [ ] Verify usage tracking accuracy
- [ ] Set up automated monthly usage reset

## 📞 Support

For questions or issues with the premium management system:

1. Check the Firebase console for collection structure
2. Verify environment variables are set correctly
3. Test API endpoints using the provided examples
4. Review security rules and permissions
5. Monitor usage patterns and conversion rates

The premium management system is designed to be scalable, secure, and user-friendly while providing clear upgrade paths and usage transparency.
