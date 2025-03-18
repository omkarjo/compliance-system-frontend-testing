import DataTable from "@/components/includes/data-table";
import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/useDebounce";
import { useGetAllDocuments } from "@/query/docomentsQuerry";
import {
  AlertTriangle,
  ArrowUpDown,
  Bell,
  CheckCircle,
  Clock,
  FileBarChart,
  FileQuestion,
  FileSignature,
  FileText,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function ViewListDocument() {
  const column = [
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "name",
      header: "Name",
    },

    {
      accessorKey: "process_id",
      header: "Linked Task",
      cell: ({ row }) => {
        const process_id = row.getValue("process_id");
        return (
          <div className="text-left">
            {process_id ? (
              <div className="text-xs text-gray-500">{process_id}</div>
            ) : (
              <div className="text-xs text-gray-500">No Task</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "date_uploaded",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date Uploaded
            <ArrowUpDown size={16} />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date_uploaded = row.getValue("date_uploaded");
        const date = new Date(date_uploaded);
        return (
          <div className="text-left">
            {date_uploaded ? (
              <div className="text-xs text-gray-500">
                {date.toLocaleDateString()}
              </div>
            ) : (
              <div className="text-xs text-gray-500">Invalid Date</div>
            )}
          </div>
        );
      },
    },
  ];

  const filterOptions = [
    { type: "divider" },
    {
      type: "component",
      id: "status",
      name: "Document Status",
      icon: <CheckCircle />,
      relation: ["equals"],
      options: [
        {
          id: "Active",
          label: "Active",
          icon: <CheckCircle className="text-green-400" />,
        },
        {
          id: "Pending Approval",
          label: "Pending Approval",
          icon: <Clock className="text-blue-400" />,
        },
        {
          id: "Expired",
          label: "Expired",
          icon: <AlertTriangle className="text-red-400" />,
        },
      ],
    },
    {
      type: "component",
      id: "category",
      name: "Document Category",
      icon: <FileText />,
      relation: ["equals"],
      options: [
        {
          id: "Contribution Agreement",
          label: "Contribution Agreement",
          icon: <FileSignature className="text-indigo-400" />,
        },
        {
          id: "KYC",
          label: "KYC",
          icon: <Users className="text-purple-400" />,
        },
        {
          id: "Notification",
          label: "Notification",
          icon: <Bell className="text-yellow-400" />,
        },
        {
          id: "Report",
          label: "Report",
          icon: <FileBarChart className="text-blue-400" />,
        },
        {
          id: "Other",
          label: "Other",
          icon: <FileQuestion className="text-gray-400" />,
        },
      ],
    },
  ];
  const [sorting, setSorting] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [filters, setFilters] = useState([]);
  const [search, setSearch] = useState("");
  const [searchOptions, setSearchOptions] = useState({
    filterId: "",
    search: "",
  });

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, error } = useGetAllDocuments({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    sortBy: sorting,
    search: debouncedSearch,
    filters,
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
      search={search}
      setSearch={setSearch}
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
