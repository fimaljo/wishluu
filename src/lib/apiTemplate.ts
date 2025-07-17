// Template for new API endpoints with JWT authentication and rate limiting
// Copy this pattern for any new API route you create

import { NextRequest, NextResponse } from 'next/server';
import { rateLimitConfigs, createRateLimitKey } from '@/lib/rateLimit';
import { addRateLimitHeaders, createRateLimitError } from '@/lib/apiMiddleware';
import { adminAuth } from '@/lib/firebaseAdmin';
import {
  wishValidationSchema,
  userValidationSchema,
  creditValidationSchema,
  sanitizeInput,
  SecurityError,
  SecurityErrorCodes,
} from '@/lib/security';

// JWT Authentication function (copy this to every API)
async function verifyAuth(request: NextRequest): Promise<string | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// Template for POST endpoint
export async function POST(request: NextRequest) {
  try {
    // 1. Verify authentication
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Apply rate limiting
    const rateLimitKey = createRateLimitKey('your_endpoint_name', userId);
    const { rateLimiter } = await import('@/lib/rateLimit');
    const result = rateLimiter.checkRateLimit(
      rateLimitKey,
      rateLimitConfigs.general
    );

    if (!result.allowed) {
      return createRateLimitError(
        result.blocked
          ? 'Rate limit exceeded. You are temporarily blocked.'
          : 'Rate limit exceeded. Please try again later.',
        'general',
        result.resetTime
      );
    }

    // 3. Parse and validate request
    const body = await request.json();

    // Validate input using Zod schema
    try {
      const validatedData = wishValidationSchema.parse(body);

      // Sanitize input
      const sanitizedData = {
        ...validatedData,
        title: sanitizeInput.text(validatedData.title),
        recipientName: sanitizeInput.text(validatedData.recipientName),
        message: validatedData.message
          ? sanitizeInput.text(validatedData.message)
          : '',
      };

      if (!sanitizedData) {
        throw new SecurityError(
          'Invalid input data',
          SecurityErrorCodes.INVALID_INPUT
        );
      }
    } catch (error) {
      if (error instanceof SecurityError) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: error.statusCode }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // 4. Your API logic here
    // const result = await YourService.doSomething(userId, data);

    // 5. Return response with rate limit headers
    const response = NextResponse.json({
      success: true,
      message: 'Operation completed successfully',
      // data: result
    });

    return addRateLimitHeaders(response, rateLimitKey, 'general');
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Template for GET endpoint
export async function GET(request: NextRequest) {
  try {
    // 1. Verify authentication
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Apply rate limiting
    const rateLimitKey = createRateLimitKey('your_endpoint_name_get', userId);
    const { rateLimiter } = await import('@/lib/rateLimit');
    const result = rateLimiter.checkRateLimit(
      rateLimitKey,
      rateLimitConfigs.general
    );

    if (!result.allowed) {
      return createRateLimitError(
        result.blocked
          ? 'Rate limit exceeded. You are temporarily blocked.'
          : 'Rate limit exceeded. Please try again later.',
        'general',
        result.resetTime
      );
    }

    // 3. Get query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    // 4. Your API logic here
    // const data = await YourService.getById(id, userId);

    // 5. Return response with rate limit headers
    const response = NextResponse.json({
      success: true,
      // data: data
    });

    return addRateLimitHeaders(response, rateLimitKey, 'general');
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Template for public endpoint (no authentication required)
export async function GET_PUBLIC(request: NextRequest) {
  try {
    // 1. Get client IP for rate limiting
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // 2. Apply rate limiting by IP
    const rateLimitKey = createRateLimitKey('public_endpoint', clientIp);
    const { rateLimiter } = await import('@/lib/rateLimit');
    const result = rateLimiter.checkRateLimit(
      rateLimitKey,
      rateLimitConfigs.public
    );

    if (!result.allowed) {
      return createRateLimitError(
        'Rate limit exceeded. Please try again later.',
        'public',
        result.resetTime
      );
    }

    // 3. Your public API logic here
    // const data = await PublicService.getPublicData();

    // 4. Return response with rate limit headers
    const response = NextResponse.json({
      success: true,
      // data: data
    });

    return addRateLimitHeaders(response, rateLimitKey, 'public');
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Rate limit configurations available:
// rateLimitConfigs.premium    // 100 requests per 15 minutes (strict)
// rateLimitConfigs.auth       // 50 requests per 10 minutes (moderate)
// rateLimitConfigs.general    // 200 requests per 15 minutes (permissive)
// rateLimitConfigs.public     // 500 requests per 15 minutes (very permissive)
