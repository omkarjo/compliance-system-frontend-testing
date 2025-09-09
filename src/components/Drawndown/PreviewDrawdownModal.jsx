import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currencyFormatter } from "@/lib/formatter";
import { Loader2 } from "lucide-react";
import { DataTable } from "../Table";

export default function PreviewDrawdownModal({
  preview,
  onClose,
  onConfirm,
  loading,
}) {
  if (loading && !preview) {
    return (
      <Dialog open>
        <DialogContent className="flex min-h-[300px] items-center justify-center p-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
            <span className="text-muted-foreground text-sm">
              Generating preview...
            </span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const { total_drawdown_amount, lp_previews, summary, sample_html_preview } =
    preview || {};

  const columns = [
    { accessorKey: "lp_name", header: "LP Name" },
    {
      accessorKey: "commitment_amount",
      header: "Commitment",
      cell: ({ row }) => currencyFormatter(row.original.commitment_amount),
    },
    {
      accessorKey: "drawdown_amount",
      header: "Drawdown",
      cell: ({ row }) => currencyFormatter(row.original.drawdown_amount),
    },
    {
      accessorKey: "amount_called_up",
      header: "Amount Called Up",
      cell: ({ row }) => currencyFormatter(row.original.amount_called_up),
    },
    {
      accessorKey: "remaining_commitment",
      header: "Remaining Commitment",
      cell: ({ row }) => currencyFormatter(row.original.remaining_commitment),
    },
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-full max-w-4xl p-0">
        <ScrollArea className="max-h-[80vh] w-full px-6 pt-6 pb-0">
          <DialogHeader>
            <DialogTitle>Drawdown Preview</DialogTitle>
          </DialogHeader>
          <div className="mb-4 space-y-1 text-sm">
            <p>
              <strong>Total Drawdown Amount:</strong>{" "}
              {currencyFormatter(total_drawdown_amount)}
            </p>
            <p>
              <strong>Total LPs:</strong> {summary?.total_lps}
            </p>
            <p>
              <strong>Average Drawdown:</strong>{" "}
              {currencyFormatter(summary?.average_drawdown)}
            </p>
          </div>
          <Tabs defaultValue="table" className="mt-2">
            <TabsList>
              <TabsTrigger value="table">Capital Call</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              <DataTable columns={columns} data={lp_previews || []} />
            </TabsContent>
            <TabsContent value="preview">
              {sample_html_preview ? (
                <div className="bg-muted mt-2 rounded border p-4">
                  <div
                    dangerouslySetInnerHTML={{ __html: sample_html_preview }}
                  />
                </div>
              ) : (
                <div className="text-muted-foreground p-4 text-sm">
                  No preview available.
                </div>
              )}
            </TabsContent>
          </Tabs>
          <DialogFooter className="mt-6 pt-4 pb-6">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onConfirm} disabled={loading}>
              {loading ? "Sending..." : "Confirm & Send"}
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
