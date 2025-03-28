import { useLimitedPartnerOnboarding } from "@/actions/LPOnboarding";
import DialogForm from "@/components/Dashboard/includes/dialog-form";
import SheetLPViewFM from "@/components/Dashboard/sheet/sheet-lp-view-fm";
import TableLPViewFM from "@/components/Dashboard/tables/table-lp-view-fm";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { limitedPartnersApiPaths } from "@/constant/apiPaths";
import queryClient from "@/query/queryClient";
import { lpFromFields } from "@/schemas/form/lpSchema";
import { lpSchema } from "@/schemas/zod/lpSchema";
import { apiWithAuth } from "@/utils/api";
import fileUpload from "@/utils/file-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { use, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const defaultValues = {
  lp_name: "Test Limited Partner",
  gender: "Male",
  mobile_no: "9876543210",
  email: "greatnerve@gmail.com",
  pan: "ABCDE1234F",
  address: "Test Address",
  nominee: "Test Nominee",
  commitment_amount: "1000000",
  acknowledgement_of_ppm: undefined,
  cml: [],
  // depository: undefined,
  dpid: "123456789012",
  client_id: "123456789012",
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

  const onboardingMutation = useLimitedPartnerOnboarding();

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
        const result =  await onboardingMutation.mutate({
          lpData: body,
          cmlFile: cml[0],
        });
        console.log(result);

        // if (!cml || !cml.length) {
        //   toast.error("Please upload the CML document");
        //   return;
        // }

        // const file = cml[0];
        // const uploadResponse = await fileUpload(file, "Contribution Agreement");
        // body.cml = uploadResponse.data.document_id;

        // const response = await apiWithAuth.post(
        //   limitedPartnersApiPaths.createLimitedPartner,
        //   body,
        // );
        // // console.log(response);
        // toast.success("Limited Partner Added Successfully");
        // queryClient.invalidateQueries("lp-query");

        form.reset(defaultValues);
        handleDialogTaskClose();
      } catch (error) {
        // console.log(error);
        toast.error("Failed to onboard Limited Partner", {
          description: error.response?.data?.detail || "Unknown error occurred",
        });
      }
    },
    [handleDialogTaskClose, form],
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
