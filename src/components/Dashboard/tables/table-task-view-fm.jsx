import DataTable from "@/components/includes/data-table";
import SortButton from "@/components/includes/SortButton";
import UserBadge from "@/components/includes/user-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useGetTask } from "@/query/taskQuery";
import useCheckRoles from "@/utils/check-roles";
import {
  Calendar,
  CheckCircle,
  Eye,
  MoreHorizontal,
  TriangleAlert,
  Watch,
} from "lucide-react";
import StateChangeSelector from "../includes/state-change-selector";

const STATUS_OPTIONS_ADMIN = [
  // { label: "Open", value: "Open" },
  // { label: "Pending", value: "Pending" },
  { label: "Completed", value: "Completed" },
  // { label: "Review Required", value: "Review Required" },
];

const STATUS_OPTIONS_USER = [{ label: "Completed", value: "Completed" }];

export default function TableTaskViewFM({ actionType, openView = () => {} }) {
  const havePermission = useCheckRoles(["Fund Manager", "Compliance Officer"]);

  const columns = [
    {
      accessorKey: "category",
      header: () => (
        <span className="ms-4 flex items-center">{"Category"}</span>
      ),
      cell: ({ row }) => (
        <div className="ms-4 text-left uppercase">
          {row.getValue("category")}
        </div>
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
      header: ({ column }) => (
        <SortButton column={column}>
          <span className="flex items-center gap-2">Due Date</span>
        </SortButton>
      ),
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
      header: ({ column }) => <SortButton column={column}>Status</SortButton>,
      cell: ({ row }) => {
        const data = row.original;
        return (
          <StateChangeSelector
            data={data}
            options={
              havePermission ? STATUS_OPTIONS_ADMIN : STATUS_OPTIONS_USER
            }
          />
        );
      },
    },

    {
      accessorKey: "assignee_name",
      header: ({ column }) => <SortButton column={column}>Assignee</SortButton>,
      cell: ({ row }) => (
        <div className="flex w-28 items-center">
          <UserBadge name={row.getValue("assignee_name")} />
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const data = row.original;
        return (
          <div className="ms-auto flex w-24 items-center justify-end">
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
          </div>
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
    ...(havePermission
      ? [
          { type: "user_select", id: "assignee_id", name: "Assignee" },
          { type: "user_select", id: "reviewer_id", name: "Reviewer" },
          { type: "user_select", id: "approver_id", name: "Final Reviewer" },
        ]
      : []),
    {
      type: "date_range",
      id: "deadline",
      name: "Date Range",
      icon: <Calendar />,
      relation: ["equals"],
    },
  ];

  return (
    <DataTable
      columns={columns}
      fetchData={useGetTask}
      filterOptions={filterOptions}
      openView={openView}
      actionType={actionType}
    />
  );
}
