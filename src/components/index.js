/**
 * Master Components Index
 * 
 * This file provides organized exports for all components in the application.
 * Import patterns:
 * 
 * // Import specific business components
 * import { TableTaskViewFM, FundDetails } from '@/components/business';
 * 
 * // Import common utilities
 * import { BadgeStatusTask, UserBadge } from '@/components/common';
 * 
 * // Import UI primitives
 * import { Button, Card } from '@/components/ui';
 * 
 * // Import everything from a domain
 * import * as TaskComponents from '@/components/business/tasks';
 */

// Business Domain Components
export * from './business';

// Common/Shared Components  
export * from './common';

// UI Components (shadcn/ui)
export * from './ui';

// Table Components
export * from './Table';

// Form Components  
export * from './Form';

// Layout Components
export * from './layout';