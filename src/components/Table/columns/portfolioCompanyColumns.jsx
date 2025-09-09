import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { currencyFormatter } from "@/lib/formatter";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Eye, MoreHorizontal, Trash2 } from "lucide-react";

/**
 * Returns column definitions for the Portfolio Companies Table, with shadcn Button and Lucide icons.
 * @param {Function} openView - Function to open the view modal.
 * @param {Function} deleteCompany - Mutation function for deleting a company.
 * @returns {Array}
 */
export function portfolioCompanyColumns(openView, deleteCompany) {
  const actionType = [
    {
      title: "View Details",
      icon: <Eye className="mr-1 size-4" />,
      onClick: (data) => {
        openView(data);
      },
    },
    {
      title: "Delete",
      icon: <Trash2 className="mr-1 size-4" />,
      onClick: (data) => {
        deleteCompany(data.company_id);
      },
      className: "text-red-500",
      variant: "destructive",
    },
  ];

  return [
    {
      accessorKey: "startup_brand",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-left"
        >
          Name
          <ArrowUpDown size={16} />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="max-w-42 truncate ps-2 text-left md:max-w-52 lg:max-w-64">
          {row.getValue("startup_brand")}
        </div>
      ),
    },
    {
      accessorKey: "funding",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-left"
        >
          Funding
          <ArrowUpDown size={16} />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("funding"));
        const formatted = amount ? currencyFormatter(amount, "INR") : "-";
        return <div className="me-4 text-right md:me-6">{formatted}</div>;
      },
    },
    {
      accessorKey: "created_at",
      header: "Date of Funding",
      cell: ({ row }) => {
        const date = row.getValue("created_at");
        return (
          <div className="max-w-42 truncate ps-2 text-left md:max-w-52 lg:max-w-64">
            {date ? new Date(date).toLocaleDateString("en-IN") : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "last_evaluation",
      header: "Last Evaluation",
      cell: ({ row }) => {
        const evalValue = row.getValue("last_evaluation");
        return (
          <div className="max-w-42 truncate ps-2 text-left md:max-w-52 lg:max-w-64">
            {evalValue || "-"}
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
                    className={cn(action?.className)}
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick(data);
                    }}
                  >
                    <span className="flex items-center">
                      {action.icon}
                      {action.title}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
