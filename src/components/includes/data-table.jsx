import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  loading = false,
  error = null,
  columns = [],
  data = [],
  totalCount = 0,
  // sorting: tableSorting,
  setSorting: setTableSorting,
  pagination,
  setPagination,
  // rowSelection: tableRowSelection,
  setRowSelection: setTableRowSelection = null,
  filter,
  openView = null,
}) {
  const selectColumn = {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        onClick={(event) => event.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };

  const tableColumns = [
    ...(setTableRowSelection ? [selectColumn] : []),
    ...columns,
  ];

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data,
    columns: tableColumns,
    pageCount: totalCount > 0 ? Math.ceil(totalCount / pagination.pageSize) : 1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    manualPagination: true,
    manualSorting: true,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  React.useEffect(() => {
    if (typeof setTableSorting === "function") {
      setTableSorting(sorting);
    }
  }, [sorting, setTableSorting]);

  React.useEffect(() => {
    if (typeof setTableRowSelection === "function") {
      const selectedRowIds = table
        .getSelectedRowModel()
        .rows.map((row) => row.original.id);

      setTableRowSelection(selectedRowIds);
    }
  }, [rowSelection, setTableRowSelection, table]);

  React.useEffect(() => {
    setRowSelection({});
  }, [pagination.pageIndex]);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4 py-4">
        <Input
          placeholder=""
          // value={table.getColumn("")?.getFilterValue() ?? ""}
          // onChange={(event) =>
          //   table.getColumn("title")?.setFilterValue(event.target.value)
          // }
          className="max-w-sm"
        />
        <div className="flex items-center justify-end gap-4">
          {filter && (
            <FilterComponent
              filterOptions={filter.filterOptions}
              filters={filter.filters}
              setFilters={filter.setFilters}
              searchOptions={filter.searchOptions}
              setSearchOptions={filter.setSearchOptions}
            />
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className={"p-2"}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-48 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-48 text-center"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : table.getFilteredRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "hover:bg-gray-100",
                    row.getIsSelected() && "bg-gray-100",
                    openView && "cursor-pointer",
                  )}
                  onClick={() => {
                    if (openView) {
                      openView(row.original);
                    }
                  }}
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
                  colSpan={tableColumns.length}
                  className="h-48 text-center"
                >
                  No Records Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {/* {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected. */}
            Page {pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="space-x-2">
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
      )}
    </div>
  );
}
