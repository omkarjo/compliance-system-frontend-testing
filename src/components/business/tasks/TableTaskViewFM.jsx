import { ServerDataTable } from "@/components/Table/ServerDataTable";
import { useSearchTask } from "@/react-query/query/task/taskQuery";
import { taskColumns } from "@/components/Table/columns/taskColumns";
import useCheckRoles from "@/utils/check-roles";
import { getTaskByID } from "@/utils/getTaskByID";
import { usePermissionTaskChange } from "@/utils/havePermission";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { taskFilterOptions } from "@/components/Table/filters/taskFilterOptions";

export default function TableTaskViewFM({ actionType, openView = () => {} }) {
  const havePermission = useCheckRoles(["Fund Manager", "Compliance Officer"]);
  const havePermissionTaskChange = usePermissionTaskChange();

  const [searchParams, setSearchParams] = useSearchParams();
  const taskId = searchParams.get("taskId");

  const columns = taskColumns(havePermission, actionType);
  const filterableColumns = taskFilterOptions(havePermission);

  useEffect(() => {
    if (taskId) {
      getTaskByID(taskId).then((res) => {
        const havePermissionToView = havePermissionTaskChange(res);
        if (!havePermissionToView) {
          toast.error("You don't have permission to view this task.");
          return;
        }
        openView(res);

        // Clear the search params after setting the task
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("taskId");
        setSearchParams(newSearchParams.toString(), { replace: true });
      });
    }
  }, [taskId, setSearchParams]);

  return (
    <ServerDataTable
      columns={columns}
      fetchQuery={useSearchTask}
      filterableColumns={filterableColumns}
      initialPageSize={15}
      onRowClick={(row) => {
        openView(row.original);
      }}
      searchPlaceholder="Search Activity..."
      emptyMessage="No activity logs found"
    />
  );
}
