/**
 * DataTablePagination.jsx
 *
 * Pagination controls for the DataTable.
 * - Shows current page, total pages, and rows per page selector.
 * - Allows navigation between pages.
 * - Uses Tailwind CSS for styling.
 * - Receives the table instance as prop and reads pagination state from it.
 *
 * Usage:
 * <DataTablePagination table={table} />
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export function DataTablePagination({ table }) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();

  const handlePageSizeChange = (newSize) => {
    table.setPageSize(Number(newSize));
    table.setPageIndex(0);
  };

  return (
    <div className="flex items-center justify-end gap-4 py-2">
      <div className="text-sm text-muted-foreground">
        Page <span>{pageIndex + 1}</span> of <span>{pageCount}</span>
      </div>
      <div className="flex items-center gap-2">
        <Select value={pageSize.toString() || "10"} onValueChange={handlePageSizeChange}>
          <SelectTrigger className="h-8 w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}