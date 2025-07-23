import { NextRequest, NextResponse } from 'next/server';
import { createCreditPurchaseSession } from '@/lib/stripe';
import { adminAuth } from '@/lib/firebaseAdmin';
import { rateLimitConfigs, createRateLimitKey } from '@/lib/rateLimit';
import { addRateLimitHeaders, createRateLimitError } from '@/lib/apiMiddleware';

async function verifyAuth(
  request: NextRequest
): Promise<{ uid: string; email?: string } | null> {
  try {
    // Get JWT token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify JWT token with Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      ...(decodedToken.email && { email: decodedToken.email }),
    };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { packageId } = body;

    // Validate request
    if (!packageId) {
      return NextResponse.json(
        { error: 'Package ID is required' },
        { status: 400 }
      );
    }

    // Rate limiting
    const rateLimitKey = createRateLimitKey('payment', user.uid);
    const { rateLimiter } = await import('@/lib/rateLimit');
    const result = rateLimiter.checkRateLimit(
      rateLimitKey,
      rateLimitConfigs.payment || { maxRequests: 10, windowMs: 5 * 60 * 1000 }
    );

    if (!result.allowed) {
      return createRateLimitError(
        result.blocked
          ? 'Rate limit exceeded. You are temporarily blocked.'
          : 'Rate limit exceeded. Please try again later.',
        'payment',
        result.resetTime
      );
    }

    // Create checkout session
    const session = await createCreditPurchaseSession(
      user.uid,
      packageId,
      user.email || ''
    );

    const response = NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
    return addRateLimitHeaders(response, rateLimitKey, 'payment');
  } catch (error) {
    console.error('Payment session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    );
  }
}
