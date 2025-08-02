import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SebiReportSchema } from "@/schemas/zod/SebiReportSchema";
import { sebiReportFormFields } from "@/schemas/form/SEBIReportSchema";
import { formatDate } from "date-fns";
import DialogForm from "@/components/Dashboard/includes/dialog-form";
import { toast } from "sonner";
import TableSebiReportsView from "@/components/Dashboard/tables/TableSebiReportsView";

export default function SEBIReportPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(SebiReportSchema),
  });

  // const createSEBIReport = useCreateSEBIReport();

  const handleSubmit = useCallback(
    async (data) => {
      const payload = {
        ...data,
        report_date: data?.report_date
          ? formatDate(new Date(data.report_date), "yyyy-MM-dd")
          : null,
      };

      // createSEBIReport.mutate(payload, {
      //   onSuccess: (res) => {
      //     toast.success("SEBI Report created successfully");
      //     setDialogOpen(false);
      //     form.reset();
      //   },
      //   onError: (err) => {
      //     toast.error("Failed to create SEBI Report", {
      //       description: err?.response?.data?.detail || "Something went wrong",
      //     });
      //   },
      // });
    },
    [form],
  );

  return (
    <section>
      <div className="flex items-center justify-between px-4 py-2">
        <h2 className="text-lg font-semibold">SEBI Reports</h2>
        <Button
          className="flex items-center gap-1"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Create SEBI Report
        </Button>
      </div>

      <main className="mx-4 flex-1">
        <TableSebiReportsView />
      </main>

      <DialogForm
        title="Create SEBI Report"
        description="Fill out the details to create a new SEBI report."
        submitText="Create"
        form={form}
        onSubmit={form.handleSubmit(handleSubmit)}
        formFields={sebiReportFormFields}
        isOpen={dialogOpen}
        onClose={setDialogOpen}
        variant="create"
        hiddenFields={[]}
        disabledFields={[]}
        specialProps={[]}
      />
    </section>
  );
}
