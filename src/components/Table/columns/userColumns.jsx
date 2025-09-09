import SortButton from "@/components/Table/SortButton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { cloneElement } from "react";

/**
 * Returns column definitions for the User Table using DataTableColumnHeader.
 * @param {Array} actionType - Array of action objects for row actions.
 * @returns {Array}
 */
export function userColumns(actionType = []) {
  return [
    {
      accessorKey: "UserName",
      header: ({ column }) => (
        <SortButton column={column}>Name</SortButton>
      ),
      cell: ({ row }) => (
        <div className="ms-4 text-left text-foreground">{row.getValue("UserName")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <SortButton column={column}>Email</SortButton>
      ),
      cell: ({ row }) => (
        <div className="text-left text-foreground">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <SortButton column={column}>Role</SortButton>
      ),
      cell: ({ row }) => (
        <div className="text-left text-xs text-muted-foreground uppercase">
          {row.getValue("role")}
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
                    className={cn("text-sm", action?.className)}
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick(data);
                    }}
                  >
                    <div className="flex items-center">
                      {action.icon &&
                        cloneElement(action.icon, {
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
}