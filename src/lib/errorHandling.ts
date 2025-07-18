// Production-ready error handling utilities

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  userId?: string;
  context?: string;
}

export class AppError extends Error {
  public code: string;
  public details?: any;
  public timestamp: Date;
  public userId?: string;
  public context?: string;

  constructor(
    code: string,
    message: string,
    details?: any,
    userId?: string,
    context?: string
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
    if (userId) this.userId = userId;
    if (context) this.context = context;
  }
}

// Error codes for consistent error handling
export const ErrorCodes = {
  // Authentication errors
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
  AUTH_EXPIRED_TOKEN: 'AUTH_EXPIRED_TOKEN',

  // Premium/credit errors
  INSUFFICIENT_CREDITS: 'INSUFFICIENT_CREDITS',
  CREDIT_DEDUCTION_FAILED: 'CREDIT_DEDUCTION_FAILED',
  PREMIUM_REQUIRED: 'PREMIUM_REQUIRED',

  // Wish errors
  WISH_LIMIT_EXCEEDED: 'WISH_LIMIT_EXCEEDED',
  WISH_NOT_FOUND: 'WISH_NOT_FOUND',
  WISH_CREATION_FAILED: 'WISH_CREATION_FAILED',

  // API errors
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INVALID_REQUEST: 'INVALID_REQUEST',
  SERVER_ERROR: 'SERVER_ERROR',

  // Database errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',

  // Payment errors
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  PAYMENT_INVALID: 'PAYMENT_INVALID',
} as const;

// User-friendly error messages
export const ErrorMessages = {
  [ErrorCodes.AUTH_REQUIRED]: 'Please sign in to continue',
  [ErrorCodes.AUTH_INVALID_TOKEN]:
    'Your session has expired. Please sign in again',
  [ErrorCodes.AUTH_EXPIRED_TOKEN]:
    'Your session has expired. Please sign in again',

  [ErrorCodes.INSUFFICIENT_CREDITS]:
    "You don't have enough credits for this action",
  [ErrorCodes.CREDIT_DEDUCTION_FAILED]:
    'Failed to process credit transaction. Please try again',
  [ErrorCodes.PREMIUM_REQUIRED]: 'This feature requires a premium subscription',

  [ErrorCodes.WISH_LIMIT_EXCEEDED]: "You've reached your monthly wish limit",
  [ErrorCodes.WISH_NOT_FOUND]: 'The requested wish could not be found',
  [ErrorCodes.WISH_CREATION_FAILED]: 'Failed to create wish. Please try again',

  [ErrorCodes.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please try again later',
  [ErrorCodes.INVALID_REQUEST]: 'Invalid request. Please check your input',
  [ErrorCodes.SERVER_ERROR]: 'Something went wrong. Please try again later',

  [ErrorCodes.DATABASE_ERROR]: 'Database error. Please try again later',
  [ErrorCodes.CONNECTION_ERROR]:
    'Connection error. Please check your internet connection',

  [ErrorCodes.PAYMENT_FAILED]: 'Payment failed. Please try again',
  [ErrorCodes.PAYMENT_INVALID]: 'Invalid payment information',
} as const;

// Error logging function
export function logError(error: Error | AppError, context?: string): void {
  const errorInfo = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context,
    ...(error instanceof AppError && {
      code: error.code,
      details: error.details,
      userId: error.userId,
    }),
  };

  // In production, send to error monitoring service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to Sentry or similar service
    console.error('Production Error:', errorInfo);
  } else {
    // In development, log to console
    console.error('Development Error:', errorInfo);
  }
}

// Create user-friendly error
export function createUserError(
  code: keyof typeof ErrorCodes,
  details?: any,
  userId?: string,
  context?: string
): AppError {
  const message = ErrorMessages[code] || 'An unexpected error occurred';
  return new AppError(code, message, details, userId, context);
}

// Handle async operations with error catching
export async function safeAsync<T>(
  operation: () => Promise<T>,
  context?: string,
  userId?: string
): Promise<{ success: true; data: T } | { success: false; error: AppError }> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    const appError =
      error instanceof AppError
        ? error
        : createUserError(ErrorCodes.SERVER_ERROR, error, userId, context);

    logError(appError, context);
    return { success: false, error: appError };
  }
}

// Handle Firebase errors specifically
export function handleFirebaseError(error: any, context?: string): AppError {
  const errorCode = error?.code || 'unknown';
  const errorMessage = error?.message || 'Unknown Firebase error';

  // Map Firebase error codes to our error codes
  const errorCodeMap: Record<string, keyof typeof ErrorCodes> = {
    'permission-denied': ErrorCodes.AUTH_REQUIRED,
    unauthenticated: ErrorCodes.AUTH_REQUIRED,
    'not-found': ErrorCodes.WISH_NOT_FOUND,
    'already-exists': ErrorCodes.INVALID_REQUEST,
    'resource-exhausted': ErrorCodes.RATE_LIMIT_EXCEEDED,
    'failed-precondition': ErrorCodes.INVALID_REQUEST,
    aborted: ErrorCodes.SERVER_ERROR,
    'out-of-range': ErrorCodes.INVALID_REQUEST,
    unimplemented: ErrorCodes.SERVER_ERROR,
    internal: ErrorCodes.SERVER_ERROR,
    unavailable: ErrorCodes.CONNECTION_ERROR,
    'data-loss': ErrorCodes.DATABASE_ERROR,
  };

  const mappedCode = errorCodeMap[errorCode] || ErrorCodes.SERVER_ERROR;

  return createUserError(
    mappedCode,
    { firebaseCode: errorCode, firebaseMessage: errorMessage },
    undefined,
    context
  );
}

// Format error for API response
export function formatErrorForAPI(error: AppError) {
  return {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && {
        details: error.details,
        timestamp: error.timestamp,
      }),
    },
  };
}

// Check if error is retryable
export function isRetryableError(error: AppError): boolean {
  const retryableCodes = [
    ErrorCodes.CONNECTION_ERROR,
    ErrorCodes.SERVER_ERROR,
    ErrorCodes.DATABASE_ERROR,
  ];

  return retryableCodes.includes(error.code as any);
}

// Retry function with exponential backoff
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      // Check if error is retryable
      if (error instanceof AppError && !isRetryableError(error)) {
        throw error;
      }

      // Wait with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}
