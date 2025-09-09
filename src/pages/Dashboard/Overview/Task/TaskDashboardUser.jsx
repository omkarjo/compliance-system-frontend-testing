import DialogForm from "@/components/layout/dashboard/includes/dialog-form";
import TableTaskViewUser from "@/components/business/tasks/TableTaskViewUser";
import { useUpdateTask } from "@/react-query/mutations/task/updateTask";
import { taskFormFields } from "@/schemas/feilds/taskFeilds";
import { taskSchema } from "@/schemas/zod/taskSchema";
import { usePermissionTaskChange } from "@/utils/havePermission";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const defaultValues = {
  description: "",
  category: "",
  completion_criteria: "",
  repeat: false,
  predecessor_task: "",
  attachments: [],
  document_type: undefined,
  assignee_id: "",
  reviewer_id: "",
  approver_id: "",
};

export default function TaskDashboardUser() {
  const editTask = useUpdateTask();
  const DialogTaskVariant = {
    edit: {
      title: "Edit Task",
      description: "You can edit the task by changing the details below.",
      submit: "Save",
    },
  };

  const [dialogTask, setDialogTask] = useState({
    isOpen: false,
    variant: "",
    compliance_task_id: "",
    defaultValues: {},
  });

  const [sheetTask, setSheetTask] = useState({
    isOpen: false,
  });

  const handleDialogTaskClose = useCallback((isOpen) => {
    setDialogTask((prev) => ({ ...prev, isOpen }));
  }, []);

  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: defaultValues,
  });

  const handleDialogTaskOpen = useCallback(
    (variant, data, compliance_task_id) => {
      if (variant === "edit") {
        // For edit mode, use a single reset call with all values
        let formValues = {
          description: data.description,
          category: data.category,
          completion_criteria: data.completion_criteria,
          repeat: data.recurrence != null,
          recurrence: data.recurrence || "",
          predecessor_task: data.predecessor_task,
          assignee_id: data.assignee_id,
          deadline: new Date(data.deadline),
          attachments: data.documents
            ? data.documents?.map((doc) => {
                return {
                  name: doc.name,
                  id: doc.document_id,
                  url: doc.drive_link,
                };
              })
            : [],
          document_type:
            data.documents || data.documents?.length > 0
              ? data.documents[0]?.category
              : undefined,
        };

        if (
          data.approver_id === data.reviewer_id &&
          data.approver_id === data.assignee_id
        ) {
          formValues.different_reviewer = false;
          formValues.different_final_reviewer = false;
        } else if (data.approver_id === data.reviewer_id) {
          formValues.different_reviewer = true;
          formValues.different_final_reviewer = false;
        } else if (data.approver_id !== data.reviewer_id) {
          formValues.different_reviewer = true;
          formValues.different_final_reviewer = true;
        }

        formValues.reviewer_id = data.reviewer_id;
        formValues.approver_id = data.approver_id;
        formValues.assignee_id = data.assignee_id;

        form.reset(formValues);

        setDialogTask({
          isOpen: true,
          variant: "edit",
          defaultValues: data,
          compliance_task_id,
        });
        setSheetTask({ isOpen: false, data: null });
      }
    },
    [form],
  );

  const havePermission = usePermissionTaskChange();

  const actionType = [
    {
      title: "View",
      className: "",
      onClick: (data) => {
        setSheetTask({ isOpen: true, data });
      },
    },
    {
      title: "Edit",
      className: "",
      onClick: (data) => {
        if (!havePermission(data)) {
          toast.error("You don't have permission to edit this task", {
            description: "You are not the assignee or approver of this task",
          });
          return;
        }
        handleDialogTaskOpen("edit", data, data.compliance_task_id);
      },
    },
  ];

  const subActions = [
    {
      label: "Edit Task",
      onClick: (data) => {
        handleDialogTaskOpen("edit", data, data.compliance_task_id);
      },
      className: "",
    },
  ];

  const onSubmit = useCallback(
    async (data) => {
      let {
        attachments,
        repeat,
        document_type,
        different_reviewer,
        different_final_reviewer,
        ...rest
      } = data;

      // Repeat and Recurrence handling
      if (!repeat) {
        rest.recurrence = undefined;
      } else {
        if (!rest.recurrence) {
          form.setError("recurrence", {
            type: "manual",
            message: "Recurrence is required",
          });
          return;
        }
      }

      // Handling the same reviewer and approver
      if (different_reviewer) {
        if (!rest.reviewer_id) {
          form.setError("reviewer_id", {
            type: "manual",
            message: "Reviewer is required",
          });
          return;
        }

        if (different_final_reviewer) {
          if (!rest.approver_id) {
            form.setError("approver_id", {
              type: "manual",
              message: "Final Reviewer is required",
            });
            return;
          }
        } else {
          rest.approver_id = rest.reviewer_id;
        }
      } else {
        rest.reviewer_id = rest.assignee_id;
        rest.approver_id = rest.assignee_id;
      }

      // Handling the attachments
      if (attachments?.length) {
        if (!document_type) {
          form.setError("document_type", {
            type: "manual",
            message: "Document Type is required",
          });
          return;
        }
      }

      // Filter files attached to the task
      attachments = attachments.filter((attachment) => {
        return attachment instanceof File;
      });
      console.log("attachments", attachments);

      editTask.mutate({
        compliance_task_id: dialogTask.compliance_task_id,
        data: rest,
        attachments,
        document_type,
      });

      handleDialogTaskClose(false);
      form.reset({});
    },
    [form, handleDialogTaskClose, dialogTask, editTask],
  );

  // console.log("formErrors", form.formState.errors);
  // console.log("formValues", form.getValues());

  return (
    <section className="mx-auto mt-4 w-full px-4 py-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Task Dashboard</h1>
      </div>
      {/* <hr className="my-4" /> */}
      <TableTaskViewUser
        actionType={actionType}
        openView={(data) => {
          setSheetTask({ isOpen: true, data });
        }}
        openEdit={(data) => {
          handleDialogTaskOpen("edit", data, data.compliance_task_id);
        }}
      />
      <DialogForm
        tabindex={0}
        title={DialogTaskVariant[dialogTask.variant]?.title}
        description={DialogTaskVariant[dialogTask.variant]?.description}
        submitText={DialogTaskVariant[dialogTask.variant]?.submit}
        form={form}
        onSubmit={form.handleSubmit((data) => onSubmit(data))}
        formFields={taskFormFields}
        isOpen={dialogTask.isOpen}
        onClose={handleDialogTaskClose}
        variant={dialogTask.variant}
        disabledFields={[
          ...(dialogTask.variant === "edit" ? ["recurrence", "repeat"] : []),
        ]}
        hiddenFields={[
          ...(form.watch("repeat") ? [] : ["recurrence"]),
          ...(form.watch("different_reviewer")
            ? []
            : ["reviewer_id", "approver_id", "different_final_reviewer"]),
          ...(form.watch("different_reviewer") &&
          form.watch("different_final_reviewer")
            ? []
            : ["approver_id"]),
          ...(Array.isArray(form.watch("attachments")) &&
          form.watch("attachments").length > 0 &&
          form
            .watch("attachments")
            .some((attachment) => attachment instanceof File)
            ? []
            : ["document_type"]),
        ]}
        specialProps={[
          {
            name: "predecessor_task",
            props: {
              end_date: form.watch("deadline"),
            },
          },
        ]}
      />
      {/* <SheetTaskViewFM
        data={sheetTask.data}
        isOpen={sheetTask.isOpen}
        buttons={subActions}
        onClose={() => setSheetTask({ isOpen: false, data: null })}
      /> */}
    </section>
  );
}
