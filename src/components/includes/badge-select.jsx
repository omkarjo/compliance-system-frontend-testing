import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getStatusIcon, getStatusStyle } from "@/lib/getStatusStyleIcon";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { label: "Open", value: "Open" },
  { label: "Pending", value: "Pending" },
  { label: "Completed", value: "Completed" },
  { label: "Review Required", value: "Review Required" },
];

export default function BadgeStatusSelector({
  defaultStatus = "Open",
  onChange,
  options = STATUS_OPTIONS,
}) {
  const handleStatusChange = (status, event) => {
    event.stopPropagation();
    if (onChange) {
      onChange(status);
    }
  };

  const { bgColor, textColor, borderColor } = getStatusStyle(defaultStatus);
  const icon = getStatusIcon(defaultStatus);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            bgColor,
            textColor,
            borderColor,
            "flex cursor-pointer items-center space-x-2 rounded-md px-1 py-2 hover:opacity-90",
          )}
        >
          {icon}
          <span className="ml-0">
            {options.find((opt) => opt.value === defaultStatus)?.label}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        <div className="grid gap-2">
          {options
            .filter((opt) => opt.value !== defaultStatus)
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
      </PopoverContent>
    </Popover>
  );
}
