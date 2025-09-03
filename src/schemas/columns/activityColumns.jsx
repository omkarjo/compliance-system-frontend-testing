import { DataTableColumnHeader } from "@/components/Table/DataTableColumnHeader";
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
        <DataTableColumnHeader column={column} title="Activity" />
      ),
      cell: ({ row }) => (
        <div className="ms-4 text-left uppercase">
          {row.getValue("activity")}
        </div>
      ),
    },
    {
      accessorKey: "details",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Details" />
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
        <DataTableColumnHeader column={column} title="Timestamp" />
      ),
      cell: ({ row }) => {
        const timestamp = row.getValue("timestamp");
        const date = new Date(timestamp);
        return (
          <div className="text-left text-xs text-gray-500">
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
        <DataTableColumnHeader column={column} title="User" />
      ),
      cell: ({ row }) => {
        const userName = row.getValue("user_name");
        return (
          <div className="flex w-24 items-center truncate text-left md:w-28 lg:w-32">
            {userName}
          </div>
        );
      },
    },
  ];
}
