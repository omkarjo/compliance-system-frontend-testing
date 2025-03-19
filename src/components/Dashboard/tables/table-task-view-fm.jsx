import DataTable from "@/components/includes/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useGetTask } from "@/query/taskQuerry";
import {
  ArrowUpDown,
  Calendar,
  CheckCircle,
  CircleUserRound,
  Eye,
  MoreHorizontal,
  TriangleAlert,
  Watch,
} from "lucide-react";
import { useState } from "react";
import BadgeStatusTask from "../../includes/badge-status";

export default function TableTaskViewFM({ actionType, openView = () => {} }) {

  const taskColumn = [
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div className="text-left uppercase">{row.getValue("category")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Title",
      cell: ({ row }) => (
        <div className="max-w-42 truncate text-left md:max-w-52 lg:max-w-64">
          {row.getValue("description")}
        </div>
      ),
    },
    {
      accessorKey: "deadline",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Due Date
            <ArrowUpDown size={16} />
          </Button>
        );
      },
      cell: ({ row }) => {
        const dueDate = row.getValue("deadline");
        const formatted = dueDate
          ? new Date(dueDate).toLocaleDateString("EN-IN")
          : "No Due Date";
        return <div className="ps-4 text-left font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "state",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("state");

        return <BadgeStatusTask text={status} />;
      },
    },
    {
      accessorKey: "assignee_id",
      header: "Assignee",
      cell: ({ row }) => {
        const assignee = row.getValue("assignee_id");
        return (
          <div className="flex items-center text-left">
            <div className="mr-2">
              <CircleUserRound size={24} />
            </div>
            {assignee}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const data = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onClick={(e) => e.stopPropagation()}
            >
              {actionType?.map((action, index) => (
                <DropdownMenuItem
                  key={index}
                  className={cn(action?.className)}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick(data);
                  }}
                >
                  {action.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filterOptions = [
    { type: "divider" },
    {
      type: "component",
      id: "state",
      name: "Status",
      icon: <CheckCircle />,
      relation: ["equals"],
      options: [
        {
          id: "Open",
          label: "Open",
          icon: <Eye className="text-yellow-400" />,
        },
        {
          id: "Pending",
          label: "Pending",
          icon: <Watch className="text-blue-400" />,
        },
        {
          id: "Completed",
          label: "Completed",
          icon: <CheckCircle className="text-green-400" />,
        },
        {
          id: "Overdue",
          label: "Overdue",
          icon: <TriangleAlert className="text-red-400" />,
        },
      ],
    },
    {
      type: "user_select",
      id: "assignee_id",
      name: "Assignee",
    },
    {
      type: "date_range",
      id: "deadline",
      name: "Date Range",
      icon: <Calendar />,
      relation: ["equals"],
    },
  ];

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [filters, setFilters] = useState([]);
  const [searchOptions, setSearchOptions] = useState({
    filterId: "",
    search: "",
  });
  const { data, isLoading, error } = useGetTask({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    sortBy: sorting,
    filters: filters,
  });

  return (
    <DataTable
      columns={taskColumn}
      data={data?.data ?? []}
      totalCount={data?.totalCount ?? 0}
      loading={isLoading}
      sorting={sorting}
      setSorting={setSorting}
      pagination={pagination}
      setPagination={setPagination}
      error={error?.response?.data?.detail}
      openView={openView}
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
