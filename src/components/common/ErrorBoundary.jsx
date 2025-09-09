/**
 * Error Boundary Components
 * 
 * React error boundaries for graceful error handling
 */

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Base Error Boundary Component
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to monitoring service
    this.logError(error, errorInfo);
  }

  logError = (error, errorInfo) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      component: this.props.fallbackComponent?.name || 'Unknown'
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 React Error Boundary');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Error Data:', errorData);
      console.groupEnd();
    }

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production' && this.props.onError) {
      this.props.onError(errorData);
    }
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      // Default fallback UI
      return (
        <div className="min-h-[200px] flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle>Something went wrong</CardTitle>
              </div>
              <CardDescription>
                {this.props.message || 'An unexpected error occurred in this component.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-mono text-muted-foreground">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={this.handleRetry} size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Page-level Error Boundary
export const PageErrorBoundary = ({ children, pageName }) => (
  <ErrorBoundary
    fallback={(error, retry) => (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <CardTitle>Page Error</CardTitle>
            </div>
            <CardDescription>
              The {pageName || 'current'} page encountered an error and couldn't load properly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {process.env.NODE_ENV === 'development' && error && (
              <details className="p-3 bg-muted rounded-md">
                <summary className="text-sm font-medium cursor-pointer">
                  Error Details
                </summary>
                <pre className="text-xs mt-2 overflow-auto">
                  {error.message}
                </pre>
              </details>
            )}
            <div className="flex gap-2">
              <Button onClick={retry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )}
    message={`Error in ${pageName || 'page'}`}
  >
    {children}
  </ErrorBoundary>
);

// Component-level Error Boundary
export const ComponentErrorBoundary = ({ children, componentName }) => (
  <ErrorBoundary
    fallback={(error, retry) => (
      <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-md">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <span className="text-sm font-medium text-destructive">
            Component Error
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          The {componentName || 'component'} failed to render.
        </p>
        <Button size="sm" variant="outline" onClick={retry}>
          <RefreshCw className="h-3 w-3 mr-2" />
          Retry
        </Button>
      </div>
    )}
    message={`Error in ${componentName || 'component'}`}
  >
    {children}
  </ErrorBoundary>
);

// HOC for wrapping components with error boundaries
export const withErrorBoundary = (Component, options = {}) => {
  const WrappedComponent = (props) => (
    <ComponentErrorBoundary componentName={options.componentName || Component.name}>
      <Component {...props} />
    </ComponentErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Async Error Boundary for handling promise rejections
export class AsyncErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidMount() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handleRejection);
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handleRejection);
  }

  handleRejection = (event) => {
    this.setState({ 
      hasError: true, 
      error: new Error(event.reason || 'Unhandled promise rejection') 
    });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">
            An async error occurred: {this.state.error?.message}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}