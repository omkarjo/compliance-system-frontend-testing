import BadgeStatusTask from "@/components/includes/badge-status";
import { Button } from "@/components/ui/button";
import { SortButton } from "@/components/Table";
import { ArrowUpDown } from "lucide-react";
import { currencyFormatter } from "@/lib/formatter";

/**
 * Returns column definitions for the Drawdown Table.
 * @returns {Array}
 */
export function drawdownColumns() {
  const statusKeyType = {
    Onboarded: "Completed",
    "Waiting For KYC": "Pending",
    "Under Review": "Review",
  };

  return [
    {
      accessorKey: "drawdown_quarter",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quarter
          <ArrowUpDown size={16} />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ps-2">{row.getValue("drawdown_quarter")}</div>
      ),
    },
    {
      accessorKey: "notice_date",
      header: "Notice Date",
      cell: ({ row }) => {
        const date = row.getValue("notice_date");
        return (
          <div className="ps-2">
            {date ? new Date(date).toLocaleDateString("en-IN") : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Drawdown Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        const type = statusKeyType[status] || "Pending";
        return <BadgeStatusTask text={status} type={type} />;
      },
    },
    {
      accessorKey: "invi_filling",
      header: "Invi Filling",
      cell: ({ row }) => {
        const status = row.getValue("invi_filling") || "NA";
        const type = statusKeyType[status] || "Pending";
        return <BadgeStatusTask text={status} type={type} />;
      },
    },
    {
      accessorKey: "drawdown_amount",
      header: ({ column }) => (
        <SortButton column={column} className="ms-auto justify-end">
          Drawdown
        </SortButton>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("drawdown_amount"));
        const formatted = amount ? currencyFormatter(amount, "INR") : "-";
        return <div className="text-right">{formatted}</div>;
      },
    },
    {
      accessorKey: "remaining_commitment",
      header: ({ column }) => (
        <SortButton column={column} className="ms-auto justify-end">
          Remaining Drawdown
        </SortButton>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("remaining_commitment"));
        const formatted = amount ? currencyFormatter(amount, "INR") : "-";
        return <div className="text-right">{formatted}</div>;
      },
    },
  ];
}