# Payment Integration Guide

This guide explains the complete payment integration system implemented for WishLuu, allowing users to purchase credits using Stripe.

## 🏗️ Architecture Overview

### Components

1. **Stripe Configuration** (`src/lib/stripe.ts`)
   - Stripe client initialization
   - Credit package definitions
   - Checkout session creation
   - Webhook signature verification

2. **Payment API Routes**
   - `/api/payment/create-session` - Creates Stripe checkout sessions
   - `/api/webhooks/stripe` - Handles Stripe webhook events

3. **Frontend Payment Hook** (`src/hooks/usePayment.ts`)
   - Payment state management
   - Credit purchase functionality
   - Package information retrieval

4. **UI Components**
   - `PremiumUpgradeModal` - Credit package selection
   - `PaymentSuccessModal` - Success confirmation
   - Dashboard payment handling

## 💳 Credit Packages

The system offers three credit packages:

| Package | Price  | Base Credits | Bonus Credits | Total |
| ------- | ------ | ------------ | ------------- | ----- |
| Starter | $4.99  | 10           | 0             | 10    |
| Popular | $9.99  | 25           | 5             | 30    |
| Premium | $19.99 | 60           | 15            | 75    |

### Package Features

- **Starter**: Basic credit package for new users
- **Popular**: Best value with bonus credits
- **Premium**: Large credit package for power users

## 🔄 Payment Flow

### 1. User Initiates Purchase

1. User clicks "Buy Credits" in dashboard or upgrade modal
2. User selects a credit package
3. Frontend calls `/api/payment/create-session` with package ID
4. API creates Stripe checkout session with user metadata
5. User is redirected to Stripe Checkout

### 2. Payment Processing

1. User completes payment on Stripe's secure checkout page
2. Stripe processes the payment
3. User is redirected back to the application

### 3. Webhook Processing

1. Stripe sends webhook event to `/api/webhooks/stripe`
2. Webhook handler verifies signature
3. On successful payment, credits are added to user account
4. Transaction is recorded in Firestore

### 4. Success Handling

1. User sees success message on dashboard
2. Credit balance is updated in real-time
3. User can immediately use new credits

## 🔧 Implementation Details

### Stripe Configuration

```typescript
// src/lib/stripe.ts
export const CREDIT_PACKAGES = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 499, // $4.99 in cents
    credits: 10,
    bonus: 0,
    features: ['10 credits', 'Ad-free experience'],
    popular: false,
  },
  // ... other packages
};
```

### Payment Hook Usage

```typescript
// In any component
const { purchaseCredits, isProcessing, error } = usePayment();

const handlePurchase = async (packageId: 'starter' | 'popular' | 'premium') => {
  const result = await purchaseCredits(packageId);
  if (result.success) {
    // User will be redirected to Stripe Checkout
  }
};
```

### Webhook Event Handling

```typescript
// src/app/api/webhooks/stripe/route.ts
switch (event.type) {
  case 'checkout.session.completed':
    await handleCheckoutSessionCompleted(event.data.object);
    break;
  case 'payment_intent.payment_failed':
    await handlePaymentFailed(event.data.object);
    break;
}
```

## 🛡️ Security Features

### Authentication

- All payment API calls require valid JWT tokens
- User authentication verified on server-side
- Rate limiting prevents abuse

### Webhook Security

- Stripe signature verification
- Idempotency handling
- Error logging and monitoring

### Data Protection

- No credit card data stored locally
- PCI DSS compliance through Stripe
- Secure token-based authentication

## 🧪 Testing

### Test Card Numbers

Use these Stripe test cards for testing:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Expired**: `4000 0000 0000 0069`
- **Insufficient Funds**: `4000 0000 0000 9995`

### Local Testing

1. **Install Stripe CLI**:

   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Windows
   # Download from https://github.com/stripe/stripe-cli/releases
   ```

2. **Login to Stripe**:

   ```bash
   stripe login
   ```

3. **Forward webhooks**:

   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Test payment flow**:
   - Use test card numbers
   - Check webhook events in Stripe Dashboard
   - Verify credits are added to user account

## 🚀 Production Deployment

### Environment Variables

Set these in your production environment:

```env
# Stripe
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Application
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### Webhook Configuration

1. Go to Stripe Dashboard > Developers > Webhooks
2. Create webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
   - `payment_intent.succeeded`
4. Copy webhook signing secret

### Monitoring

- Monitor webhook delivery in Stripe Dashboard
- Set up error alerts for failed payments
- Track credit balance consistency
- Monitor payment success rates

## 🔍 Troubleshooting

### Common Issues

1. **Webhook not receiving events**
   - Check webhook URL is correct
   - Verify webhook secret matches
   - Ensure endpoint is publicly accessible

2. **Credits not added after payment**
   - Check webhook event logs
   - Verify user ID in session metadata
   - Check Firebase permissions

3. **Payment session creation fails**
   - Verify Stripe API keys
   - Check user authentication
   - Review rate limiting settings

4. **Redirect issues**
   - Ensure `NEXT_PUBLIC_BASE_URL` is set correctly
   - Check success/cancel URLs in Stripe session

### Debug Steps

1. **Check server logs** for API errors
2. **Monitor Stripe Dashboard** for webhook events
3. **Verify Firebase** credit transactions
4. **Test with Stripe CLI** for local debugging

## 📊 Analytics & Reporting

### Key Metrics to Track

- Payment success rate
- Average order value
- Credit package popularity
- Webhook delivery success rate
- Credit usage patterns

### Stripe Dashboard

- Monitor payments in real-time
- View webhook event logs
- Track customer behavior
- Generate financial reports

## 🔄 Future Enhancements

### Potential Improvements

1. **Subscription Plans**: Monthly/yearly credit subscriptions
2. **Gift Cards**: Allow users to gift credits
3. **Bulk Discounts**: Volume pricing for large purchases
4. **Payment Methods**: Support for PayPal, Apple Pay, etc.
5. **Refund System**: Automated refund processing
6. **Tax Calculation**: Automatic tax calculation
7. **Multi-currency**: Support for different currencies

### Implementation Notes

- All payment logic is centralized in `src/lib/stripe.ts`
- Webhook handlers are extensible for new events
- Credit packages can be easily modified
- Payment flow is designed for scalability

---

For technical support or questions about the payment integration, refer to the Stripe documentation or contact the development team.
