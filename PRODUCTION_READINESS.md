# Production Readiness Checklist - Premium Credit System

## 🚨 Critical Issues to Fix Before Production

### 1. Remove Debug/Test Code

- [ ] Remove all `console.log` statements from production code
- [ ] Remove test pages (`/test-premium`, `/test-firebase`) - **Note: `/test-credits` kept for development**
- [ ] Remove debug logging in `firebase.ts` and other services
- [ ] Remove debug information displays from dashboard
- [ ] Ensure test pages are only accessible in development environment

### 2. Security Hardening

- [ ] Implement proper Firestore security rules for all collections
- [ ] Add server-side validation for all credit operations
- [ ] Implement rate limiting for credit operations
- [ ] Add authentication checks for all premium endpoints
- [ ] Remove hardcoded admin emails from client-side code

### 3. Error Handling & Monitoring

- [ ] Implement proper error logging service (e.g., Sentry)
- [ ] Add error boundaries for all premium components
- [ ] Implement retry logic for failed credit operations
- [ ] Add monitoring for credit balance inconsistencies
- [ ] Implement audit logging for all credit transactions

### 4. Payment Integration

- [ ] Integrate with payment provider (Stripe/PayPal)
- [ ] Implement webhook handlers for payment events
- [ ] Add proper error handling for payment failures
- [ ] Implement refund processing
- [ ] Add payment analytics and reporting

## 🔧 Implementation Plan

### Phase 1: Security & Cleanup (Immediate)

#### 1.1 Remove Debug Code

```typescript
// Remove these files:
- src/app/test-premium/page.tsx
- src/app/test-firebase/page.tsx
- src/app/test-credits/page.tsx

// Remove debug logging from:
- src/lib/firebase.ts (lines 75-85)
- src/lib/firebasePremiumService.ts (all console.log statements)
- src/components/auth/UserMenu.tsx (lines 15-20)
- src/features/wish-builder/components/WishCanvas.tsx (lines 50-75)
```

#### 1.2 Implement Production Security Rules

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Premium users - users can only access their own data
    match /premium_users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // User usage - users can only access their own usage data
    match /user_usage/{usageId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }

    // Credit transactions - users can only access their own transactions
    match /credit_transactions/{transactionId} {
      allow read: if request.auth != null &&
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.userId;
    }

    // Wishes - users can read public wishes, write their own
    match /wishes/{wishId} {
      allow read: if resource.data.isPublic == true ||
        (request.auth != null && request.auth.uid == resource.data.createdBy);
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        request.auth.uid == resource.data.createdBy;
    }

    // Templates - public read, admin write
    match /templates/{templateId} {
      allow read: if resource.data.isPublic == true;
      allow write: if request.auth != null &&
        request.auth.token.email in ['admin@example.com'];
    }
  }
}
```

#### 1.3 Add Server-Side Validation

```typescript
// src/app/api/premium/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { FirebasePremiumService } from '@/lib/firebasePremiumService';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, feature, amount } = body;

    // Validate request
    if (!action || !feature) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Rate limiting
    const rateLimitKey = `premium_${user.uid}`;
    const isRateLimited = await checkRateLimit(
      rateLimitKey,
      100,
      15 * 60 * 1000
    ); // 100 requests per 15 minutes
    if (isRateLimited) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    switch (action) {
      case 'useCredits':
        const result = await FirebasePremiumService.useCredits(
          user.uid,
          feature,
          'API credit usage',
          body.wishId
        );
        return NextResponse.json(result);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Premium API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Phase 2: Payment Integration (Next)

#### 2.1 Stripe Integration

```typescript
// src/lib/stripe.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function createCreditPurchase(
  userId: string,
  amount: number,
  packageType: string
) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${amount} Credits - ${packageType}`,
          },
          unit_amount: getPackagePrice(packageType) * 100, // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?canceled=true`,
    metadata: {
      userId,
      credits: amount.toString(),
      packageType,
    },
  });

  return session;
}
```

#### 2.2 Webhook Handler

```typescript
// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { FirebasePremiumService } from '@/lib/firebasePremiumService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await handleSuccessfulPayment(session);
      break;

    case 'payment_intent.payment_failed':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handleFailedPayment(paymentIntent);
      break;
  }

  return NextResponse.json({ received: true });
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const { userId, credits } = session.metadata!;
  const creditsAmount = parseInt(credits);

  await FirebasePremiumService.addCredits(
    userId,
    creditsAmount,
    `Credit purchase: ${creditsAmount} credits`,
    'purchase'
  );
}
```

### Phase 3: Monitoring & Analytics (Final)

#### 3.1 Error Monitoring

```typescript
// src/lib/monitoring.ts
import * as Sentry from '@sentry/nextjs';

