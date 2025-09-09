/**
 * Application Monitoring Utilities
 * 
 * Error tracking, performance monitoring, and analytics
 */

// Error reporting service
class ErrorReporter {
  constructor() {
    this.errors = [];
    this.maxErrors = 50; // Keep last 50 errors
  }

  report(errorData) {
    const enrichedError = {
      ...errorData,
      id: this.generateId(),
      severity: this.determineSeverity(errorData),
      fingerprint: this.createFingerprint(errorData)
    };

    this.errors.unshift(enrichedError);
    if (this.errors.length > this.maxErrors) {
      this.errors.pop();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error reported:', enrichedError);
    }

    // In production, send to external service (e.g., Sentry, LogRocket)
    this.sendToService(enrichedError);
  }

  generateId() {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  determineSeverity(error) {
    if (error.message?.includes('ChunkLoadError')) return 'medium';
    if (error.message?.includes('Network Error')) return 'low';
    if (error.stack?.includes('TypeError')) return 'high';
    return 'medium';
  }

  createFingerprint(error) {
    const key = `${error.message}_${error.component}`;
    return btoa(key).substr(0, 16);
  }

  sendToService(error) {
    // Implement your error tracking service here
    // Example: Sentry.captureException(error)
    console.log('📊 Error sent to monitoring service:', error.id);
  }

  getErrors() {
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
  }
}

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Set();
  }

  // Track route changes and load times
  trackRouteChange(routeName, loadTime) {
    const metric = {
      type: 'route_change',
      route: routeName,
      loadTime,
      timestamp: Date.now()
    };

    this.recordMetric('route_performance', metric);
  }

  // Track component render times
  trackComponentRender(componentName, renderTime) {
    if (renderTime > 16) { // Only track slow renders (>16ms for 60fps)
      const metric = {
        type: 'slow_render',
        component: componentName,
        renderTime,
        timestamp: Date.now()
      };

      this.recordMetric('render_performance', metric);
    }
  }

  // Track user interactions
  trackUserAction(action, details = {}) {
    const metric = {
      type: 'user_action',
      action,
      details,
      timestamp: Date.now()
    };

    this.recordMetric('user_interactions', metric);
  }

  // Track API performance
  trackApiCall(endpoint, method, duration, status) {
    const metric = {
      type: 'api_call',
      endpoint,
      method,
      duration,
      status,
      timestamp: Date.now()
    };

    this.recordMetric('api_performance', metric);
  }

  recordMetric(category, metric) {
    if (!this.metrics.has(category)) {
      this.metrics.set(category, []);
    }

    const categoryMetrics = this.metrics.get(category);
    categoryMetrics.push(metric);

    // Keep only last 100 metrics per category
    if (categoryMetrics.length > 100) {
      categoryMetrics.shift();
    }

    // Notify observers
    this.notifyObservers(category, metric);
  }

  getMetrics(category) {
    return this.metrics.get(category) || [];
  }

  getAllMetrics() {
    return Object.fromEntries(this.metrics);
  }

  addObserver(callback) {
    this.observers.add(callback);
  }

  removeObserver(callback) {
    this.observers.delete(callback);
  }

  notifyObservers(category, metric) {
    this.observers.forEach(callback => {
      try {
        callback(category, metric);
      } catch (error) {
        console.error('Observer error:', error);
      }
    });
  }

  // Generate performance report
  generateReport() {
    const report = {
      timestamp: Date.now(),
      summary: {},
      details: this.getAllMetrics()
    };

    // Generate summary statistics
    this.metrics.forEach((metrics, category) => {
      report.summary[category] = {
        count: metrics.length,
        latest: metrics[metrics.length - 1]?.timestamp,
        oldest: metrics[0]?.timestamp
      };
    });

    return report;
  }
}

// Web Vitals tracking
class WebVitalsTracker {
  constructor() {
    this.vitals = {};
    this.trackCLS();
    this.trackLCP();
    this.trackFID();
  }

  trackCLS() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        let clsScore = 0;
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
          }
        });
        this.vitals.CLS = clsScore;
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  trackLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.vitals.LCP = lastEntry.startTime;
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  trackFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.vitals.FID = entry.processingStart - entry.startTime;
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  getVitals() {
    return this.vitals;
  }
}

// Create singleton instances
export const errorReporter = new ErrorReporter();
export const performanceMonitor = new PerformanceMonitor();
export const webVitalsTracker = new WebVitalsTracker();

// Convenience hooks for React components
export const useErrorReporting = () => {
  return {
    reportError: (error, context) => {
      errorReporter.report({
        ...error,
        context,
        timestamp: Date.now()
      });
    },
    getErrors: () => errorReporter.getErrors()
  };
};

export const usePerformanceTracking = () => {
  return {
    trackRender: (componentName, renderTime) => {
      performanceMonitor.trackComponentRender(componentName, renderTime);
    },
    trackAction: (action, details) => {
      performanceMonitor.trackUserAction(action, details);
    },
    getMetrics: (category) => performanceMonitor.getMetrics(category)
  };
};

// Global error handler setup
export const setupGlobalErrorHandling = () => {
  // Unhandled JavaScript errors
  window.addEventListener('error', (event) => {
    errorReporter.report({
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      type: 'javascript_error'
    });
  });

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorReporter.report({
      message: event.reason?.message || String(event.reason),
      stack: event.reason?.stack,
      type: 'unhandled_promise_rejection'
    });
  });

  // Resource loading errors
  window.addEventListener('error', (event) => {
    if (event.target !== window) {
      errorReporter.report({
        message: `Failed to load resource: ${event.target.src || event.target.href}`,
        element: event.target.tagName,
        type: 'resource_error'
      });
    }
  }, true);
};