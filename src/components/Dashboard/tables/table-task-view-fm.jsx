import DataTable from "@/components/includes/data-table";
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
import {
  ArrowUpDown,
  Calendar,
  CheckCircle,
  Eye,
  MoreHorizontal,
  TriangleAlert,
  Watch,
} from "lucide-react";
import BadgeStatusTask from "../../includes/badge-status";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function TableTaskViewFM({ actionType, openView = () => {} }) {
  const columns = [
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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown size={16} />
        </Button>
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
      header: "Status",
      cell: ({ row }) => <BadgeStatusTask text={row.getValue("state")} />,
    },
    {
      accessorKey: "assignee_name",
      header: "Assignee",
      cell: ({ row }) => (
        <div className="flex items-center">
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
    { type: "user_select", id: "assignee_id", name: "Assignee" },
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