export function initializeMonitoring() {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1,
    });
  }
}

export function logError(error: Error, context?: any) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, { extra: context });
  } else {
    console.error('Error:', error, context);
  }
}
```

#### 3.2 Credit Balance Monitoring

```typescript
// src/lib/creditMonitoring.ts
export async function validateCreditBalance(userId: string) {
  const user = await FirebasePremiumService.getPremiumUser(userId, '');
  const transactions = await FirebasePremiumService.getCreditHistory(userId);

  // Calculate expected balance
  const expectedBalance = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  if (user.data?.credits !== expectedBalance) {
    // Log discrepancy
    logError(new Error('Credit balance mismatch'), {
      userId,
      actualBalance: user.data?.credits,
      expectedBalance,
    });

    // Auto-correct if discrepancy is small
    if (Math.abs(user.data?.credits - expectedBalance) <= 1) {
      await FirebasePremiumService.correctBalance(userId, expectedBalance);
    }
  }
}
```

## 📋 Environment Variables

### Required for Production

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_production_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_production_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_production_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin (server-side only)
ADMIN_EMAILS=admin@example.com,another-admin@example.com

# Payment Processing
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=...

# App Configuration
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NODE_ENV=production
```

## 🧪 Testing Strategy

### 1. Unit Tests

```typescript
// src/lib/__tests__/firebasePremiumService.test.ts
describe('FirebasePremiumService', () => {
  it('should correctly deduct credits', async () => {
    const userId = 'test-user';
    await FirebasePremiumService.addCredits(userId, 10, 'Test credits');

    const result = await FirebasePremiumService.useCredits(
      userId,
      'premium_wish',
      'Test usage'
    );

    expect(result.success).toBe(true);

    const user = await FirebasePremiumService.getPremiumUser(userId, '');
    expect(user.data?.credits).toBe(8); // 10 - 2 for premium_wish
  });
});
```

### 2. Integration Tests

```typescript
// src/app/api/__tests__/premium.test.ts
describe('Premium API', () => {
  it('should handle credit usage with authentication', async () => {
    const response = await fetch('/api/premium', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testToken}`,
      },
      body: JSON.stringify({
        action: 'useCredits',
        feature: 'premium_wish',
      }),
    });

    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);
  });
});
```

### 3. End-to-End Tests

```typescript
// cypress/e2e/premium-flow.cy.ts
describe('Premium Credit Flow', () => {
  it('should allow users to purchase and use credits', () => {
    cy.login();
    cy.visit('/dashboard');
    cy.get('[data-testid="buy-credits"]').click();
    cy.get('[data-testid="credit-package-popular"]').click();
    cy.get('[data-testid="purchase-button"]').click();

    // Mock Stripe payment
    cy.intercept('POST', '/api/webhooks/stripe', { statusCode: 200 });

    cy.visit('/dashboard?success=true');
    cy.get('[data-testid="credit-balance"]').should('contain', '50');

    // Test credit usage
    cy.visit('/wishes/create');
    cy.get('[data-testid="create-wish"]').click();
    cy.get('[data-testid="credit-balance"]').should('contain', '48');
  });
});
```

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] All debug code removed
- [ ] Security rules implemented and tested
- [ ] Payment integration complete
- [ ] Error monitoring configured
- [ ] Environment variables set
- [ ] Database indexes created
- [ ] Rate limiting implemented
- [ ] All tests passing

### Deployment

- [ ] Deploy to staging environment
- [ ] Run full test suite
- [ ] Test payment flow with test cards
- [ ] Verify credit tracking accuracy
- [ ] Test error scenarios
- [ ] Performance testing
- [ ] Security audit

### Post-Deployment

- [ ] Monitor error rates
- [ ] Track credit balance consistency
- [ ] Monitor payment success rates
- [ ] User feedback collection
- [ ] Performance monitoring
- [ ] Security monitoring

## 🔒 Security Considerations

### Data Protection

- All credit transactions are immutable
- User data is encrypted at rest
- API endpoints require authentication
- Rate limiting prevents abuse
- Audit logs for all operations

### Payment Security

- PCI DSS compliance through Stripe
- No credit card data stored locally
- Webhook signature verification
- Idempotency for payment operations
- Fraud detection integration

### Access Control

- Role-based access control
- Admin-only operations protected
- User data isolation
- Session management
- Multi-factor authentication ready

## 📊 Monitoring & Analytics

### Key Metrics

- Credit purchase conversion rate
- Credit usage patterns
- Payment success/failure rates
- User engagement with premium features
- Revenue per user
- Churn rate

### Alerts

- Credit balance discrepancies
- Payment processing failures
- High error rates
- Unusual usage patterns
- Security incidents

This production readiness plan ensures the premium credit system is secure, scalable, and ready for real users.
