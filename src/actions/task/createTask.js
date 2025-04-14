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
  toast.loading("Creating Task", {
    id: "task-loading",
  });

  const compliance_task_ids = [];

  const recurrence = data.recurrence;
  if (!recurrence) {
    const response = await createTask(data);
    compliance_task_ids.push(response.data.compliance_task_id);
  } else {
    let recurrenceTask = [];
    const startDate = new Date(data.deadline);

    // date and number of repetitions in a year, data.recurrence is the "Weekly", "Monthly", "Quarterly", "Yearly"
    const numberOfRepetitions = {
      Weekly: 52,
      Monthly: 12,
      Quarterly: 4,
      Yearly: 1,
    };
    const numberOfRepetitionsInYearCount = numberOfRepetitions[recurrence] * 1; // 1 year

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
      recurrenceTask.push({
        ...data,
        description: `${data.description} #${data.recurrence} ${i + 1}`,
        deadline: newDate,
      });
    }
    const response = await Promise.all(
      recurrenceTask.map((task) => createTask(task)),
    );

    response.forEach((res) => {
      compliance_task_ids.push(res.data.compliance_task_id);
    });
  }

  toast.success("Task Created", {
    id: "task-loading",
    description: "Task Created Successfully",
  });

  if (attachments && attachments.length > 0) {
    toast.loading("Uploading Attachments", {
      id: "task-loading",
      description: "Uploading Attachments to Task",
    });

    const promises = compliance_task_ids.map((compliance_task_id) => {
      const attachmentsPromise = attachments.map((attachment) => {
        const fileUploadPromise = fileUpload(
          attachment,
          document_type,
          compliance_task_id,
        );
        return fileUploadPromise;
      });
      return attachmentsPromise;
    });

    await Promise.all(promises);
    toast.success("Attachments Uploaded", {
      id: "task-loading",
      description: "Attachments Uploaded Successfully",
    });
  }
};

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-task-state"],
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
        description: error.message,
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries(["task-query"]);
      // toast.dismiss("task-loading");
    },
  });
}
