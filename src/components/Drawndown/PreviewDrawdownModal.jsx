import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import DataTable from "../includes/data-table";
import { Loader2 } from "lucide-react";
import { currencyFormatter } from "@/lib/formatter";

export default function PreviewDrawdownModal({ preview, onClose, onConfirm, loading }) {
  if (loading && !preview) {
    return (
      <Dialog open>
        <DialogContent className="flex items-center justify-center p-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Generating preview...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const { total_drawdown_amount, lp_previews, summary } = preview || {};

  const columns = [
    { accessorKey: "lp_name", header: "LP Name" },
    { accessorKey: "commitment_amount", header: "Commitment", cell: ({ row }) => currencyFormatter(row.original.commitment_amount) },
    { accessorKey: "drawdown_amount", header: "Drawdown", cell: ({ row }) => currencyFormatter(row.original.drawdown_amount) },
    { accessorKey: "amount_called_up", header: "Amount Called Up", cell: ({ row }) => currencyFormatter(row.original.amount_called_up) },
    { accessorKey: "remaining_commitment", header: "Remaining Commitment", cell: ({ row }) => currencyFormatter(row.original.remaining_commitment) },
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Drawdown Preview</DialogTitle>
        </DialogHeader>
        <div className="mb-4 space-y-1 text-sm">
          <p><strong>Total Drawdown Amount:</strong> {currencyFormatter(total_drawdown_amount)}</p>
          <p><strong>Total LPs:</strong> {summary?.total_lps}</p>
          <p><strong>Average Drawdown:</strong> {currencyFormatter(summary?.average_drawdown)}</p>
        </div>
        <ScrollArea className="max-h-[60vh]">
          <DataTable columns={columns} data={lp_previews || []} />
        </ScrollArea>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading ? "Sending..." : "Confirm & Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
