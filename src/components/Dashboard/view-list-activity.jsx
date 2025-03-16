import DataTable from "@/components/includes/data-table";
import { Button } from "@/components/ui/button";
import { useGetLP } from "@/query/lpQuerry";
import {
  ArrowUpDown
} from "lucide-react";
import { useState } from "react";

export default function ViewListActivity() {
  const column = [
    {
      accessorKey: "activity",
      header: "Activity",
    },
    {
      accessorKey: "details",
      header: "Details",
    },
    {
      accessorKey: "timestamp",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Timestamp
            <ArrowUpDown size={16} />
          </Button>
        );
      },
      cell: ({ row }) => {
        const timestamp = row.getValue("timestamp");
        const date = new Date(timestamp);
        return (
          <div className="text-left">
            {timestamp ? (
              <div className="text-xs text-gray-500">
                {date.toLocaleDateString()} {date.toLocaleTimeString()}
              </div>
            ) : (
              <div className="text-xs text-gray-500">Invalid Date</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "user_id",
      header: "User",
      cell: ({ row }) => {
        const user = row.getValue("user_id");
        return (
          <div className="text-left">
            <div className="text-xs text-gray-500">{user}</div>
          </div>
        );
      },
    },
  ];

  const filterOptions = [];

  const [sorting, setSorting] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [filters, setFilters] = useState([]);
  const [searchOptions, setSearchOptions] = useState({
    filterId: "",
    search: "",
  });

  const { data, isLoading, error } = useGetLP({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    sortBy: sorting,
  });

  return (
    <DataTable
      columns={column}
      data={data?.data ?? []}
      totalCount={data?.totalCount ?? 0}
      loading={isLoading}
      sorting={sorting}
      setSorting={setSorting}
      pagination={pagination}
      setPagination={setPagination}
      error={error?.message}
      filter={{
        filters,
        filterOptions,
        searchOptions,
        setFilters,
        setSearchOptions,
      }}
    />
  );
}
