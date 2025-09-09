/**
 * DataTableToolbar.jsx
 *
 * Toolbar for the DataTable.
 * Supports:
 * - Global search input (with optional search type selector)
 * - Filter controls (uses filterableColumns prop)
 * - Column view options slot (passed as children)
 *
 * Usage:
 * <DataTableToolbar
 *   table={table}
 *   filterableColumns={filterableColumns}
 *   searchableColumns={searchableColumns}
 *   showGlobalSearch={showGlobalSearch}
 *   searchPlaceholder={searchPlaceholder}
 * >
 *   {toolbarContent}
 *   <DataTableViewOptions table={table} />
 * </DataTableToolbar>
 */

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import FiltersTable from "./FiltersTable";

export function DataTableToolbar({
  table,
  filterableColumns = [],
  searchableColumns = [],
  showGlobalSearch = true,
  searchPlaceholder = "Search...",
  children,
}) {
  const [searchValue, setSearchValue] = React.useState(
    table.getState().globalFilter || "",
  );
  const [searchType, setSearchType] = React.useState(
    searchableColumns.length > 0 ? searchableColumns[0].id : "",
  );

  React.useEffect(() => {
    setSearchValue(table.getState().globalFilter || "");
  }, [table.getState().globalFilter]);

  React.useEffect(() => {
    table.setGlobalFilter(searchValue);
  }, [searchValue, table]);

  React.useEffect(() => {
    setSearchValue("");
    table.setGlobalFilter("");
  }, [searchType, table]);

  // Get current filters from table state
  const filters = table.getState().columnFilters || [];

  return (
    <div className="space-y-4 py-4">
      {/* Main Search Container - Full Width */}
      <div className="relative">
        <div className="flex h-9 w-full items-center rounded-lg border bg-background shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-ring hover:shadow-md">
          {/* Search Type Selector - Only if multiple searchable columns */}
          {showGlobalSearch && searchableColumns.length > 1 && (
            <>
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="h-9 w-auto border-none bg-transparent focus:ring-0 focus:outline-none">
                  <SelectValue placeholder="Search type" />
                </SelectTrigger>
                <SelectContent>
                  {searchableColumns.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mx-2 h-5 w-px bg-border" />
            </>
          )}

          {/* Filter Tags Container */}
          <div className="flex flex-1 flex-wrap items-center gap-1 px-3 py-1">
            {/* Display existing filter chips inline */}
            <FiltersTable 
              table={table} 
              filterOptions={filterableColumns}
              inline={true}
            />
            
            {/* Search Input */}
            {showGlobalSearch && (
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="flex-1 min-w-[200px] border-none bg-transparent p-0 shadow-none focus:outline-none focus-visible:ring-0 placeholder:text-muted-foreground text-foreground h-7"
              />
            )}
          </div>

          {/* Integrated Action Buttons */}
          <div className="flex items-center gap-1 px-2">
            {/* Filter Button - Only show if not showing inline */}
            {Array.isArray(filterableColumns) && filterableColumns.length > 0 && (
              <FiltersTable 
                table={table} 
                filterOptions={filterableColumns}
                buttonOnly={true}
              />
            )}
            
            {/* View Options */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
