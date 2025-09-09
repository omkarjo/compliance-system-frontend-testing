/**
 * DataTable.jsx
 *
 * Modular React Table component using @tanstack/react-table and Tailwind CSS.
 *
 * Features:
 * - Column sorting, filtering, visibility (per-column `filterFn` & `sortFn` supported)
 * - Manual or client-side pagination
 * - Global search and column filters
 * - Row selection and custom row click
 * - Customizable toolbar and footer
 * - Loading and empty states
 * - Responsive and themeable with Tailwind CSS
 * - Table metadata/functions via `meta` prop (usable in columns or cells)
 *
 * Usage:
 *
 * import { DataTable } from "./table/DataTable";
 *
 * <DataTable
 *   columns={columns}
 *   data={data}
 *   meta={{ onRowEdit, onRowDelete }}
 *   filterableColumns={[{ ... }]}
 *   searchableColumns={[{ id: "name", title: "Name" }]}
 *   onRowClick={row => ...}
 * />
 *
 * Example column using table meta:
 * {
 *   accessorKey: "name",
 *   header: "Name",
 *   filterFn: ...,
 *   sortFn: ...,
 *   cell: ({ row, table }) =>
 *     <button onClick={() => table.options.meta.onRowEdit(row.original)}>
 *       Edit {row.getValue("name")}
 *     </button>
 * }
 */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTableViewOptions } from "./DataTableViewOptions";

export function DataTable({
  columns,
  data,
  meta = {},
  manualPagination = false,
  manualSorting = false,
  manualFiltering = false,
  pageCount,
  rowCount,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  columnFilters,
  onColumnFiltersChange,
  globalFilter,
  onGlobalFilterChange,
  filterableColumns = [],
  searchableColumns = [],
  searchPlaceholder = "Search...",
  onRowClick,
  isLoading = false,
  isFetching = false,
  emptyMessage = "No results found.",
  showColumnToggle = true,
  showGlobalSearch = true,
  showToolbar = true,
  showPagination = true,
  showSelectionText = true,
  toolbarContent,
  footerContent,
}) {
  const [internalSorting, setInternalSorting] = useState([]);
  const [internalFilters, setInternalFilters] = useState([]);
  const [internalGlobalFilter, setInternalGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [internalPagination, setInternalPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const paginationState = pagination ?? internalPagination;
  const setPaginationState = onPaginationChange ?? setInternalPagination;
  const sortingState = sorting ?? internalSorting;
  const setSortingState = onSortingChange ?? setInternalSorting;
  const columnFiltersState = columnFilters ?? internalFilters;
  const setColumnFiltersState = onColumnFiltersChange ?? setInternalFilters;
  const globalFilterState = globalFilter ?? internalGlobalFilter;
  const setGlobalFilterState = onGlobalFilterChange ?? setInternalGlobalFilter;

  const table = useReactTable({
    data,
    columns,
    pageCount,
    rowCount,
    state: {
      sorting: sortingState,
      columnFilters: columnFiltersState,
      columnVisibility,
      rowSelection,
      pagination: paginationState,
      globalFilter: globalFilterState,
    },
    initialState: {
      pagination: paginationState,
    },
    enableRowSelection: true,
    manualPagination,
    manualSorting,
    manualFiltering,
    onSortingChange: setSortingState,
    onColumnFiltersChange: setColumnFiltersState,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPaginationState,
    onGlobalFilterChange: setGlobalFilterState,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta,
  });

  useEffect(() => {
    if (!manualPagination || !manualFiltering || !manualSorting) {
      table.resetPageIndex();
    }
  }, [
    table,
    columnFiltersState,
    globalFilterState,
    manualPagination,
    manualFiltering,
    manualSorting,
  ]);

  return (
    <div className="w-full space-y-4">
      {showToolbar && (
        <DataTableToolbar
          table={table}
          filterableColumns={filterableColumns}
          searchableColumns={searchableColumns}
          showGlobalSearch={showGlobalSearch}
          searchPlaceholder={searchPlaceholder}
        >
          {toolbarContent}
          {showColumnToggle && (
            <DataTableViewOptions table={table} isFetching={isFetching} />
          )}
        </DataTableToolbar>
      )}

      <div className="rounded-md border bg-white dark:bg-gray-950">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`loading-${i}`}>
                  {Array.from({ length: columns.length }).map((_, j) => (
                    <TableCell key={`loading-cell-${i}-${j}`}>
                      <div className="bg-muted h-4 w-full animate-pulse rounded"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={
                    onRowClick ? "hover:bg-muted/50 cursor-pointer" : undefined
                  }
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2">
        {showSelectionText && !footerContent && (
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <span>
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </span>
            )}
          </div>
        )}
        {footerContent}
        {showPagination && <DataTablePagination table={table} />}
      </div>
    </div>
  );
}
