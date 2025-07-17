import { NextRequest, NextResponse } from 'next/server';
import { FirebasePremiumService } from '@/lib/firebasePremiumService';
import { adminAuth } from '@/lib/firebaseAdmin';
import { rateLimitConfigs, createRateLimitKey } from '@/lib/rateLimit';
import { addRateLimitHeaders, createRateLimitError } from '@/lib/apiMiddleware';

async function verifyAuth(request: NextRequest): Promise<string | null> {
  try {
    // Get JWT token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid authorization header found');
      return null;
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify JWT token with Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Log successful verification (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('JWT verification successful for user:', decodedToken.uid);
    }

    return decodedToken.uid; // Return verified user ID
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, feature, amount, wishId } = body;

    // Validate request
    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Action is required' },
        { status: 400 }
      );
    }

    // Rate limiting with user-specific key
    const rateLimitKey = createRateLimitKey('premium', userId);
    const { rateLimiter } = await import('@/lib/rateLimit');
    const result = rateLimiter.checkRateLimit(
      rateLimitKey,
      rateLimitConfigs.premium
    );

    if (!result.allowed) {
      return createRateLimitError(
        result.blocked
          ? 'Rate limit exceeded. You are temporarily blocked.'
          : 'Rate limit exceeded. Please try again later.',
        'premium',
        result.resetTime
      );
    }

    switch (action) {
      case 'useCredits':
        if (!feature) {
          return NextResponse.json(
            { success: false, error: 'Feature is required for credit usage' },
            { status: 400 }
          );
        }

        const creditResult = await FirebasePremiumService.useCredits(
          userId,
          feature,
          'API credit usage',
          wishId
        );

        if (!creditResult.success) {
          return NextResponse.json(
            { success: false, error: creditResult.error },
            { status: 400 }
          );
        }

        const response = NextResponse.json({
          success: true,
          message: creditResult.message,
        });
        return addRateLimitHeaders(response, rateLimitKey, 'premium');

      case 'addCredits':
        if (!amount || typeof amount !== 'number' || amount <= 0) {
          return NextResponse.json(
            { success: false, error: 'Valid amount is required' },
            { status: 400 }
          );
        }

        const addResult = await FirebasePremiumService.addCredits(
          userId,
          amount,
          'API credit addition',
          'bonus'
        );

        if (!addResult.success) {
          return NextResponse.json(
            { success: false, error: addResult.error },
            { status: 500 }
          );
        }

        const addResponse = NextResponse.json({
          success: true,
          message: addResult.message,
        });
        return addRateLimitHeaders(addResponse, rateLimitKey, 'premium');

      case 'getStatus':
        const userResult = await FirebasePremiumService.getPremiumUser(
          userId,
          ''
        );
        if (!userResult.success) {
          return NextResponse.json(
            { success: false, error: userResult.error },
            { status: 500 }
          );
        }

        const statusResponse = NextResponse.json({
          success: true,
          data: userResult.data,
        });
        return addRateLimitHeaders(statusResponse, rateLimitKey, 'premium');

      case 'getCreditHistory':
        const historyResult =
          await FirebasePremiumService.getCreditHistory(userId);
        if (!historyResult.success) {
          return NextResponse.json(
            { success: false, error: historyResult.error },
            { status: 500 }
          );
        }

        const historyResponse = NextResponse.json({
          success: true,
          data: historyResult.data,
        });
        return addRateLimitHeaders(historyResponse, rateLimitKey, 'premium');

      case 'claimMonthlyLoginBonus':
        const bonusResult =
          await FirebasePremiumService.claimMonthlyLoginBonus(userId);
        if (!bonusResult.success) {
          return NextResponse.json(
            { success: false, error: bonusResult.error },
            { status: 500 }
          );
        }

        const bonusResponse = NextResponse.json({
          success: true,
          data: bonusResult.data,
        });
        return addRateLimitHeaders(bonusResponse, rateLimitKey, 'premium');

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Premium API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const rateLimitKey = createRateLimitKey('premium', userId);
    const { rateLimiter } = await import('@/lib/rateLimit');
    const result = rateLimiter.checkRateLimit(
      rateLimitKey,
      rateLimitConfigs.premium
    );
    if (!result.allowed) {
      return createRateLimitError(
        result.blocked
          ? 'Rate limit exceeded. You are temporarily blocked.'
          : 'Rate limit exceeded. Please try again later.',
        'premium',
        result.resetTime
      );
    }

    switch (action) {
      case 'status':
        const userResult = await FirebasePremiumService.getPremiumUser(
          userId,
          ''
        );
        if (!userResult.success) {
          return NextResponse.json(
            { success: false, error: userResult.error },
            { status: 500 }
          );
        }
        const statusResponse = NextResponse.json({
          success: true,
          data: userResult.data,
        });
        return addRateLimitHeaders(statusResponse, rateLimitKey, 'premium');
      case 'usage':
        const usageResult = await FirebasePremiumService.getUserUsage(userId);
        if (!usageResult.success) {
          return NextResponse.json(
            { success: false, error: usageResult.error },
            { status: 500 }
          );
        }
        const usageResponse = NextResponse.json({
          success: true,
          data: usageResult.data,
        });
        return addRateLimitHeaders(usageResponse, rateLimitKey, 'premium');
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Premium API GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
