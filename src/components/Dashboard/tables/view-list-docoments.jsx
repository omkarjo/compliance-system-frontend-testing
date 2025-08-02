import DataTable from "@/components/includes/data-table";
import SortButton from "@/components/includes/SortButton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useGetAllDocuments } from "@/react-query/query/documents/docomentsQuery";
import {
  AlertTriangle,
  ArrowUpDown,
  Bell,
  CheckCircle,
  Clock,
  DownloadIcon,
  FileBarChart,
  FileQuestion,
  FileSignature,
  FileText,
  MoreHorizontal,
  Trash,
  Users,
  ViewIcon,
} from "lucide-react";
import { cloneElement } from "react";
import { toast } from "sonner";

export default function ViewListDocument({ actionType = [] }) {
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
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="max-w-42 truncate text-left md:max-w-52 lg:max-w-64">
          {row.getValue("name")}
        </div>
      ),
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
        return <SortButton column={column}>Date Uploaded</SortButton>;
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
                    className={cn("text-sm", action?.className)}
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick(data);
                    }}
                  >
                    <div className="flex items-center">
                      {cloneElement(action.icon, {
                        className: "w-5 h-5",
                      })}
                      <span className="ms-2">{action.title}</span>
                    </div>
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

  return (
    <DataTable
      columns={columns}
      fetchData={useGetAllDocuments}
      filterOptions={filterOptions}
      initialPageSize={10}
      searchBox={true}
      searchBoxPlaceholder="Search documents..."
    />
  );
}
