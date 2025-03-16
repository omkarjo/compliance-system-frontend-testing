import DialogForm from "@/components/Dashboard/includes/dialog-form";
import SheetLP from "@/components/Dashboard/includes/sheet-lp";
import ViewList from "@/components/Dashboard/view-list-lp";
import DataTable from "@/components/includes/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import queryClient from "@/query/queryClient";
import { lpFromFields } from "@/schemas/form/lpSchema";
import { lpSchema } from "@/schemas/zod/lpSchema";
import { apiWithAuth } from "@/utils/api";
import fileUpload from "@/utils/file-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LPDashboard() {
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

  const [dialogTask, setFialogTask] = useState({
    isOpen: false,
    variant: "",
    defaultValues: {},
  });

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
    resolver: zodResolver(lpSchema),
    defaultValues: {},
  });

  const onSubmit = useCallback(
    async (data) => {
      const { cml_file, dob, ...rest } = data;
      const body = {
        ...rest,
        dob: dob.toISOString().split("T")[0],
        cml: cml_file?.at(0).document_id,
      };
      try {
        const response = await apiWithAuth.post("/api/lps", body);
        console.log(response);
        toast.success("Limited Partner onboarded successfully");
        queryClient.invalidateQueries("lp-querry");
        form.reset();
        handleDialogTaskClose(false);
      } catch (error) {
        console.log(error);
        toast.error("Failed to onboard Limited Partner", {
          description: error.response.data.detail,
        });
      }
    },
    [handleDialogTaskClose, form],
  );

  const onFileChange = useCallback(async (file, setFiles = () => {}) => {
    try {
      const allUploadedFiles = await Promise.all(
        file.map((file) => fileUpload(file, "Other")),
      );
      const uploadedFiles = allUploadedFiles.map((file) => file.data);
      console.log(uploadedFiles);
      setFiles(uploadedFiles);
    } catch (error) {
      console.log(error);
    }
  }, []);

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
              <span className="max-md:hidden">Onboard Limiting Partner</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="flex items-center gap-1 text-sm"
                  variant={"secondary"}
                >
                  <span className="max-md:hidden">Action</span>
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </div>
        </div>
        <main className="mx-4 flex-1">
          <ViewList openView={(data) => setSheetTask({ isOpen: true, data })} />
        </main>
      </Tabs>
      <DialogForm
        title={"Onboard new Limited Partner"}
        description={
          "You can upload the ‘Contribution Agreement’ to automatically fill all fields."
        }
        submitText={"Onboard"}
        form={form}
        onSubmit={form.handleSubmit((data) => onSubmit(data))}
        onFileChange={onFileChange}
        formFields={lpFromFields}
        isOpen={dialogTask.isOpen}
        onClose={handleDialogTaskClose}
        variant={dialogTask.variant}
      />
      <SheetLP
        isOpen={sheetTask.isOpen}
        data={sheetTask.data}
        onClose={() => setSheetTask({ isOpen: false, data: null })}
      />
    </section>
  );
}
