import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import FilterComponent from "./filters-table";

export default function DataTable({
  // Core props
  columns = [],

  // Data source
  data = [],
  totalCount = 0,
  fetchData = null,

  // Table state
  loading = false,
  error = null,

  // Configuration
  initialSorting = [],
  initialFilters = [],
  initialPageSize = 10,
  extraFilters = [],
  filterOptions = [],
  onRowSelectionChange = null,
  openView = null,

  // Search options
  searchBox = false,
  searchBoxPlaceholder = "Search...",
  searchDebounceMs = 300,

  // External state
  externalState = null,

  // Page size selector
  showPageSizeSelector = true,
}) {
  const isProviderMode = Boolean(fetchData);

  // Local state declarations
  const [sorting, setSorting] = React.useState(initialSorting);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [filters, setFilters] = React.useState(initialFilters);
  const [searchOptions, setSearchOptions] = React.useState({
    filterId: "",
    search: "",
  });
  const [search, setSearch] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isPageChanging, setIsPageChanging] = React.useState(false);
  const [isPageSizeChanging, setIsPageSizeChanging] = React.useState(false);

  // Resolve state from external or local
  const {
    sorting: resolvedSorting = sorting,
    setSorting: resolvedSetSorting = setSorting,
    pagination: resolvedPagination = pagination,
    setPagination: resolvedSetPagination = setPagination,
    search: resolvedSearch = search,
    setSearch: resolvedSetSearch = setSearch,
    filters: resolvedFilters = filters,
    setFilters: resolvedSetFilters = setFilters,
    searchOptions: resolvedSearchOptions = searchOptions,
    setSearchOptions: resolvedSetSearchOptions = setSearchOptions,
  } = externalState || {};

  // Sync input value with search state
  React.useEffect(() => {
    setInputValue(resolvedSearch || "");
  }, [resolvedSearch]);

  // Debounce search input
  const debouncedSearchValue = useDebounce(inputValue, searchDebounceMs);

  // Update search state when debounced value changes
  React.useEffect(() => {
    resolvedSetSearch(debouncedSearchValue || null);
  }, [debouncedSearchValue, resolvedSetSearch]);

  // Handle page size change with animation
  const handlePageSizeChange = (newSize) => {
    setIsPageSizeChanging(true);
    const size = parseInt(newSize, 10);

    setTimeout(() => {
      resolvedSetPagination({
        pageIndex: 0, // Reset to first page when changing page size
        pageSize: size,
      });
      setIsPageSizeChanging(false);
    }, 300);
  };

  // Handle page change with animation
  const handlePageChange = (action) => {
    setIsPageChanging(true);

    setTimeout(() => {
      if (action === "next") {
        table.nextPage();
      } else {
        table.previousPage();
      }
      setIsPageChanging(false);
    }, 200);
  };

  // Construct fetch parameters
  const fetchParams = React.useMemo(
    () => ({
      pageIndex: resolvedPagination.pageIndex,
      pageSize: resolvedPagination.pageSize,
      sortBy: resolvedSorting,
      filters: [...resolvedFilters, ...extraFilters],
      search: resolvedSearch,
    }),
    [
      resolvedPagination.pageIndex,
      resolvedPagination.pageSize,
      resolvedSorting,
      resolvedFilters,
      extraFilters,
      resolvedSearch,
    ],
  );

  const fetchResult = isProviderMode
    ? fetchData(fetchParams)
    : { data: null, isLoading: false, error: null };

  const resolvedData = isProviderMode ? (fetchResult.data?.data ?? []) : data;
  const resolvedTotalCount = isProviderMode
    ? (fetchResult.data?.totalCount ?? 0)
    : totalCount;
  const resolvedLoading = isProviderMode ? fetchResult.isLoading : loading;
  const resolvedError = isProviderMode
    ? fetchResult.error?.response?.data?.detail || fetchResult.error?.message
    : error;

  const filterConfig = React.useMemo(
    () => ({
      filterOptions,
      filters: resolvedFilters,
      setFilters: resolvedSetFilters,
      searchOptions: resolvedSearchOptions,
      setSearchOptions: resolvedSetSearchOptions,
    }),
    [
      filterOptions,
      resolvedFilters,
      resolvedSetFilters,
      resolvedSearchOptions,
      resolvedSetSearchOptions,
    ],
  );

  const selectColumn = React.useMemo(
    () => ({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="transition-all duration-200 ease-in-out"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onClick={(event) => event.stopPropagation()}
          className="transition-all duration-200 ease-in-out"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    [],
  );

  const tableColumns = React.useMemo(
    () => [...(onRowSelectionChange ? [selectColumn] : []), ...columns],
    [columns, onRowSelectionChange, selectColumn],
  );

  const pageCount = React.useMemo(
    () =>
      Math.max(1, Math.ceil(resolvedTotalCount / resolvedPagination.pageSize)),
    [resolvedTotalCount, resolvedPagination.pageSize],
  );

  // Initialize table
  const table = useReactTable({
    data: resolvedData,
    columns: tableColumns,
    pageCount,
    state: {
      sorting: resolvedSorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: resolvedPagination,
    },
    manualPagination: true,
    manualSorting: true,
    onSortingChange: resolvedSetSorting,
    onPaginationChange: resolvedSetPagination,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  React.useEffect(() => {
    if (onRowSelectionChange) {
      const selectedRowIds = table
        .getSelectedRowModel()
        .rows.map((row) => row.original.id);

      onRowSelectionChange(selectedRowIds);
    }
  }, [rowSelection, onRowSelectionChange, table]);

  React.useEffect(() => {
    setRowSelection({});
  }, [resolvedPagination.pageIndex]);

  const renderEmptyState = (message) => (
    <TableRow>
      <TableCell colSpan={tableColumns.length} className="h-48 text-center">
        {message}
      </TableCell>
    </TableRow>
  );

  const renderTableContent = () => {
    if (resolvedLoading) {
      return renderEmptyState(
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <span className="ml-2">Loading...</span>
        </div>,
      );
    }

    if (resolvedError) {
      return renderEmptyState(resolvedError);
    }

    if (table.getFilteredRowModel().rows.length === 0) {
      return renderEmptyState("No Records Found");
    }

    return table.getRowModel().rows.map((row) => (
      <TableRow
        data-id={row.id}
        key={row.id}
        data-state={row.getIsSelected() && "selected"}
        className={cn(
          "transition-colors duration-200 hover:bg-gray-100",
          row.getIsSelected() && "bg-gray-100",
          openView && "cursor-pointer",
        )}
        onClick={(event) => {
          const isInteractiveElement = !!event.target.closest(
            "button, a, input, textarea, select",
          );

          if (isInteractiveElement) {
            return;
          }
          if (openView) {
            openView(row.original);
          }
        }}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id} className="">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <div className="w-full">
      {/* Search and filters */}
      <div className="flex items-center justify-between gap-4 py-4">
        <div className="flex-1">
          {searchBox && (
            <Input
              placeholder={searchBoxPlaceholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="max-w-xl transition-all duration-300 focus:ring-2 focus:ring-blue-300"
            />
          )}
        </div>
        <div className="flex items-center justify-end gap-4">
          {Array.isArray(filterOptions) && filterOptions.length > 0 && (
            <FilterComponent {...filterConfig} />
          )}
        </div>
      </div>

      {/* Table */}
      <div
        className={cn(
          "rounded-md border transition-opacity duration-300",
          isPageChanging || isPageSizeChanging ? "opacity-50" : "opacity-100",
        )}
      >
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="p-2">
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
          <TableBody>{renderTableContent()}</TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          Page {resolvedPagination.pageIndex + 1} of {table.getPageCount()}
        </div>

        <div className="flex items-center space-x-4">
          {showPageSizeSelector && (
            <div
              className={cn(
                "flex items-center space-x-2 transition-all duration-300",
                isPageSizeChanging
                  ? "scale-105 opacity-75"
                  : "scale-100 opacity-100",
              )}
            >
              <span className="text-muted-foreground text-sm">
                Rows per page:
              </span>
              <Select
                value={resolvedPagination.pageSize.toString()}
                onValueChange={handlePageSizeChange}
                disabled={isPageChanging || isPageSizeChanging}
              >
                <SelectTrigger className="h-8 w-16 transition-all duration-200 hover:bg-gray-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="animate-in fade-in-80 slide-in-from-bottom-5">
                  <SelectItem
                    value="10"
                    className="transition-colors duration-200 hover:bg-gray-100"
                  >
                    10
                  </SelectItem>
                  <SelectItem
                    value="20"
                    className="transition-colors duration-200 hover:bg-gray-100"
                  >
                    20
                  </SelectItem>
                  <SelectItem
                    value="50"
                    className="transition-colors duration-200 hover:bg-gray-100"
                  >
                    50
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange("previous")}
              disabled={
                !table.getCanPreviousPage() ||
                isPageChanging ||
                isPageSizeChanging
              }
              className={cn(
                "transition-all duration-200",
                isPageChanging ? "translate-x-1" : "translate-x-0",
              )}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange("next")}
              disabled={
                !table.getCanNextPage() || isPageChanging || isPageSizeChanging
              }
              className={cn(
                "transition-all duration-200",
                isPageChanging ? "translate-x-1" : "translate-x-0",
              )}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
