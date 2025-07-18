import { NextRequest, NextResponse } from 'next/server';
import { FirebaseWishService } from '@/lib/firebaseWishService';
import { rateLimitConfigs, createRateLimitKey } from '@/lib/rateLimit';
import { adminAuth } from '@/lib/firebaseAdmin';

// Simple rate limiting for auth endpoints
const authRateLimitMap = new Map<
  string,
  { count: number; resetTime: number }
>();

function checkAuthRateLimit(key: string): boolean {
  const now = Date.now();
  const record = authRateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    authRateLimitMap.set(key, {
      count: 1,
      resetTime: now + rateLimitConfigs.auth.windowMs,
    });
    return false;
  }

  if (record.count >= rateLimitConfigs.auth.maxRequests) {
    return true;
  }

  record.count++;
  return false;
}

async function verifyAuth(request: NextRequest): Promise<string | null> {
  try {
    // Get JWT token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify JWT token with Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(token);

    return decodedToken.uid; // Return verified user ID
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication first
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Rate limiting for user creation/updates
    const rateLimitKey = createRateLimitKey('auth_user', userId);

    if (checkAuthRateLimit(rateLimitKey)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
          rateLimit: {
            window: '10 minutes',
            limit: rateLimitConfigs.auth.maxRequests,
          },
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { userData } = body;

    if (!userData || !userData.id || !userData.email) {
      return NextResponse.json(
        { success: false, error: 'Invalid user data' },
        { status: 400 }
      );
    }

    // Ensure user can only update their own data
    if (userData.id !== userId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - can only update own data' },
        { status: 403 }
      );
    }

    const result = await FirebaseWishService.upsertUser(userData);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error upserting user:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication first
    const authenticatedUserId = await verifyAuth(request);
    if (!authenticatedUserId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Rate limiting for user lookups
    const rateLimitKey = createRateLimitKey(
      'auth_user_get',
      authenticatedUserId
    );

    if (checkAuthRateLimit(rateLimitKey)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
          rateLimit: {
            window: '10 minutes',
            limit: rateLimitConfigs.auth.maxRequests,
          },
        },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get('userId');

    if (!requestedUserId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Ensure user can only access their own data
    if (requestedUserId !== authenticatedUserId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - can only access own data' },
        { status: 403 }
      );
    }

    const result = await FirebaseWishService.getUserById(requestedUserId);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
