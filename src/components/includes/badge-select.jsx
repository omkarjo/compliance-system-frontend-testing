import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getStatusIcon, getStatusStyle } from "@/lib/getStatusStyleIcon";
import { cn } from "@/lib/utils";
import { useState } from "react";

const STATUS_OPTIONS = [
  // { label: "Open", value: "Open" },
  // { label: "Pending", value: "Pending" },
  { label: "Completed", value: "Completed" },
  // { label: "Review Required", value: "Review Required" },
];

export default function BadgeStatusSelector({
  defaultStatus = "Open",
  onChange,
  options = STATUS_OPTIONS,
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

  const { bgColor, textColor, borderColor } = getStatusStyle(
    currentStatus.value,
  );
  const icon = getStatusIcon(currentStatus.value);

  const hasAlternativeOptions =
    finalOptions.filter((opt) => opt.value !== currentStatus.value).length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          data-type="status-selector"
          variant="outline"
          className={cn(
            bgColor,
            textColor,
            borderColor,
            "flex cursor-pointer items-center space-x-2 rounded-md px-1 py-2 hover:opacity-90",
          )}
        >
          {icon}
          <span className="ml-0">{currentStatus.label}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn("w-56 p-2", !hasAlternativeOptions && "w-36")}
      >
        {hasAlternativeOptions ? (
          <div className="grid gap-2">
            {finalOptions
              .filter((opt) => opt.value !== currentStatus.value)
              .map((status) => {
                const { bgColor, textColor } = getStatusStyle(status.value);
                const statusIcon = getStatusIcon(status.value);

                return (
                  <Button
                    key={status.value}
                    data-role="status-option"
                    variant="ghost"
                    className={cn(
                      bgColor,
                      textColor,
                      "flex w-full items-center justify-start space-x-2",
                    )}
                    onClick={(event) => handleStatusChange(status.value, event)}
                  >
                    {statusIcon}
                    <span className="ml-2">{status.label}</span>
                  </Button>
                );
              })}
          </div>
        ) : (
          <div
            className="text-muted-foreground p-2 text-center text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <p>No Options</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
