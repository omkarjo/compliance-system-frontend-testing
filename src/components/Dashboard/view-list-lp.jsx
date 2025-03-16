import DataTable from "@/components/includes/data-table";
import { Button } from "@/components/ui/button";
import { currencyFormatter } from "@/lib/formatter";
import { useGetLP } from "@/query/lpQuerry";
import {
  ArrowUpDown,
  Calendar,
  CalendarPlus,
  CheckCircle,
  Clock,
  Flag,
} from "lucide-react";
import { useState } from "react";
import BadgeStatusTask from "../includes/badge-status";


export default function ViewList({ actionType, openView = () => {} }) {
  const taskColumn = [
    {
      accessorKey: "lp_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown size={16} />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="max-w-42 truncate text-left md:max-w-52 lg:max-w-64">
          {row.getValue("lp_name")}
        </div>
      ),
    },
    {
      accessorKey: "state",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown size={16} />
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue("state");
        return <BadgeStatusTask type={"info"} text={status} />;
      },
    },
    {
      accessorKey: "commitment_amount",
      header: ({ column }) => {
        return (
          <div className="ms-auto flex justify-end">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className=""
            >
              <span className="me-2 max-md:hidden">Commitment </span>
              <span className="ms-0">Amount</span>
              <ArrowUpDown size={16} />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("commitment_amount"));
        const formatted = currencyFormatter(amount, "INR");

        return (
          <div className="me-4 text-right font-medium md:me-6">{formatted}</div>
        );
      },
    },
  ];

  const filterOptions = [
    { type: "divider" },
    {
      type: "component",
      id: "status",
      name: "Status",
      icon: <CheckCircle />,
      relation: ["equals"],
      options: [
        { id: "active", label: "Active", icon: <CheckCircle color="green" /> },
        {
          id: "inactive",
          label: "Inactive",
          icon: <CheckCircle color="gray" />,
        },
      ],
    },
    {
      type: "component",
      id: "priority",
      name: "Priority",
      icon: <Flag />,
      relation: ["equals", "not_equals"],
      options: [
        { id: "low", label: "Low", icon: <Flag color="green" /> },
        { id: "medium", label: "Medium", icon: <Flag color="orange" /> },
        { id: "high", label: "High", icon: <Flag color="red" /> },
      ],
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

  const [sorting, setSorting] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [rowSelection, setRowSelection] = useState({});
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
      columns={taskColumn}
      data={data?.data ?? []}
      totalCount={data?.totalCount ?? 0}
      loading={isLoading}
      sorting={sorting}
      setSorting={setSorting}
      pagination={pagination}
      setPagination={setPagination}
      error={error?.message}
      rowSelection={rowSelection}
      // setRowSelection={setRowSelection}
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
