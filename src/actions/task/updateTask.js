import { taskApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import fileUpload from "@/utils/file-upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const frozenFields = [{ key: "recurrence" }];

const updateTask = async (compliance_task_id, data) => {
  return await apiWithAuth.patch(
    `${taskApiPaths.updateTaskPrefix}${compliance_task_id}`,
    data,
  );
};

const createTasks = async ({
  data,
  attachments,
  document_type,
  compliance_task_id,
}) => {
  toast.loading("Updating Task", {
    id: "task-loading",
  });
  const bodyData = Object.keys(data).reduce((acc, key) => {
    if (!frozenFields.some((field) => field.key === key)) {
      acc[key] = data[key];
    }
    return acc;
  }, {});

  console.log("bodyData", bodyData);

  await updateTask(compliance_task_id, bodyData);

  toast.success("Task Updated", {
    id: "task-loading",
    description: "Task Updated Successfully",
  });

  if (attachments && attachments.length > 0) {
    toast.loading("Uploading Attachments", {
      id: "task-loading",
      description: "Uploading Attachments to Task",
    });

    const promises = attachments.map((attachment) => {
      const fileUploadPromise = fileUpload(
        attachment,
        document_type,
        compliance_task_id,
      );
      return fileUploadPromise;
    });

    await Promise.all(promises);

    toast.success("Attachments Uploaded", {
      id: "task-loading",
      description: "Attachments Uploaded Successfully",
    });
  }
};

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-task"],
    mutationFn: createTasks,

    onSuccess: () => {
      toast.success("Task Updated", {
        id: "task-loading",
        description: "Task Updated Successfully",
      });
    },
    onError: (error) => {
      toast.error("Task Update Failed", {
        id: "task-loading",
        description: error.response?.data?.detail || "Something went wrong",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries(["task-query"]);
      // toast.dismiss("task-loading");
    },
  });
}
