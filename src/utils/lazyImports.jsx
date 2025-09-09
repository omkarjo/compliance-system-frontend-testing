/**
 * Lazy Import Utilities
 * 
 * Centralized lazy loading for performance optimization
 */

import { lazy } from 'react';

// Loading fallback component
export const ComponentLoader = ({ className = "h-32" }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Enhanced loading component with skeleton
export const PageLoader = () => (
  <div className="space-y-4 p-4">
    <div className="h-8 bg-muted animate-pulse rounded"></div>
    <div className="h-32 bg-muted animate-pulse rounded"></div>
    <div className="grid grid-cols-3 gap-4">
      <div className="h-24 bg-muted animate-pulse rounded"></div>
      <div className="h-24 bg-muted animate-pulse rounded"></div>
      <div className="h-24 bg-muted animate-pulse rounded"></div>
    </div>
  </div>
);