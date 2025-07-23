// Credit package configuration (safe for client-side)
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
  popular: {
    id: 'popular',
    name: 'Popular',
    price: 999, // $9.99 in cents
    credits: 25,
    bonus: 5,
    features: [
      '30 credits total (25 + 5 bonus)',
      'Ad-free experience',
      'Priority support',
    ],
    popular: true,
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 1999, // $19.99 in cents
    credits: 60,
    bonus: 15,
    features: [
      '75 credits total (60 + 15 bonus)',
      'Ad-free experience',
      'Priority support',
    ],
    popular: false,
  },
} as const;

export type CreditPackageId = keyof typeof CREDIT_PACKAGES;

// Get package by ID
export function getPackageById(packageId: string) {
  return CREDIT_PACKAGES[packageId as CreditPackageId];
}

// Get all packages
export function getAllPackages() {
  return Object.values(CREDIT_PACKAGES);
}

// Server-side only functions
export async function createCreditPurchaseSession(
  userId: string,
  packageId: CreditPackageId,
  userEmail: string
) {
  // Only import Stripe on server-side
  const { default: Stripe } = await import('stripe');

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-06-30.basil',
  });

  const packageData = CREDIT_PACKAGES[packageId];
  const totalCredits = packageData.credits + packageData.bonus;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: userEmail,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${packageData.name} Credit Package`,
            description: `${totalCredits} credits (${packageData.credits} + ${packageData.bonus} bonus)`,
            images: ['https://wishluu.com/logo.png'], // Replace with your logo URL
          },
          unit_amount: packageData.price,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true&package=${packageId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?canceled=true`,
    metadata: {
      userId,
      packageId,
      credits: totalCredits.toString(),
      baseCredits: packageData.credits.toString(),
      bonusCredits: packageData.bonus.toString(),
    },
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
  });

  return session;
}

// Verify webhook signature
export async function verifyWebhookSignature(body: string, signature: string) {
  // Only import Stripe on server-side
  const { default: Stripe } = await import('stripe');

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-06-30.basil',
  });

  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}
