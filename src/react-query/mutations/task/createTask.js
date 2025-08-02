import { taskApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import fileUpload from "@/utils/file-upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMonths, addQuarters, addWeeks, addYears } from "date-fns";
import { toast } from "sonner";

const createTask = async (data) => {
  return await apiWithAuth.post(taskApiPaths.createTask, data);
};

const createTasks = async ({ data, attachments, document_type }) => {
  toast.loading("Creating Task(s)...", {
    id: "task-loading",
  });

  const compliance_task_ids = [];
  const recurrence = data.recurrence;
  const startDate = new Date(data.deadline);

  if (!recurrence) {
    const response = await createTask(data);
    compliance_task_ids.push(response.data.compliance_task_id);
  } else {
    const numberOfRepetitions = {
      Weekly: 52,
      Monthly: 12,
      Quarterly: 4,
      Yearly: 1,
    };

    const numberOfRepetitionsInYearCount = numberOfRepetitions[recurrence] * 3;
    let dependent_task_id = data.dependent_task_id;

    for (let i = 0; i < numberOfRepetitionsInYearCount; i++) {
      let newDate = new Date(startDate);

      switch (recurrence) {
        case "Weekly":
          newDate = addWeeks(newDate, i);
          break;
        case "Monthly":
          newDate = addMonths(newDate, i);
          break;
        case "Quarterly":
          newDate = addQuarters(newDate, i);
          break;
        case "Yearly":
          newDate = addYears(newDate, i);
          break;
        default:
          break;
      }

      const taskPayload = {
        ...data,
        description: `${data.description}`,
        deadline: newDate,
        dependent_task_id: dependent_task_id,
      };

      const response = await createTask(taskPayload);
      const taskId = response.data.compliance_task_id;
      compliance_task_ids.push(taskId);
      dependent_task_id = taskId;
      console.log("Task Created:", taskId);
      console.log("Task Payload:", taskPayload);
      console.log("Response:", response.data);
    }
  }

  toast.success("Task(s) Created Successfully", {
    id: "task-loading",
  });

  // Upload attachments only for the first created task
  if (attachments && attachments.length > 0 && compliance_task_ids.length > 0) {
    const firstTaskId = compliance_task_ids[0];

    toast.loading("Uploading Attachments...", {
      id: "attachment-loading",
      description: "Uploading attachments to the first task only",
    });

    const uploadPromises = attachments.map((attachment) =>
      fileUpload(attachment, document_type, firstTaskId),
    );

    await Promise.all(uploadPromises);

    toast.success("Attachments Uploaded Successfully", {
      id: "attachment-loading",
    });
  }
};

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-task"],
    mutationFn: createTasks,

    onSuccess: () => {
      toast.success("Task Created", {
        id: "task-loading",
        description: "Task Created Successfully",
      });
    },
    onError: (error) => {
      toast.error("Task Creation Failed", {
        id: "task-loading",
        description: error.response?.data?.detail || "Something went wrong",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries(["task-query"]);
    },
  });
}
