import ViewCalanderTaskAdmin from "@/components/Dashboard/calander/view-calander-task-admin";
import DialogForm from "@/components/Dashboard/includes/dialog-form";
import SheetTaskViewFM from "@/components/Dashboard/sheet/sheet-task-view-fm";
import TableTaskViewFM from "@/components/Dashboard/tables/table-task-view-fm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import queryClient from "@/query/queryClient";
import { taskFormFields } from "@/schemas/form/taskSchema";
import { taskSchema } from "@/schemas/zod/taskSchema";
import { apiWithAuth } from "@/utils/api";
import fileUpload from "@/utils/file-upload";
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
  assignee_id: "",
  reviewer_id: "",
  approver_id: "",
  document_type: "",
};

export default function TaskDashboardFundManager() {
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
        const formValues = {
          description: data.description,
          category: data.category,
          completion_criteria: data.completion_criteria,
          repeat: data.recurrence != null,
          recurrence: data.recurrence || "",
          predecessor_task: data.predecessor_task,
          assignee_id: data.assignee_id,
          reviewer_id: data.reviewer_id,
          approver_id: data.approver_id,
          deadline: new Date(data.deadline),
        };

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
        handleDialogTaskOpen("edit", data, data.compliance_task_id);
      },
    },
    { title: "Delete", className: "text-red-500", onClick: () => {} },
  ];

  const tabs = [
    {
      title: "List",
      value: "list",
      childern: (
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
      childern: <ViewCalanderTaskAdmin />,
    },
  ];

  const createTask = useCallback(async (data) => {
    try {
      const response = await apiWithAuth.post("/api/tasks/", data);
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
          `/api/tasks/${dialogTask.compliance_task_id}`,
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
      let { attachments, repeat, document_type, ...rest } = data;
      let compliance_task_id = dialogTask.compliance_task_id || null;
      if (!repeat) {
        rest.recurrence = undefined;
      }

      try {
        if (dialogTask.variant === "create") {
          const response = await createTask(rest);
          console.log("response", response);
          compliance_task_id = response.data.compliance_task_id;
          console.log("compliance_task_id", compliance_task_id);
          if (!compliance_task_id) {
            toast.error("Failed to create task", {
              description: "Unable to get task id",
            });
            return;
          }
          console.log("data", data);
        } else {
          await editTask(rest);
        }

        if (attachments?.length) {
          try {
            const promises = attachments.map((file) =>
              fileUpload(file, document_type),
            );
            const uploadResponse = await Promise.all(promises);
            const document_ids = uploadResponse.map(
              (res) => res.data.document_id,
            );

            console.log("document_ids", document_ids);

            // const linkPromises = document_ids.map((document_id) => {
            //   return apiWithAuth.post(
            //     `/api/documents/${document_id}/link-to-task`,
            //     {
            //       compliance_task_id: compliance_task_id,
            //       document_id: document_id,
            //     },
            //   );
            // });

            // await Promise.all(linkPromises);
            toast.success("Files uploaded successfully");
          } catch (error) {
            toast.error("Failed to upload file", {
              description:
                error?.response?.data?.message || "An error occurred",
            });
          }
        }

        handleDialogTaskClose(false);
        form.reset({});
        queryClient.invalidateQueries("task-querry");
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
              {tab.childern}
            </TabsContent>
          ))}
        </main>
      </Tabs>
      <DialogForm
        tabinde
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
          ...((form.watch("attachments")?.length > 0) ? [] : ["document_type"]),
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
    </section>
  );
}
