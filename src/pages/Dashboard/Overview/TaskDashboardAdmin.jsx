import DialogForm from "@/components/Dashboard/includes/dialog-form";
import SheetTask from "@/components/Dashboard/includes/sheet-task";
import ViewList from "@/components/Dashboard/view-list-task";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  taskFormFieldsPart1,
  taskFormFieldsPart2,
  taskFormFieldsPart3,
} from "@/schemas/form/taskSchema";
import { taskSchema } from "@/schemas/zod/taskSchema";
import { apiWithAuth } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function TaskDashboard() {
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

  const [dialogTask, setFialogTask] = useState({
    isOpen: false,
    variant: "",
  });

  const [sheetTask, setSheetTask] = useState({
    isOpen: false,
  });

  const actionType = [
    {
      title: "View",
      className: "",
      onClick: (id) => {
        console.log(id);
        setSheetTask({ isOpen: true });
      },
    },
    { title: "Edit", className: "", onClick: () => {} },
    { title: "Delete", className: "text-red-500", onClick: () => {} },
  ];

  const handleDialogTaskOpen = useCallback((variant) => {
    if (variant === "create") {
      setFialogTask({ isOpen: true, variant: "create", defaultValues: {} });
    } else {
      setFialogTask({ isOpen: true, variant: "edit", defaultValues: {} });
    }
  }, []);

  const handleDialogTaskClose = useCallback((isOpen) => {
    setFialogTask((prev) => ({ ...prev, isOpen }));
  }, []);

  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      completion_criteria: "",
      repeat: false,
      predecessor_task: "",
      attachements: [],
      assignee_id: "",
      reviewer_id: "",
      approver_id: "",
    },
  });

  const tabs = [
    {
      title: "List",
      value: "list",
      childern: (
        <ViewList
          actionType={actionType}
          openView={(data) => {
            setSheetTask({ isOpen: true, data });
          }}
        />
      ),
    },
    {
      title: "Calendar",
      value: "calendar",
      childern: <div>calendar</div>,
      disabled: true,
    },
  ];

  const onSubmit = useCallback(
    async (data) => {
      console.log(data);
      try {
        await apiWithAuth.post("/api/tasks/", data);
        form.reset();
        toast.success("Task created successfully");
        handleDialogTaskClose(false);
      } catch (error) {
        toast.error("Failed to create task");
      }
    },
    [handleDialogTaskClose, form],
  );

  return (
    <section className="">
      <Tabs defaultValue="list" className="h-full w-full">
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
        title={DialogTaskVariant[dialogTask.variant]?.title}
        description={DialogTaskVariant[dialogTask.variant]?.description}
        submitText={DialogTaskVariant[dialogTask.variant]?.submit}
        form={form}
        onSubmit={form.handleSubmit((data) => onSubmit(data))}
        formFields={[
          ...taskFormFieldsPart1,
          ...(form.watch("repeat") ? taskFormFieldsPart2 : []),
          ...taskFormFieldsPart3,
        ]}
        isOpen={dialogTask.isOpen}
        onClose={handleDialogTaskClose}
        variant={dialogTask.variant}
      />
      <SheetTask
        data={sheetTask.data}
        isOpen={sheetTask.isOpen}
        openView={(data) => setSheetTask({ isOpen: true, data })}
        onClose={() => setSheetTask({ isOpen: false, data: null })}
        // onEditButtonClick={}
      />
    </section>
  );
}
