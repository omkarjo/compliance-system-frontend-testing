import { taskApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const updateTaskState = async ({ taskId, state }) => {
  return await apiWithAuth.patch(`${taskApiPaths.updateTaskPrefix}/${taskId}`, {
    state,
  });
};

export function useUpdateTaskState() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-task-state"],
    mutationFn: updateTaskState,
    onMutate: async ({ taskId, state }) => {
      await queryClient.cancelQueries(["task-query"]);
      const previousData = queryClient.getQueryData(["task-query"]);
      queryClient.setQueryData(["task-query"], (old) => {
        if (!old) return [];
        return old.map((task) => {
          if (task.compliance_task_id === taskId) {
            return { ...task, state };
          }
          return task;
        });
      });
      return { previousData };
    },
    onError: (error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["task-query"], context.previousData);
      }
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["task-query"]);
    },
  });
}
