import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStatusIcon, getStatusStyle } from "@/lib/getStatusStyleIcon";
import { cn } from "@/lib/utils";
import { set } from "date-fns";
import { useEffect, useState } from "react";

const STATUS_OPTIONS = [
  { label: "Open", value: "Open" },
  { label: "Pending", value: "Pending" },
  { label: "Completed", value: "Completed" },
  { label: "Overdue", value: "Overdue" },
  { label: "Blocked", value: "Blocked" },
];

export default function StatusBadgeSelectorConstrained({
  defaultStatus = "Open",
  constrainedType = "text",
  options = STATUS_OPTIONS,
  isUpdating = false,
}) {
  const [selectedStatus, setSelectedStatus] = useState(defaultStatus);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { bgColor, textColor, borderColor } = getStatusStyle(selectedStatus);
  const icon = getStatusIcon(selectedStatus);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          bgColor,
          textColor,
          borderColor,
          "flex cursor-pointer items-center space-x-2 rounded-md px-1 py-2 hover:opacity-90",
          isUpdating && "cursor-not-allowed opacity-50",
        )}
        onClick={(e) => {
          e.stopPropagation();
          setDialogOpen(true);
        }}
      >
        {icon}
        <span className="ml-0">
          {options.find((opt) => opt.value === selectedStatus)?.label}
        </span>
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Status</DialogTitle>
            <DialogDescription>
                Select a new status for the task.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full">
            <Select
              className="w-full max-w-none"
              onValueChange={(value) => {
                setSelectedStatus(value);
              }}
            >
              <SelectTrigger className={`w-full`}>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => {
                  const { bgColor, textColor, borderColor } = getStatusStyle(
                    option.value,
                  );
                  const icon = getStatusIcon(option.value);
                  return (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className={cn(
                        "flex items-center space-x-2 rounded-md mx-2 my-1 py-2 hover:opacity-90",
                        bgColor,
                        textColor,
                        borderColor,
                      )}
                    >
                      {icon}
                      <span className="ml-0">{option.label}</span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
        </DialogContent>
      </Dialog>
    </>
  );
}
