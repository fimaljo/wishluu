// Security configurations and utilities
import { z } from 'zod';

// Input validation schemas
export const wishValidationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  recipientName: z
    .string()
    .min(1, 'Recipient name is required')
    .max(50, 'Name too long'),
  message: z.string().max(1000, 'Message too long').optional(),
  theme: z.string().min(1, 'Theme is required'),
  elements: z.array(z.any()).max(50, 'Too many elements'),
  isPublic: z.boolean().default(true),
});

export const userValidationSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  email: z.string().email('Invalid email'),
  displayName: z.string().max(100, 'Name too long').optional(),
});

export const creditValidationSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be positive')
    .max(10000, 'Amount too high'),
  description: z
    .string()
    .min(1, 'Description required')
    .max(200, 'Description too long'),
  source: z.string().min(1, 'Source required').max(50, 'Source too long'),
});

// Security headers configuration
export const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.gstatic.com https://www.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com",
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
};

// CORS configuration
export const corsConfig = {
  origin:
    process.env.NODE_ENV === 'production'
      ? [process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com']
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400, // 24 hours
};

// Request size limits
export const requestLimits = {
  json: '10mb',
  urlencoded: '10mb',
  text: '10mb',
  raw: '10mb',
};

// Rate limiting configurations (additional to existing ones)
export const additionalRateLimits = {
  // File uploads
  fileUpload: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 files per 15 minutes
    message: 'Too many file uploads, please try again later.',
  },

  // Authentication attempts
  authAttempts: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per 15 minutes
    message: 'Too many authentication attempts, please try again later.',
  },

  // API key usage (if you add API keys later)
  apiKey: {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: 'API rate limit exceeded.',
  },
};

// Input sanitization utilities
export const sanitizeInput = {
  // Remove potentially dangerous characters
  text: (input: string): string => {
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  },

  // Sanitize HTML content
  html: (input: string): string => {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, ''); // Remove event handlers
  },

  // Validate and sanitize email
  email: (input: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input) ? input.toLowerCase().trim() : null;
  },

  // Validate and sanitize URL
  url: (input: string): string | null => {
    try {
      const url = new URL(input);
      return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null;
    } catch {
      return null;
    }
  },
};

// Security middleware utilities
export const securityUtils = {
  // Check if request is from allowed origin
  isAllowedOrigin: (origin: string): boolean => {
    const allowedOrigins = corsConfig.origin;
    return Array.isArray(allowedOrigins)
      ? allowedOrigins.includes(origin)
      : allowedOrigins === origin;
  },

  // Validate API key (for future use)
  validateApiKey: (apiKey: string): boolean => {
    // Implement API key validation logic here
    return apiKey.length > 0 && apiKey.startsWith('wishluu_');
  },

  // Check if user has permission for action
  hasPermission: (userRole: string, requiredRole: string): boolean => {
    const roleHierarchy = {
      user: 1,
      pro: 2,
      premium: 3,
      admin: 4,
    };

    return (
      (roleHierarchy[userRole as keyof typeof roleHierarchy] || 0) >=
      (roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0)
    );
  },

  // Generate secure random string
  generateSecureToken: (length: number = 32): string => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },
};

// Error handling for security issues
export class SecurityError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'SecurityError';
  }
}

// Common security error codes
export const SecurityErrorCodes = {
  INVALID_INPUT: 'INVALID_INPUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  RATE_LIMITED: 'RATE_LIMITED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  CORS_ERROR: 'CORS_ERROR',
  CONTENT_TOO_LARGE: 'CONTENT_TOO_LARGE',
} as const;
