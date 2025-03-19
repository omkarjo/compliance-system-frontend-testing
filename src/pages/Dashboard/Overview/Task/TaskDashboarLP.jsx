import SheetTaskViewLP from "@/components/Dashboard/sheet/sheet-task-view-lp";
import TableTaskViewLP from "@/components/Dashboard/tables/table-task-view-lp";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import queryClient from "@/query/queryClient";
import { taskSchema } from "@/schemas/zod/taskSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function TaskDashboardLimitedPartner() {
  const [sheetTask, setSheetTask] = useState({
    isOpen: false,
  });

  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {},
  });

  const tabs = [
    {
      title: "List",
      value: "list",
      childern: (
        <TableTaskViewLP
          openView={(data) => {
            setSheetTask({ isOpen: true, data });
          }}
        />
      ),
    },
  ];

  const onSubmit = useCallback(async (data) => {
    console.log("rest", data);
    toast.success("Task created successfully");
    queryClient.invalidateQueries("tasks");
  }, []);

  const defaultTabs = localStorage.getItem("LPtaskTabs") || "list";

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
        <main className="mx-4 flex-1">
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.childern}
            </TabsContent>
          ))}
        </main>
      </Tabs>
      <SheetTaskViewLP
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        data={sheetTask.data}
        isOpen={sheetTask.isOpen}
        openView={(data) => setSheetTask({ isOpen: true, data })}
        onClose={() => setSheetTask({ isOpen: false, data: null })}
      />
    </section>
  );
}
