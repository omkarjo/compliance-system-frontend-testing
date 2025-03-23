import { Button } from "@/components/ui/button";
import DataTable from "@/components/includes/data-table";
import { useGetAllDocuments } from "@/query/docomentsQuery";
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
  DownloadIcon,
  ViewIcon,
  MoreHorizontal
} from "lucide-react";
import { cloneElement } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ViewListDocument() {
  const actionType = [
    {
      title: "View",
      className: "",
      icon: <ViewIcon />,
      onClick: (data) => {
        if(!data.drive_link) {
          toast.error("No Link Found");
          return;
        }
        window.open(data.drive_link, "_blank");
      }
    },
    {
      title: "Download",
      className: "",
      icon: <DownloadIcon />
    },
  ];

  const columns = [
    {
      accessorKey: "category",
      header: "Category",
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
                  className={cn(
                    "text-sm",
                    action?.className)}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick(data);
                  }}
                >
                  <div className="flex items-center">
                    {
                      cloneElement(action.icon, {
                        className: "w-5 h-5"
                      })
                    }
                    <span className="ms-2">{action.title}</span>
                  </div>
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