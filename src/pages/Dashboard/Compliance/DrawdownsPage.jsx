import DialogForm from "@/components/Dashboard/includes/dialog-form";
import SheetLPViewFM from "@/components/Dashboard/sheet/sheet-lp-view-fm";
import CapitalCallDialogTable from "@/components/Dashboard/tables/table-capital-call-dilog";
import TableDrawdownView from "@/components/Dashboard/tables/table-drawdown-view";
import TableLPViewFM from "@/components/Dashboard/tables/table-lp-view-fm";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { campaignCapitalCallSchema } from "@/schemas/form/CaptialCallSchema";
import { lpFromFields } from "@/schemas/form/lpSchema";
import { lpSchema } from "@/schemas/zod/lpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function DrawdownsPage() {
  const [capitalCallTask, setCapitalCallTask] = useState({
    isOpen: false,
    variant: "",
  });

  const form = useForm({
    resolver: zodResolver(),
  });

  const handleCapitalCallOpen = useCallback(() => {
    form.reset();
    setCapitalCallTask((prev) => ({ ...prev, isOpen: true }));
  }, [form]);

  const handleCapitalCallClose = useCallback(() => {
    form.reset();
    setCapitalCallTask((prev) => ({ ...prev, isOpen: false }));
  }, [form]);

  return (
    <section className="">
      <div className="flex items-center justify-between gap-4 px-4 py-2">
        <div className="flex w-full items-center justify-between gap-2 px-2">
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              className="px-3"
              onClick={handleCapitalCallOpen}
            >
              Initiate Drawdown
            </Button>
          </div>
        </div>
      </div>
      <main className="mx-4 flex-1">
        <TableDrawdownView
          openView={(data) => setSheetTask({ isOpen: true, data })}
        />
      </main>

      <DialogForm
        title={"Drawdown Details"}
        description={"Send capital call to all onboarded Limited Partners"}
        submitText={"Send"}
        form={form}
        onSubmit={form.handleSubmit((data) => onSubmit(data))}
        formFields={campaignCapitalCallSchema}
        isOpen={capitalCallTask.isOpen}
        onClose={handleCapitalCallClose}
      >
        <CapitalCallDialogTable />
      </DialogForm>
    </section>
  );
}
