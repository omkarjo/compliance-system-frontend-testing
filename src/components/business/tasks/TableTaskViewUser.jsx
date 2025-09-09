import { ServerDataTable } from "@/components/Table";

import { Button } from "@/components/ui/button";
import { useGetCurrentUser } from "@/hooks/useGetCurrentUser";
import { useGetTask } from "@/react-query/query/task/taskQuery";
import {
    ArrowUpDown
} from "lucide-react";
import StatusLozenge from "@/components/common/includes/StatusLozenge";

export default function TableTaskViewUser({ openView = () => {} }) {

  const { user } = useGetCurrentUser();

  
  const taskColumn = [
   
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

        return <StatusLozenge status={status} />;
      },
    },
  ];

  const filterableColumns = [];

  const useGetTaskWithFilter = (params) => {
    return useGetTask({
      ...params,
      filters: [
        ...params.filters || [], 
        { 
          filterid: "assignee_id",
          optionid: user.user_id,
        }
      ],
    });
  };

  return (
    <ServerDataTable
      columns={taskColumn}
      fetchQuery={useGetTaskWithFilter}
      filterableColumns={filterableColumns}
      initialPageSize={10}
      onRowClick={(row) => openView(row.original)}
      searchPlaceholder="Search tasks..."
      emptyMessage="No tasks found"
    />
  );
}
