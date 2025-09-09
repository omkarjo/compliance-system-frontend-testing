import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Status mapping configuration for selectable status options
 * Uses the same mappings as StatusLozenge component
 */
const STATUS_STYLE_MAP = {
  // Task statuses
  'open': 'bg-muted text-muted-foreground',
  'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  'completed': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'review required': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  'under review': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  'review': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  
  // Drawdown statuses
  'drawdown pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  'drawdown payment pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  'wire pending': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  'wire done': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'unit allotment': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  'allotment done': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'active': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  
  // Invi Filing statuses
  'not applicable': 'bg-muted text-muted-foreground',
  'na': 'bg-muted text-muted-foreground',
  'document generated': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  'done': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  
  // Error/Warning statuses
  'over-payment': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  'shortfall': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  'overdue': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  'blocked': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  'error': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  
  // KYC statuses
  'onboarded': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  'waiting for kyc': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  
  // Assignment statuses
  'assigned': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  
  // Default fallback
  'default': 'bg-muted text-muted-foreground'
};

const DEFAULT_STATUS_OPTIONS = [
  { label: "Open", value: "Open" },
  { label: "Pending", value: "Pending" },
  { label: "Completed", value: "Completed" },
  { label: "Review Required", value: "Review Required" },
];

export default function StatusLozengeSelector({
  defaultStatus = "Open",
  onChange,
  options = DEFAULT_STATUS_OPTIONS,
  disabledPropagation = true,
}) {
  const [open, setOpen] = useState(false);

  const handleStatusChange = (status, event) => {
    if (disabledPropagation) {
      event.stopPropagation();
    }

    if (onChange) {
      onChange(status);
    }
    setOpen(false); // Close the popover
  };

  const hasOptions = Array.isArray(options) && options.length > 0;
  const finalOptions = hasOptions ? options : [];

  const currentStatus = finalOptions.find(
    (opt) => opt.value === defaultStatus,
  ) || {
    label: defaultStatus,
    value: defaultStatus,
  };

  const getStylesForStatus = (status) => {
    const normalizedStatus = status.toLowerCase().trim();
    return STATUS_STYLE_MAP[normalizedStatus] || STATUS_STYLE_MAP['default'];
  };

  const hasAlternativeOptions =
    finalOptions.filter((opt) => opt.value !== currentStatus.value).length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          data-type="status-selector"
          variant="ghost"
          size="sm"
          className={cn(
            "h-auto p-1 font-normal hover:bg-transparent",
            hasAlternativeOptions && "hover:bg-accent/50"
          )}
          onClick={(event) => {
            if (disabledPropagation) {
              event.stopPropagation();
            }
          }}
          disabled={!hasAlternativeOptions}
        >
          <div className="flex items-center gap-1">
            <span 
              className={cn(
                "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium max-w-[120px] truncate",
                getStylesForStatus(currentStatus.value)
              )}
            >
              {currentStatus.label}
            </span>
            {hasAlternativeOptions && (
              <ChevronDown className="h-3 w-3 opacity-50" />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      
      {hasAlternativeOptions && (
        <PopoverContent 
          className="w-auto p-2" 
          align="start"
          onClick={(event) => {
            if (disabledPropagation) {
              event.stopPropagation();
            }
          }}
        >
          <div className="flex flex-col gap-1">
            {finalOptions.map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                size="sm"
                className="h-auto justify-start p-1 font-normal"
                onClick={(event) => handleStatusChange(option.value, event)}
              >
                <span 
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium max-w-[120px] truncate",
                    getStylesForStatus(option.value)
                  )}
                >
                  {option.label}
                </span>
              </Button>
            ))}
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}

// Export both for compatibility
export { StatusLozengeSelector };