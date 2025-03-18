import DialogForm from "@/components/Dashboard/includes/dialog-form";
import SheetLP from "@/components/Dashboard/includes/sheet-lp";
import ViewList from "@/components/Dashboard/view-list-lp";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import queryClient from "@/query/queryClient";
import { lpFromFields } from "@/schemas/form/lpSchema";
import { lpSchema } from "@/schemas/zod/lpSchema";
import { apiWithAuth } from "@/utils/api";
import fileUpload from "@/utils/file-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LPDashboard() {
  // Complete defaultValues that align exactly with your schema
  const defaultValues = {
    lp_name: "",
    gender: undefined, // enum fields can be undefined initially
    dob: null,
    mobile_no: "",
    email: "",
    pan: "",
    address: "",
    nominee: "",
    commitment_amount: "",
    acknowledgement_of_ppm: undefined,
    cml: [],
    depository: undefined,
    dpid: "",
    client_id: "",
    class_of_shares: undefined,
    isin: "",
    type: undefined,
    citizenship: undefined,
    geography: "",
    emaildrawdowns: "",
    documents: [], // Not in schema but used in your component
  };

  const [sheetTask, setSheetTask] = useState({
    isOpen: false,
    data: null,
  });

  const [dialogTask, setDialogTask] = useState({
    isOpen: false,
    variant: "",
    defaultValues: defaultValues
  });

  const form = useForm({
    resolver: zodResolver(lpSchema),
    defaultValues: defaultValues,
    mode: "onChange" // Validate on change for better user experience
  });

  // Reset form when dialog closes to prevent stale values
  useEffect(() => {
    if (!dialogTask.isOpen) {
      form.reset(defaultValues);
    }
  }, [dialogTask.isOpen, form]);

  const handleDialogTaskOpen = useCallback(
    (variant) => {
      if (variant === "create") {
        // Reset form before opening to ensure clean state
        form.reset(defaultValues);
        setDialogTask({ isOpen: true, variant: "create", defaultValues: defaultValues });
      } else {
        // For edit functionality
        // setDialogTask({ isOpen: true, variant: "edit", defaultValues: {} });
      }
    },
    [defaultValues, form],
  );

  const handleDialogTaskClose = useCallback(() => {
    // Reset form when closing dialog
    form.reset(defaultValues);
    setDialogTask((prev) => ({ ...prev, isOpen: false }));
  }, [form, defaultValues]);

  const onSubmit = useCallback(
    async (data) => {
      const { cml, documents, dob, ...rest } = data;
      const body = {
        ...rest,
        dob: dob ? dob.toISOString().split("T")[0] : null,
      };

      try {
        // Check if cml exists and has at least one file
        if (!cml || !cml.length) {
          toast.error("Please upload the CML document");
          return;
        }

        const file = cml[0];
        const uploadResponse = await fileUpload(file, "Contribution Agreement");
        body.cml = uploadResponse.data.document_id;

        const response = await apiWithAuth.post("/api/lps", body);
        console.log(response);
        toast.success("Limited Partner Added Successfully");
        queryClient.invalidateQueries("lp-querry");

        // Reset form with complete default values
        form.reset(defaultValues);
        handleDialogTaskClose();
      } catch (error) {
        console.log(error);
        toast.error("Failed to onboard Limited Partner", {
          description: error.response?.data?.detail || "Unknown error occurred",
        });
      }
    },
    [handleDialogTaskClose, form, defaultValues],
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
              <span className="max-md:hidden">Onboard Limited Partner</span>
            </Button>
          </div>
        </div>
        <main className="mx-4 flex-1">
          <ViewList openView={(data) => setSheetTask({ isOpen: true, data })} />
        </main>
      </Tabs>
      <DialogForm
        title={"Onboard new Limited Partner"}
        description={
          "You can upload the 'Contribution Agreement' to automatically fill all fields."
        }
        submitText={"Onboard"}
        form={form}
        onSubmit={form.handleSubmit((data) => onSubmit(data))}
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