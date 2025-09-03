/**
 * GenericServerDataTable.jsx
 *
 * A generic wrapper component for server-side data fetching that sits on top of your DataTable.
 * Integrates any React Query hook (such as useGetTask) as its fetch provider.
 *
 * Usage:
 * <GenericServerDataTable
 *   columns={columns}
 *   fetchQuery={useGetTask}
 *   filterableColumns={filterableColumns}
 *   searchableColumns={searchableColumns}
 *   searchPlaceholder="Search Task..."
 *   emptyMessage="No tasks found"
 *   onRowClick={row => ...}
 * />
 */

import useDebounce from "@/hooks/useDebounce";
import React, { useMemo, useState } from "react";
import { DataTable } from "./DataTable";

export function ServerDataTable({
  columns,
  fetchQuery, // React Query hook, eg. useGetTask
  filterableColumns = [],
  searchableColumns = [],
  searchPlaceholder = "Search...",
  emptyMessage = "No records found.",
  onRowClick,
  initialPageSize = 20,
  manualSorting = false,
  manualFiltering = true,
  manualPagination = true,
  toolbarContent,
  footerContent,
}) {
  // Table state
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Debounced search value
  const debouncedGlobalFilter = useDebounce(globalFilter, 400);

  // Compose fetch params for the query hook
  const fetchParams = useMemo(
    () => ({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sortBy: sorting,
      filters: columnFilters,
      search: debouncedGlobalFilter,
    }),
    [
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      columnFilters,
      debouncedGlobalFilter,
    ],
  );

  // Run the supplied React Query hook, pass all params
  const fetchResult = fetchQuery(fetchParams);

  // The hook should return { data: { data, totalCount }, isLoading, error, ... }
  const resolvedData = fetchResult.data?.data ?? [];
  const resolvedRowCount = fetchResult.data?.totalCount ?? 0;
  const resolvedLoading = fetchResult.isLoading;
  const resolvedFetching = fetchResult.isFetching;
  const resolvedError =
    fetchResult.error?.response?.data?.detail || fetchResult.error?.message;

  return (
    <DataTable
      columns={columns}
      data={resolvedData}
      filterableColumns={filterableColumns}
      searchableColumns={searchableColumns}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={emptyMessage}
      onRowClick={onRowClick}
      rowCount={resolvedRowCount}
      sorting={sorting}
      onSortingChange={setSorting}
      pagination={pagination}
      onPaginationChange={setPagination}
      columnFilters={columnFilters}
      onColumnFiltersChange={setColumnFilters}
      globalFilter={globalFilter}
      onGlobalFilterChange={setGlobalFilter}
      manualPagination={manualPagination}
      manualFiltering={manualFiltering}
      manualSorting={manualSorting}
      isLoading={resolvedLoading}
      isFetching={resolvedFetching}
      toolbarContent={<div>{toolbarContent}
      
      </div>}
      footerContent={footerContent}
    />
  );
}
