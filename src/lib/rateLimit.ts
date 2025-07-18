// Rate limiting utility for API endpoints
// In production, use Redis or similar for distributed rate limiting

interface RateLimitRecord {
  count: number;
  resetTime: number;
  blockedUntil?: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDurationMs?: number; // How long to block after limit exceeded
}

class RateLimiter {
  private rateLimitMap = new Map<string, RateLimitRecord>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired records every 5 minutes
    this.cleanupInterval = setInterval(
      () => {
        this.cleanup();
      },
      5 * 60 * 1000
    );
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, record] of this.rateLimitMap.entries()) {
      if (
        now > record.resetTime &&
        (!record.blockedUntil || now > record.blockedUntil)
      ) {
        this.rateLimitMap.delete(key);
      }
    }
  }

  checkRateLimit(
    key: string,
    config: RateLimitConfig
  ): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    blocked: boolean;
  } {
    const now = Date.now();
    const record = this.rateLimitMap.get(key);

    // If no record exists, create one
    if (!record) {
      this.rateLimitMap.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs,
        blocked: false,
      };
    }

    // Check if currently blocked
    if (record.blockedUntil && now < record.blockedUntil) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.blockedUntil,
        blocked: true,
      };
    }

    // Check if window has expired
    if (now > record.resetTime) {
      this.rateLimitMap.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs,
        blocked: false,
      };
    }

    // Check if limit exceeded
    if (record.count >= config.maxRequests) {
      // Block the user if blockDuration is configured
      if (config.blockDurationMs) {
        record.blockedUntil = now + config.blockDurationMs;
      }
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
        blocked: !!record.blockedUntil,
      };
    }

    // Increment count
    record.count++;
    return {
      allowed: true,
      remaining: config.maxRequests - record.count,
      resetTime: record.resetTime,
      blocked: false,
    };
  }

  // Get rate limit info without incrementing
  getRateLimitInfo(
    key: string,
    config: RateLimitConfig
  ): { remaining: number; resetTime: number } {
    const now = Date.now();
    const record = this.rateLimitMap.get(key);

    if (!record || now > record.resetTime) {
      return {
        remaining: config.maxRequests,
        resetTime: now + config.windowMs,
      };
    }

    return {
      remaining: Math.max(0, config.maxRequests - record.count),
      resetTime: record.resetTime,
    };
  }

  // Clean up resources
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.rateLimitMap.clear();
  }
}

// Create singleton instance
export const rateLimiter = new RateLimiter();

// Rate limit configurations for different endpoints
export const rateLimitConfigs = {
  // Premium operations - more restrictive
  premium: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 30 * 60 * 1000, // Block for 30 minutes if exceeded
  },

  // Auth operations - moderate
  auth: {
    maxRequests: 50,
    windowMs: 10 * 60 * 1000, // 10 minutes
    blockDurationMs: 15 * 60 * 1000, // Block for 15 minutes if exceeded
  },

  // General API - more permissive
  general: {
    maxRequests: 200,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 5 * 60 * 1000, // Block for 5 minutes if exceeded
  },

  // Public endpoints - very permissive
  public: {
    maxRequests: 500,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 0, // No blocking
  },
};

// Helper function to create rate limit key
export function createRateLimitKey(type: string, identifier: string): string {
  return `${type}_${identifier}`;
}

// Helper function to get client identifier
export function getClientIdentifier(request: Request): string {
  // Try to get user ID from JWT token first
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    // For authenticated requests, we'll use a placeholder
    // The actual user ID will be extracted after JWT verification
    return 'authenticated';
  }

  // For unauthenticated requests, use IP address
  // In Next.js, you can get IP from headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';

  return ip;
}

// Rate limiting middleware function
export function withRateLimit(
  config: RateLimitConfig,
  getIdentifier: (request: Request) => string = getClientIdentifier
) {
  return function rateLimitMiddleware(request: Request) {
    const identifier = getIdentifier(request);
    const key = createRateLimitKey('api', identifier);

    const result = rateLimiter.checkRateLimit(key, config);

    if (!result.allowed) {
      const error = new Error(
        result.blocked
          ? 'Rate limit exceeded. You are temporarily blocked.'
          : 'Rate limit exceeded. Please try again later.'
      );
      (error as any).status = 429;
      (error as any).rateLimitInfo = {
        remaining: result.remaining,
        resetTime: result.resetTime,
        blocked: result.blocked,
      };
      throw error;
    }

    return result;
  };
}
