/**
 * DataTableViewOptions.jsx
 *
 * Dropdown for toggling column visibility in the table.
 * Use in toolbar or above table.
 */

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Loader, SlidersHorizontal } from "lucide-react";

/**
 * @template TData
 * @param {{ table: import("@tanstack/react-table").Table<TData>, isFetching?: boolean }} props
 */
export function DataTableViewOptions({ table, isFetching }) {
  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            size="sm"
            className={cn(
              "group flex h-7 px-2 items-center gap-1 rounded-md text-xs transition-colors hover:bg-accent",
            )}
          >
            <SlidersHorizontal className="size-3.5 shrink-0 transition-all" />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide(),
            )
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize hover:!bg-accent focus:!bg-accent hover:!text-accent-foreground focus:!text-accent-foreground"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {isFetching && (
        <div className="border-border-muted flex items-center rounded-md border-2 p-1.5">
          <Loader className="text-muted-foreground h-4 w-4 animate-spin" />
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
}
