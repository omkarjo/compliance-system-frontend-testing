import { taskApiPaths } from "@/constant/apiPaths";
import queryClient from "@/query/queryClient";
import { apiWithAuth } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function UpdateTaskStatus() {
  return useMutation({
    mutationFn: async ({ taskId, status }) => {
      toast.loading("Updating task status...", { id: `task-update-${taskId}` });

      const response = await apiWithAuth.patch(
        `${taskApiPaths.updateTaskPrefix}${taskId}`,
        { state: status },
      );

      return { data: response.data, taskId };
    },
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries(["task-query"]);

      const previousTasks = queryClient.getQueryData(["task-query"]);
      queryClient.setQueryData(["task-query"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          tasks: oldData.tasks.map((task) =>
            task.compliance_task_id === taskId
              ? { ...task, state: status }
              : task,
          ),
        };
      });

      return { previousTasks };
    },
    onSuccess: ({ data, taskId }) => {
      toast.dismiss(`task-update-${taskId}`);
      toast.success(`Task status updated to ${data.state}.`, {
        id: `task-update-${taskId}`,
      });

      queryClient.invalidateQueries(["task-query"]);
    },
    onError: (error, { taskId }, context) => {
      queryClient.invalidateQueries(["task-query"]);

      toast.dismiss(`task-update-${taskId}`);
      toast.error("Failed to update task status. Please try again.", {
        id: `task-update-${taskId}`,
      });

      console.error("Error updating task status:", error);
    },
  });
}
