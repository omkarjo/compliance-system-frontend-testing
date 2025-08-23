import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { renderCell } from "@/lib/renderCell";
import { cn } from "@/lib/utils";
import { Link } from "react-router";
import { Button } from "../ui/button";

const drawdownSchema = [
  { key: "drawdown_quarter", label: "Quarter", type: "text" },
  { key: "notice_date", label: "Notice Date", type: "date" },
  { key: "drawdown_due_date", label: "Due Date", type: "date" },
  { key: "drawdown_percentage", label: "Percentage", type: "text" },
  { key: "committed_amt", label: "Committed Amount", type: "currency" },
  { key: "drawdown_amount", label: "Drawdown Amount", type: "currency" },
  { key: "amount_called_up", label: "Amount Called Up", type: "currency" },
  {
    key: "remaining_commitment",
    label: "Remaining Commitment",
    type: "currency",
  },
  {
    key: "forecast_next_quarter",
    label: "Forecast Next Quarter",
    type: "currency",
  },
  { key: "status", label: "Status", type: "badge" },
  {
    key: "payment_received_date",
    label: "Payment Received Date",
    type: "date",
  },
  { key: "amt_accepted", label: "Amount Accepted", type: "currency" },
  { key: "allotted_units", label: "Allotted Units", type: "number" },
  { key: "nav_value", label: "NAV Value", type: "currency" },
  { key: "date_of_allotment", label: "Date of Allotment", type: "date" },
  { key: "mgmt_fees", label: "Management Fees", type: "currency" },
  { key: "stamp_duty", label: "Stamp Duty", type: "currency" },
  { key: "reference_number", label: "Reference Number", type: "text" },
  { key: "notes", label: "Notes", type: "textarea" },
];

export default function SheetDrawdownView({
  data = {},
  isOpen = true,
  onClose = () => {},
}) {
  if (data == null) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className={cn("w-full sm:max-w-md")}>
        <SheetHeader className="mt-4 pb-0 md:mt-8">
          <SheetTitle>Drawdown Details</SheetTitle>
          <SheetDescription>
            {data?.drawdown_quarter || "No Quarter Info"}
          </SheetDescription>
          {data?.status && (
            <Badge variant="outline" className="w-fit text-xs">
              {data.status}
            </Badge>
          )}
        </SheetHeader>
        <hr className="mx-auto w-11/12" />
        <ScrollArea className="overflow-y-auto pb-4">
          <table className="mx-auto w-11/12 text-sm">
            <tbody>
              {drawdownSchema
                .filter(
                  ({ key }) =>
                    data[key] !== null &&
                    data[key] !== undefined &&
                    data[key] !== "",
                )
                .map(({ key, label, type }) =>
                  renderCell(key, label, type, null, data),
                )}
            </tbody>
          </table>
          <div className="mt-3 px-4">
            <Button asChild>
              <Link to={`/dashboard/drawdowns/${data.drawdown_id}`}>View Details</Link>
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
