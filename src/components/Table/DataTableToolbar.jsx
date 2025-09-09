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

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex-1">
        {showGlobalSearch && searchableColumns.length > 0 ? (
          <div className="flex max-w-xl items-center rounded-lg border bg-white shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-300">
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="h-10 border-none bg-transparent focus:ring-0 focus:outline-none">
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
            <div className="mx-2 h-6 w-px bg-gray-300" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1 border-none shadow-none focus:outline-none focus-visible:ring-0"
            />
          </div>
        ) : (
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="max-w-xl transition-all duration-300 focus:ring-2 focus:ring-blue-300"
          />
        )}
      </div>
      <div className="flex items-center justify-end gap-4">
        {Array.isArray(filterableColumns) && filterableColumns.length > 0 && (
          <FiltersTable table={table} filterOptions={filterableColumns} />
        )}
        {children}
      </div>
    </div>
  );
}
