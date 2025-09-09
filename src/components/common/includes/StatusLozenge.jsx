import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Status mapping configuration based on Atlassian Design System guidelines
 * 
 * Task Statuses:
 * - Open: default (neutral gray)
 * - Pending: inProgress (blue)
 * - Completed: success (green)  
 * - Review Required/Under Review: moved (yellow)
 * 
 * Drawdown Statuses:
 * - Pending: inProgress (blue)
 * - Wire Pending: moved (yellow)
 * - Wire Done: success (green)
 * - Unit Allotment: moved (yellow)
 * - Allotment Done: success (green)
 * 
 * Invi Filing Statuses:
 * - Not Applicable/NA: default (neutral gray)
 * - Pending: inProgress (blue)
 * - Document Generated: moved (yellow)
 * - Done: success (green)
 */

const STATUS_MAPPINGS = {
  // Task statuses
  'open': { styles: 'bg-muted text-muted-foreground', text: 'Open' },
  'pending': { styles: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', text: 'Pending' },
  'completed': { styles: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', text: 'Completed' },
  'review required': { styles: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400', text: 'Review Required' },
  'under review': { styles: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400', text: 'Under Review' },
  'review': { styles: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400', text: 'Review' },
  
  // Drawdown statuses
  'drawdown pending': { styles: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', text: 'Drawdown Pending' },
  'drawdown payment pending': { styles: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', text: 'Drawdown Payment Pending' },
  'wire pending': { styles: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400', text: 'Wire Pending' },
  'wire done': { styles: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', text: 'Wire Done' },
  'unit allotment': { styles: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400', text: 'Unit Allotment' },
  'allotment done': { styles: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', text: 'Allotment Done' },
  'active': { styles: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', text: 'Active' },
  
  // Invi Filing statuses
  'not applicable': { styles: 'bg-muted text-muted-foreground', text: 'Not Applicable' },
  'na': { styles: 'bg-muted text-muted-foreground', text: 'N/A' },
  'document generated': { styles: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400', text: 'Document Generated' },
  'done': { styles: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', text: 'Done' },
  
  // Error/Warning statuses
  'over-payment': { styles: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', text: 'Over-payment' },
  'shortfall': { styles: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', text: 'Shortfall' },
  'overdue': { styles: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', text: 'Overdue' },
  'blocked': { styles: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', text: 'Blocked' },
  'error': { styles: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', text: 'Error' },
  
  // KYC statuses
  'onboarded': { styles: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', text: 'Onboarded' },
  'waiting for kyc': { styles: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', text: 'Waiting For KYC' },
  
  // Assignment statuses
  'assigned': { styles: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', text: 'Assigned' },
};

/**
 * StatusLozenge component using native Tailwind classes
 * 
 * @param {string} status - The status text to display
 * @param {string} type - Optional type override for legacy compatibility
 * @param {boolean} isBold - Whether to use bold appearance
 * @param {number} maxWidth - Maximum width for the lozenge
 * @returns {JSX.Element}
 */
export default function StatusLozenge({ 
  status, 
  type, 
  isBold = false, 
  maxWidth = 200,
  className = '' 
}) {
  // Normalize the status string for mapping lookup
  const normalizedStatus = (type || status || '').toLowerCase().trim();
  
  // Get the mapping or use default
  const mapping = STATUS_MAPPINGS[normalizedStatus] || {
    styles: 'bg-muted text-muted-foreground',
    text: status || type || 'Unknown'
  };
  
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium truncate",
        isBold && "font-semibold",
        mapping.styles,
        className
      )}
      style={maxWidth ? { maxWidth: `${maxWidth}px` } : undefined}
    >
      {mapping.text}
    </span>
  );
}

/**
 * Legacy compatibility function to maintain existing API
 */
export function BadgeStatusTask({ text, type, className }) {
  return (
    <StatusLozenge 
      status={text} 
      type={type} 
      className={className}
    />
  );
}

// StatusLozenge is already the default export above