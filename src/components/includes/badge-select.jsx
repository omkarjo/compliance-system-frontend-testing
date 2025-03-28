import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getStatusIcon, getStatusStyle } from "@/lib/getStatusStyleIcon";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const STATUS_OPTIONS = [
  { label: "Open", value: "Open" },
  { label: "Pending", value: "Pending" },
  { label: "Completed", value: "Completed" },
  { label: "Overdue", value: "Overdue" },
  { label: "Blocked", value: "Blocked" },
];

export default function BadgeStatusSelector({
  defaultStatus = "Open",
  onStatusChange,
  options = STATUS_OPTIONS,
  isUpdating = false, // Mutation state
}) {
  const [selectedStatus, setSelectedStatus] = useState(defaultStatus);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isUpdating) {
      setSelectedStatus(defaultStatus);
    }
  }, [defaultStatus, isUpdating]);

  const handleStatusChange = (status, event) => {
    event.stopPropagation();
    setSelectedStatus(status);
    setOpen(false);
    onStatusChange?.(status);
  };

  const { bgColor, textColor, borderColor } = getStatusStyle(selectedStatus);
  const icon = getStatusIcon(selectedStatus);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            bgColor,
            textColor,
            borderColor,
            "flex cursor-pointer items-center space-x-2 rounded-md px-1 py-2 hover:opacity-90",
            isUpdating && "opacity-50 cursor-not-allowed"
          )}
          onClick={(e) => {
            e.stopPropagation();
            if (!isUpdating) setOpen(true);
          }}
          disabled={isUpdating}
        >
          {icon}
          <span className="ml-0">
            {options.find((opt) => opt.value === selectedStatus)?.label}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        <div className="grid gap-2">
          {options
            .filter((opt) => opt.value !== selectedStatus)
            .map((status) => {
              const { bgColor, textColor } = getStatusStyle(status.value);
              const statusIcon = getStatusIcon(status.value);

              return (
                <Button
                  key={status.value}
                  variant="ghost"
                  className={cn(
                    bgColor,
                    textColor,
                    "flex w-full items-center justify-start space-x-2"
                  )}
                  onClick={(event) => handleStatusChange(status.value, event)}
                  disabled={isUpdating}
                >
                  {statusIcon}
                  <span className="ml-2">{status.label}</span>
                </Button>
              );
            })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
