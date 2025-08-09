import DialogForm from "@/components/Dashboard/includes/dialog-form";
import DrawdownTable from "@/components/Drawndown/DrawdownTable";
import PreviewDrawdownModal from "@/components/Drawndown/PreviewDrawdownModal";
import SheetDrawdownView from "@/components/Drawndown/SheetDrawdownView";
import { Button } from "@/components/ui/button";
import { serializeDates } from "@/lib/formatter";
import { useGenerateDrawdowns } from "@/react-query/mutations/drawndown/useGenerateDrawdowns";
import { usePreviewDrawdowns } from "@/react-query/mutations/drawndown/usePreviewDrawdowns";
import { useGetDrawdownById } from "@/react-query/query/drawdown/useGetDrawdownById";
import { drawnDownFeilds } from "@/schemas/form/DrawnDownSchema";
import { DrawdownSchema } from "@/schemas/zod/DrawdownSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate, useLocation } from "react-router";

export default function DrawdownsPage() {
  const [capitalCallTask, setCapitalCallTask] = useState({ isOpen: false });
  const [previewData, setPreviewData] = useState(null);
  const [sheet, setSheet] = useState({ isOpen: false, data: null });

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const action = searchParams.get("action");
  const navigate = useNavigate();
  const location = useLocation();

  const previewMutation = usePreviewDrawdowns();
  const generateMutation = useGenerateDrawdowns();
  const { data: drawdownData, isLoading } = useGetDrawdownById(id, {
    enabled: !!id && action === "view",
  });

  const form = useForm({
    resolver: zodResolver(DrawdownSchema),
  });

  const handleCapitalCallOpen = useCallback(() => {
    form.reset();
    setCapitalCallTask({ isOpen: true });
  }, [form]);

  const handleCapitalCallClose = useCallback(() => {
    form.reset();
    setCapitalCallTask({ isOpen: false });
  }, [form]);

  const handlePreviewSubmit = (data) => {
    const payload = serializeDates(data);
    previewMutation.mutate(payload, {
      onSuccess: (res) => {
        setPreviewData({ formData: payload, ...res });
        setCapitalCallTask({ isOpen: false });
      },
    });
  };

  const handleConfirmSend = () => {
    const payload = serializeDates(previewData.formData);
    generateMutation.mutate(payload, {
      onSuccess: () => setPreviewData(null),
    });
  };

  // URL-based auto open for view
  useEffect(() => {
    if (isLoading) return;
    if (drawdownData && id && action === "view") {
      setSheet({ isOpen: true, data: drawdownData });
      navigate(location.pathname, { replace: true });
    }
  }, [id, action, drawdownData, isLoading, navigate, location]);

  return (
    <section>
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 px-4 py-2">
        <Button variant="default" onClick={handleCapitalCallOpen}>
          Initiate Drawdown
        </Button>
      </div>

      {/* Table */}
      <main className="mx-4 flex-1">
        <DrawdownTable
          openView={(data) => setSheet({ isOpen: true, data })}
        />
      </main>

      {/* Form Dialog */}
      <DialogForm
        title="Drawdown Details"
        description="Send capital call to all onboarded Limited Partners"
        submitText="Preview"
        form={form}
        onSubmit={form.handleSubmit(handlePreviewSubmit)}
        formFields={drawnDownFeilds}
        isOpen={capitalCallTask.isOpen}
        onClose={handleCapitalCallClose}
      />

      {/* Preview Modal */}
      {previewData && (
        <PreviewDrawdownModal
          preview={previewData}
          onClose={() => setPreviewData(null)}
          onConfirm={handleConfirmSend}
          loading={generateMutation.isPending}
        />
      )}

      {/* View Sheet */}
      <SheetDrawdownView
        isOpen={sheet.isOpen}
        data={sheet.data}
        onClose={() => setSheet({ isOpen: false, data: null })}
      />
    </section>
  );
}
