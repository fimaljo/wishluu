import { NextRequest, NextResponse } from 'next/server';
import { corsConfig, requestLimits, securityUtils } from '@/lib/security';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // CORS handling
  const origin = request.headers.get('origin');
  if (origin && !securityUtils.isAllowedOrigin(origin)) {
    return new NextResponse('CORS Error: Origin not allowed', { status: 403 });
  }

  // Add CORS headers
  if (origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set(
    'Access-Control-Allow-Methods',
    corsConfig.methods.join(', ')
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    corsConfig.allowedHeaders.join(', ')
  );
  response.headers.set('Access-Control-Max-Age', corsConfig.maxAge.toString());

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return response;
  }

  // Request size limiting
  const contentLength = request.headers.get('content-length');
  if (contentLength) {
    const sizeInMB = parseInt(contentLength) / (1024 * 1024);
    const maxSizeInMB = parseInt(requestLimits.json.replace('mb', ''));

    if (sizeInMB > maxSizeInMB) {
      return new NextResponse('Request too large', { status: 413 });
    }
  }

  // Security headers (additional to next.config.ts)
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Download-Options', 'noopen');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');

  // Block suspicious user agents
  const userAgent = request.headers.get('user-agent') || '';
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
  ];

  const isSuspicious = suspiciousPatterns.some(pattern =>
    pattern.test(userAgent)
  );
  if (isSuspicious && request.nextUrl.pathname.startsWith('/api/')) {
    return new NextResponse('Access denied', { status: 403 });
  }

  // Rate limiting for specific endpoints (additional to existing rate limiting)
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    // This is handled by the existing rate limiting in the API routes
    // but we can add additional checks here if needed
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
