import ViewCalendarTaskAdmin from "@/components/Dashboard/calander/view-calander-task-admin";
import DeleteAlertDialog from "@/components/Dashboard/includes/delete-alert-dilog";
import DialogForm from "@/components/Dashboard/includes/dialog-form";
import SheetTaskViewFM from "@/components/Dashboard/sheet/sheet-task-view-fm";
import TableTaskViewFM from "@/components/Dashboard/tables/table-task-view-fm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { taskApiPaths } from "@/constant/apiPaths";
import { useCreateTask } from "@/react-query/mutations/task/createTask";
import { useUpdateTask } from "@/react-query/mutations/task/updateTask";
import { taskFormFields } from "@/schemas/form/taskSchema";
import { taskSchema } from "@/schemas/zod/taskSchema";
import { apiWithAuth } from "@/utils/api";
import useCheckRoles from "@/utils/check-roles";
import { usePermissionTaskChange } from "@/utils/havePermission";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

let defaultValues = {
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
  deadline: new Date(),
};

export default function TaskDashboardFundManager() {
  const queryClient = useQueryClient();
  const haveAdminPermission = useCheckRoles(["Fund Manager", "Compliance Officer"]);

  const createTask = useCreateTask();
  const editTask = useUpdateTask();
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

  const [defaultDeadlineByCalendar, setDefaultDeadlineByCalendar] = useState(
    new Date(),
  );

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

  const handleDeleteTask = useCallback(async (compliance_task_id) => {
    try {
      await apiWithAuth.delete(
        `${taskApiPaths.deleteTaskPrefix}${compliance_task_id}`,
      );
      toast.success("Task deleted successfully");
      queryClient.invalidateQueries("task-query");
    } catch (error) {
      toast.error("Failed to delete task", {
        description: error?.response?.data?.message || "An error occurred",
      });
    }
  }, []);

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
    {
      title: "Delete",
      className: "text-red-500",
      onClick: (data) => {
        handleDeleteTaskOpen(data);
      },
    },
  ];

  const handleDeleteTaskOpen = useCallback(
    (data) => {
      if (!haveAdminPermission) {
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
        onDelete: () => {
          handleDeleteTask(data.compliance_task_id);
          handleDeleteAlertDialogClose(false);
        },
        compliance_task_id: data.compliance_task_id,
      });
    },
    [handleDeleteAlertDialogClose, haveAdminPermission, handleDeleteTask],
  );

  const subActions = [
    {
      label: "Edit Task",
      onClick: (data) => {
        handleDialogTaskOpen("edit", data, data.compliance_task_id);
      },
      className: "",
    },
    {
      label: "Delete Task",
      icon: Trash2,
      onClick: (data) => {
        handleDeleteTaskOpen(data);
      },
      variant: "destructive",
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
      children: (
        <ViewCalendarTaskAdmin
          setSelectedDate={(date) => setDefaultDeadlineByCalendar(date)}
          buttons={haveAdminPermission ? subActions : []}
        />
      ),
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

      if (dialogTask.variant === "create") {
        createTask.mutate({
          data: rest,
          attachments,
          document_type,
        });
      } else {
        editTask.mutate({
          compliance_task_id: dialogTask.compliance_task_id,
          data: rest,
          attachments,
          document_type,
        });
      }

      handleDialogTaskClose(false);
      form.reset({});
    },
    [form, handleDialogTaskClose, createTask, dialogTask, editTask],
  );

  const defaultTabs = localStorage.getItem("taskTabs") || "list";

  const handelTabChange = useCallback((value) => {
    localStorage.setItem("taskTabs", value);
  }, []);

  useEffect(() => {
    console.log("Running");
    const today = new Date();

    if (defaultTabs === "calendar" && defaultDeadlineByCalendar) {
      const deadlineDate = new Date(defaultDeadlineByCalendar);
      if (deadlineDate < today.setHours(0, 0, 0, 0)) {
        defaultValues.deadline = today;
      } else {
        defaultValues.deadline = deadlineDate;
      }
    } else {
      defaultValues.deadline = today;
    }

    form.reset(defaultValues);
  }, [defaultDeadlineByCalendar, form, defaultTabs]);

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
              className="flex cursor-pointer items-center gap-1 px-3 text-sm"
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
      <SheetTaskViewFM
        data={sheetTask.data}
        isOpen={sheetTask.isOpen}
        buttons={haveAdminPermission ? subActions : []}
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
