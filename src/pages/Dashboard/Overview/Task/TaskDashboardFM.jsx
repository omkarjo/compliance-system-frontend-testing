import ViewCalendarTaskAdmin from "@/components/Dashboard/calander/view-calander-task-admin";
import DeleteAlertDialog from "@/components/Dashboard/includes/delete-alert-dilog";
import DialogForm from "@/components/Dashboard/includes/dialog-form";
import SheetTaskViewFM from "@/components/Dashboard/sheet/sheet-task-view-fm";
import TableTaskViewFM from "@/components/Dashboard/tables/table-task-view-fm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { taskApiPaths } from "@/constant/apiPaths";
import queryClient from "@/query/queryClient";
import { taskFormFields } from "@/schemas/form/taskSchema";
import { taskSchema } from "@/schemas/zod/taskSchema";
import { apiWithAuth } from "@/utils/api";
import useCheckRoles from "@/utils/check-roles";
import fileUpload from "@/utils/file-upload";
import { usePermissionTaskChange } from "@/utils/havePermission";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
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

export default function TaskDashboardFundManager() {
  const haveAdminPermission = useCheckRoles("Fund Manager");

  const DialogTaskVariant = {
    create: {
      title: "Create Task",
      description:
        "Create a new task by filling out the form below. All task need to be assigned to someone.",
      submit: "Create",
    },
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

  const [deleteAlertDialog, setDeleteAlertDialog] = useState({
    isOpen: false,
    compliance_task_id: "",
    title: "",
    description: "",
    onDelete: null,
  });

  const [sheetTask, setSheetTask] = useState({
    isOpen: false,
  });

  const handleDialogTaskClose = useCallback((isOpen) => {
    setDialogTask((prev) => ({ ...prev, isOpen }));
  }, []);

  const handleDeleteAlertDialogClose = useCallback((isOpen) => {
    setDeleteAlertDialog((prev) => ({
      ...prev,
      isOpen,
      onDelete: null,
    }));
  }, []);

  const handleDeleteTask = useCallback(async () => {
    try {
      console.log("deleteAlertDialog", deleteAlertDialog);
      await apiWithAuth.delete(
        `${taskApiPaths.deleteTaskPrefix}${deleteAlertDialog.compliance_task_id}`,
      );
      toast.success("Task deleted successfully");
      handleDeleteAlertDialogClose(false);
      queryClient.invalidateQueries("task-query");
    } catch (error) {
      toast.error("Failed to delete task", {
        description: error?.response?.data?.message || "An error occurred",
      });
    }
  }, [handleDeleteAlertDialogClose, deleteAlertDialog]);

  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: defaultValues,
  });

  const handleDialogTaskOpen = useCallback(
    (variant, data, compliance_task_id) => {
      if (variant === "create") {
        form.reset(defaultValues);

        setDialogTask({
          isOpen: true,
          variant: "create",
          defaultValues: {},
          compliance_task_id: "",
        });
      } else {
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
        };

        console.log("data", data);

        if (data.assignee_id !== data.reviewer_id) {
          formValues.different_reviewer = true;
          formValues.reviewer_id = data.reviewer_id;
          formValues.different_final_reviewer =
            data.approver_id !== data.reviewer_id;
          formValues.approver_id = data.approver_id;
        } else {
          formValues.different_reviewer = false;
          formValues.reviewer_id = data.assignee_id;
          formValues.different_final_reviewer = false;
          formValues.approver_id = data.assignee_id;
        }

        console.log("formValues", formValues);
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
    {
      title: "Delete",
      className: "text-red-500",
      onClick: (data) => {
        console.log("data", data);

        if (!haveAdminPermission(data)) {
          setDeleteAlertDialog({
            isOpen: true,
            title: `Cannot delete task “${data.description}”`,
            description: `You cannot delete this task as task “${data.description}” depends on this task. Please remove the dependency before trying to delete this task.`,
            onDelete: null,
            compliance_task_id: data.compliance_task_id,
          });
          return;
        }

        setDeleteAlertDialog({
          isOpen: true,
          title: `Are you absolutely sure you want to delete the “${data.description}” task?`,
          description:
            "This action cannot be undone. This will permanently delete the task.",
          onDelete: handleDeleteTask,
          compliance_task_id: data.compliance_task_id,
        });
      },
    },
  ];

  const tabs = [
    {
      title: "List",
      value: "list",
      children: (
        <TableTaskViewFM
          actionType={actionType}
          openView={(data) => {
            setSheetTask({ isOpen: true, data });
          }}
          openEdit={(data) => {
            handleDialogTaskOpen("edit", data, data.compliance_task_id);
          }}
        />
      ),
    },
    {
      title: "Calendar",
      value: "calendar",
      children: <ViewCalendarTaskAdmin />,
    },
  ];

  const createTask = useCallback(async (data) => {
    try {
      const response = await apiWithAuth.post(taskApiPaths.createTask, data);
      toast.success("Task created successfully");
      return response;
    } catch (error) {
      toast.error("Failed to create task", {
        description: error?.response?.data?.message || "An error occured",
      });
    }
  }, []);

  const editTask = useCallback(
    async (data) => {
      try {
        const response = await apiWithAuth.patch(
          `${taskApiPaths.updateTaskPrefix}${dialogTask.compliance_task_id}`,
          data,
        );
        toast.success("Task updated successfully");
        return response;
      } catch (error) {
        toast.error("Failed to update task", {
          description: error?.response?.data?.message || "An error occured",
        });
      }
    },
    [dialogTask.compliance_task_id],
  );

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
      let compliance_task_id = dialogTask.compliance_task_id || null;

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

      try {
        if (dialogTask.variant === "create") {
          const response = await createTask(rest);
          // console.log("response", response);
          compliance_task_id = response.data.compliance_task_id;
          // console.log("compliance_task_id", compliance_task_id);
          if (!compliance_task_id) {
            toast.error("Failed to create task", {
              description: "Unable to get task id",
            });
            return;
          }
          // console.log("data", data);
        } else {
          await editTask(rest);
        }

        handleDialogTaskClose(false);
        if (attachments?.length) {
          try {
            const promises = attachments.map((file) =>
              fileUpload(file, document_type, compliance_task_id),
            );
            await Promise.all(promises);

            toast.success("Files uploaded successfully");
          } catch (error) {
            toast.error("Failed to upload file", {
              description:
                error?.response?.data?.message || "An error occurred",
            });
          }
        }

        form.reset({});
        queryClient.invalidateQueries("task-query");
      } catch (error) {
        toast.error("Failed to process task", {
          description: error?.response?.data?.message || "An error occurred",
        });
      }
    },
    [
      createTask,
      dialogTask.variant,
      dialogTask.compliance_task_id,
      editTask,
      form,
      handleDialogTaskClose,
    ],
  );

  const defaultTabs = localStorage.getItem("taskTabs") || "list";

  const handelTabChange = useCallback((value) => {
    localStorage.setItem("taskTabs", value);
  }, []);

  // console.log("formErrors", form.formState.errors);
  // console.log("formValues", form.getValues());

  return (
    <section className="">
      <Tabs
        defaultValue={defaultTabs}
        className="h-full w-full"
        onValueChange={handelTabChange}
      >
        <div className="flex items-center justify-between gap-4 px-4 py-2">
          <div className="flex items-center gap-2">
            <Button
              className="flex items-center gap-1 px-3 text-sm"
              onClick={() => handleDialogTaskOpen("create")}
            >
              <Plus className="size-4" />{" "}
              <span className="max-md:hidden">Create Task</span>
            </Button>
          </div>
          <div className="px-4 py-2">
            <TabsList className={"flex gap-2"}>
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  disabled={tab?.disabled}
                >
                  <span className="px-0.5 py-0.5 text-xs md:text-sm">
                    {tab.title}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
        <main className="mx-4 flex-1">
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.children}
            </TabsContent>
          ))}
        </main>
      </Tabs>
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
        hiddenFields={[
          ...(form.watch("repeat") ? [] : ["recurrence"]),
          ...(form.watch("different_reviewer")
            ? []
            : ["reviewer_id", "approver_id", "different_final_reviewer"]),
          ...(form.watch("different_reviewer") &&
          form.watch("different_final_reviewer")
            ? []
            : ["approver_id"]),
          ...(form.watch("attachments")?.length ? [] : ["document_type"]),
        ]}
      />
      <SheetTaskViewFM
        data={sheetTask.data}
        isOpen={sheetTask.isOpen}
        openEdit={(data) =>
          handleDialogTaskOpen("edit", data, data.compliance_task_id)
        }
        openView={(data) => setSheetTask({ isOpen: true, data })}
        onClose={() => setSheetTask({ isOpen: false, data: null })}
      />
      <DeleteAlertDialog
        title={deleteAlertDialog.title}
        description={deleteAlertDialog.description}
        isOpen={deleteAlertDialog.isOpen}
        onClose={handleDeleteAlertDialogClose}
        onDelete={deleteAlertDialog.onDelete}
      />
    </section>
  );
}
