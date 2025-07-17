import { NextResponse } from 'next/server';
import {
  rateLimitConfigs,
  createRateLimitKey,
  rateLimiter,
} from '@/lib/rateLimit';

// Middleware to add rate limiting headers to responses
export function addRateLimitHeaders(
  response: NextResponse,
  key: string,
  config: keyof typeof rateLimitConfigs
): NextResponse {
  const rateLimitInfo = rateLimiter.getRateLimitInfo(
    key,
    rateLimitConfigs[config]
  );

  response.headers.set(
    'X-RateLimit-Limit',
    rateLimitConfigs[config].maxRequests.toString()
  );
  response.headers.set(
    'X-RateLimit-Remaining',
    rateLimitInfo.remaining.toString()
  );
  response.headers.set('X-RateLimit-Reset', rateLimitInfo.resetTime.toString());
  response.headers.set(
    'X-RateLimit-Window',
    `${rateLimitConfigs[config].windowMs / 1000}s`
  );

  return response;
}

// Helper to create rate limit error response
export function createRateLimitError(
  message: string,
  config: keyof typeof rateLimitConfigs,
  resetTime: number
): NextResponse {
  const response = NextResponse.json(
    {
      success: false,
      error: message,
      rateLimit: {
        window: `${rateLimitConfigs[config].windowMs / 1000 / 60} minutes`,
        limit: rateLimitConfigs[config].maxRequests,
        resetTime: new Date(resetTime).toISOString(),
      },
    },
    { status: 429 }
  );

  // Add rate limit headers
  response.headers.set(
    'X-RateLimit-Limit',
    rateLimitConfigs[config].maxRequests.toString()
  );
  response.headers.set('X-RateLimit-Remaining', '0');
  response.headers.set('X-RateLimit-Reset', resetTime.toString());
  response.headers.set(
    'X-RateLimit-Window',
    `${rateLimitConfigs[config].windowMs / 1000}s`
  );
  response.headers.set(
    'Retry-After',
    `${Math.ceil((resetTime - Date.now()) / 1000)}`
  );

  return response;
}

// Wrapper function to apply rate limiting to API handlers
export function withRateLimitWrapper<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>,
  config: keyof typeof rateLimitConfigs,
  getKey: (...args: T) => string
) {
  return async (...args: T): Promise<NextResponse> => {
    const key = getKey(...args);
    const result = rateLimiter.checkRateLimit(key, rateLimitConfigs[config]);

    if (!result.allowed) {
      return createRateLimitError(
        result.blocked
          ? 'Rate limit exceeded. You are temporarily blocked.'
          : 'Rate limit exceeded. Please try again later.',
        config,
        result.resetTime
      );
    }

    // Call the original handler
    const response = await handler(...args);

    // Add rate limit headers to successful responses
    return addRateLimitHeaders(response, key, config);
  };
}

// Utility to get client identifier from request
export function getClientIdentifier(request: Request): string {
  // For authenticated requests, try to get user ID from JWT
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    // We'll extract the user ID after JWT verification
    return 'authenticated';
  }

  // For unauthenticated requests, use IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';

  return ip;
}

// Rate limit key generators for different endpoints
export const rateLimitKeys = {
  premium: (userId: string) => createRateLimitKey('premium', userId),
  auth: (clientId: string) => createRateLimitKey('auth', clientId),
  general: (clientId: string) => createRateLimitKey('general', clientId),
  public: (clientId: string) => createRateLimitKey('public', clientId),
};
