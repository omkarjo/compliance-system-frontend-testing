import { useLPOnboarding } from "@/actions/LPOnboarding";
import DialogForm from "@/components/Dashboard/includes/dialog-form";
import SheetLPViewFM from "@/components/Dashboard/sheet/sheet-lp-view-fm";
import TableLPViewFM from "@/components/Dashboard/tables/table-lp-view-fm";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { lpFromFields } from "@/schemas/form/lpSchema";
import { lpSchema } from "@/schemas/zod/lpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const defaultValues = {
  lp_name: "",
  gender: "",
  mobile_no: "",
  email: "",
  pan: "",
  address: "",
  nominee: "",
  commitment_amount: "",
  acknowledgement_of_ppm: undefined,
  cml: [],
  // depository: undefined,
  dpid: "",
  client_id: "",
  class_of_shares: undefined,
  isin: "",
  type: undefined,
  citizenship: undefined,
  geography: "",
  emaildrawdowns: [],
  documents: [],
};

export default function LPDashboard() {
  const [sheetTask, setSheetTask] = useState({
    isOpen: false,
    data: null,
  });

  const [dialogTask, setDialogTask] = useState({
    isOpen: false,
    variant: "",
    defaultValues: defaultValues,
  });

  const onboardingMutation = useLPOnboarding();

  const form = useForm({
    resolver: zodResolver(lpSchema),
    defaultValues: defaultValues,
    // mode: "onChange",
  });

  useEffect(() => {
    if (!dialogTask.isOpen) {
      form.reset(defaultValues);
    }
  }, [dialogTask.isOpen, form]);

  const handleDialogTaskOpen = useCallback(
    (variant) => {
      if (variant === "create") {
        form.reset(defaultValues);
        setDialogTask({
          isOpen: true,
          variant: "create",
          defaultValues: defaultValues,
        });
      } else {
        // setDialogTask({ isOpen: true, variant: "edit", defaultValues: {} });
      }
    },
    [form],
  );

  const handleDialogTaskClose = useCallback(() => {
    form.reset(defaultValues);
    setDialogTask((prev) => ({ ...prev, isOpen: false }));
  }, [form]);

  const onSubmit = useCallback(
    async (data) => {
      const { cml, documents, emaildrawdowns, ...rest } = data;

      const body = {
        ...rest,
        emaildrawdowns: emaildrawdowns.join(","),
      };

      try {
        const result = await onboardingMutation.mutate({
          lpData: body,
          cmlFile: cml[0],
        });
        form.reset(defaultValues);
        handleDialogTaskClose();
      } catch (error) {
        // console.log(error);
        toast.error("Failed to onboard Limited Partner", {
          description: error.response?.data?.detail || "Unknown error occurred",
        });
      }
    },
    [form, onboardingMutation, handleDialogTaskClose],
  );

  useEffect(() => {
    const classOfShares = form.watch("class_of_shares");
    if (classOfShares) {
      form.setValue("isin", classOfShares);
    }
  }, [form.watch("class_of_shares")]);
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
          <TableLPViewFM
            openView={(data) => setSheetTask({ isOpen: true, data })}
          />
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
      <SheetLPViewFM
        isOpen={sheetTask.isOpen}
        data={sheetTask.data}
        onClose={() => setSheetTask({ isOpen: false, data: null })}
      />
    </section>
  );
}
