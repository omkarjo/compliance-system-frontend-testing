import DataTable from "@/components/includes/data-table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetAllActivities } from "@/query/activityQuerry";
import { useGetUserbyName } from "@/query/userQuerry";
import {
  ArrowUpDown,
  Calendar,
  CalendarPlus,
  CheckCircle,
  CircleUserRound,
  Clock,
  Eye,
  TriangleAlert,
  Watch,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function ViewListActivity() {
  const column = [
    {
      accessorKey: "activity",
      header: "Activity",
    },
    {
      accessorKey: "details",
      header: "Details",
      cell: ({ row }) => {
        const details = row.getValue("details");
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="max-w-42 truncate text-left md:max-w-52 lg:max-w-64">
                {details}
              </TooltipTrigger>
              <TooltipContent className={"max-w-42"}>
                <p>{details}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
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
      accessorKey: "user_name",
      header: "User",
    },
  ];

  const { data: usersData } = useGetUserbyName({
    searchTerm: "",
  });

  const users = useMemo(() => {
    if (!usersData) return [];
    const data = usersData?.map((user) => ({
      id: user.UserName,
      label: user.UserName,
      icon: <CircleUserRound size={16} />,
    }));
    return data.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
  }, [usersData]);

  const filterOptions = [
    {
      type: "component",
      id: "activity",
      name: "Activity",
      icon: <CheckCircle />,
      relation: ["equals"],
      options: [
        {
          id: "user_search",
          label: "User Search",
          icon: <Eye className="text-yellow-400" />,
        },
        {
          id: "login",
          label: "Login",
          icon: <CheckCircle className="text-green-400" />,
        },
        {
          id: "document_upload",
          label: "Document Upload",
          icon: <Watch className="text-blue-400" />,
        },
      ],
    },
    {
      type: "component",
      id: "user_name",
      name: "User Name",
      icon: <CircleUserRound />,
      relation: ["equals"],
      options: users,
    },
  ];

  const [sorting, setSorting] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [filters, setFilters] = useState([]);
  const [searchOptions, setSearchOptions] = useState({
    filterId: "",
    search: "",
  });

  const { data, isLoading, error } = useGetAllActivities({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    sortBy: sorting,
    filters: filters,
  });

  console.log("query", data, isLoading, error);

  return (
    <DataTable
    columns={column}
    data={isLoading ? [] : data?.data ?? []} // Clear data when loading
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
