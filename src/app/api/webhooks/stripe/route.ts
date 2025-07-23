import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/stripe';
import { FirebasePremiumService } from '@/lib/firebasePremiumService';
import { getPackageById } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe signature' },
      { status: 400 }
    );
  }

  let event;

  try {
    event = await verifyWebhookSignature(body, signature);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  const { userId, packageId, credits } = session.metadata;

  if (!userId || !packageId || !credits) {
    console.error(
      'Missing required metadata in checkout session:',
      session.metadata
    );
    return;
  }

  try {
    // Get package details for description
    const packageData = getPackageById(packageId);
    const description = packageData
      ? `Purchased ${packageData.name} package (${credits} credits)`
      : `Purchased ${credits} credits`;

    // Add credits to user account
    const result = await FirebasePremiumService.addCredits(
      userId,
      parseInt(credits),
      description,
      'purchase'
    );

    if (!result.success) {
      console.error('Failed to add credits after payment:', result.error);
      // In a production environment, you might want to:
      // 1. Send an email to admin
      // 2. Create a support ticket
      // 3. Log to monitoring service
    } else {
      console.log(`Successfully added ${credits} credits to user ${userId}`);
    }
  } catch (error) {
    console.error('Error processing checkout session completion:', error);
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  const { userId } = paymentIntent.metadata;

  if (userId) {
    console.log(
      `Payment failed for user ${userId}:`,
      paymentIntent.last_payment_error
    );

    // In a production environment, you might want to:
    // 1. Send an email to the user
    // 2. Update user status
    // 3. Log the failure for analytics
  }
}

async function handlePaymentSucceeded(paymentIntent: any) {
  const { userId } = paymentIntent.metadata;

  if (userId) {
    console.log(`Payment succeeded for user ${userId}`);

    // This is typically handled by checkout.session.completed
    // but we log it here for completeness
  }
}
