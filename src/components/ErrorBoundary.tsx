'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

// Define the props interface
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

// Define the state interface
interface State {
  hasError: boolean;
  errorMessage: string;
  errorStack: string;
}

/**
 * Error Boundary Component
 *
 * This component catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 *
 * Error boundaries are React components that catch JavaScript errors anywhere in their
 * child component tree, log those errors, and display a fallback UI instead of the
 * component tree that crashed.
 *
 * @example
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
      errorStack: '',
    };
  }

  // This lifecycle method is called when an error is thrown in a descendant component
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'An error occurred',
      errorStack: error.stack || '',
    };
  }

  // This lifecycle method is called after an error has been thrown in a descendant component
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          errorMessage={this.state.errorMessage}
          errorStack={this.state.errorStack}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default error fallback component
 */
function ErrorFallback({
  errorMessage,
  errorStack,
}: {
  errorMessage: string;
  errorStack: string;
}) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-6'>
      <div className='bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center'>
        <div className='text-6xl mb-4'>😔</div>
        <h1 className='text-2xl font-bold text-gray-800 mb-4'>
          Oops! Something went wrong
        </h1>
        <p className='text-gray-600 mb-6'>
          We&apos;re sorry, but something unexpected happened. Please try
          refreshing the page.
        </p>

        {process.env.NODE_ENV === 'development' && errorMessage && (
          <details className='text-left bg-gray-50 p-4 rounded-lg mb-6'>
            <summary className='cursor-pointer font-semibold text-gray-700 mb-2'>
              Error Details (Development)
            </summary>
            <pre className='text-sm text-red-600 overflow-auto'>
              {errorMessage}
              {errorStack && `\n\n${errorStack}`}
            </pre>
          </details>
        )}

        <button
          onClick={() => window.location.reload()}
          className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300'
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}

/**
 * Hook for throwing errors in function components
 * This is useful for testing error boundaries
 */
export function useErrorHandler() {
  return (error: Error) => {
    throw error;
  };
}

/**
 * Higher-order component that wraps a component with an error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
