import SortButton from "@/components/Table/SortButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

/**
 * Returns the column definitions for the Activity Table.
 * @returns {Array}
 */
export function activityColumns() {
  return [
    {
      accessorKey: "activity",
      header: ({ column }) => (
        <SortButton column={column}>Activity</SortButton>
      ),
      cell: ({ row }) => (
        <div className="ms-4 text-left text-foreground uppercase">
          {row.getValue("activity")}
        </div>
      ),
    },
    {
      accessorKey: "details",
      header: ({ column }) => (
        <SortButton column={column}>Details</SortButton>
      ),
      cell: ({ row }) => (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger className="w-42 truncate text-left md:w-52 lg:w-64">
              {row.getValue("details")}
            </TooltipTrigger>
            <TooltipContent className="max-w-48 text-wrap">
              {row.getValue("details")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: "timestamp",
      header: ({ column }) => (
        <SortButton column={column}>Timestamp</SortButton>
      ),
      cell: ({ row }) => {
        const timestamp = row.getValue("timestamp");
        const date = new Date(timestamp);
        return (
          <div className="text-left text-xs text-muted-foreground">
            {timestamp
              ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
              : "Invalid Date"}
          </div>
        );
      },
    },
    {
      accessorKey: "user_name",
      header: ({ column }) => (
        <SortButton column={column}>User</SortButton>
      ),
      cell: ({ row }) => {
        const userName = row.getValue("user_name");
        return (
          <div className="flex w-24 items-center truncate text-left text-foreground md:w-28 lg:w-32">
            {userName}
          </div>
        );
      },
    },
  ];
}
