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
import { useGetUserbyName } from "@/query/userQuerry";
import {
  ArrowUpDown,
  Calendar,
  CalendarPlus,
  CheckCircle,
  CircleUserRound,
  Clock,
  Eye,
  Flag,
  MoreHorizontal,
  Triangle,
  TriangleAlert,
  Watch,
} from "lucide-react";
import { useMemo, useState } from "react";
import BadgeStatusTask from "../includes/badge-status";

export default function ViewList({ actionType, openView = () => {} }) {
  // const actionType = [
  //   { title: "Edit", className: "", onClick: () => {} },
  //   { title: "Delete", className: "text-red-500", onClick: () => {} },
  // ];

  const { data: usersData } = useGetUserbyName({
    searchTerm: "",
  });

  const users = useMemo(() => {
    if (!usersData) return [];
    return usersData?.map((user) => ({
      id: user.UserId,
      label: user.UserName,
      icon: <CircleUserRound size={16} />,
    }));
  }, [usersData]);

  const taskColumn = [
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div className="text-left uppercase">{row.getValue("category")}</div>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="max-w-42 truncate text-left md:max-w-52 lg:max-w-64">
          {row.getValue("title")}
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
        const id = row.original.id;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {actionType?.map((action, index) => (
                <DropdownMenuItem
                  key={index}
                  className={cn(action?.className)}
                  onClick={() => action.onClick(id)}
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
      type: "component",
      id: "assignee_id",
      name: "Assignee",
      icon: <CircleUserRound />,
      relation: ["equals"],
      options: users,
    },
    { type: "divider" },
    {
      type: "component",
      id: "created_at",
      name: "Created At",
      icon: <CalendarPlus />,
      relation: ["equals", "before", "after"],
      options: [
        { id: "today", label: "Today", icon: <Calendar /> },
        { id: "yesterday", label: "Yesterday", icon: <Calendar /> },
        { id: "last_7_days", label: "Last 7 days", icon: <Calendar /> },
        { id: "last_30_days", label: "Last 30 days", icon: <Calendar /> },
        { id: "this_month", label: "This month", icon: <Calendar /> },
        { id: "last_month", label: "Last month", icon: <Calendar /> },
      ],
    },
    {
      type: "component",
      id: "updated_at",
      name: "Updated At",
      icon: <Clock />,
      relation: ["equals", "before", "after"],
      options: [
        { id: "today", label: "Today", icon: <Clock /> },
        { id: "yesterday", label: "Yesterday", icon: <Clock /> },
        { id: "last_7_days", label: "Last 7 days", icon: <Clock /> },
        { id: "this_month", label: "This month", icon: <Clock /> },
      ],
    },
  ];

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [rowSelection, setRowSelection] = useState({});
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
      rowSelection={rowSelection}
      openView={openView}
      setRowSelection={setRowSelection}
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
