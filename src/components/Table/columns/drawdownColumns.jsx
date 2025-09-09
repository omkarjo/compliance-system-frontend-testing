import StatusLozenge from "@/components/common/includes/StatusLozenge";
import SortButton from "@/components/Table/SortButton";
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
        <SortButton column={column}>Quarter</SortButton>
      ),
      cell: ({ row }) => (
        <div className="ps-2 text-foreground">{row.getValue("drawdown_quarter")}</div>
      ),
    },
    {
      accessorKey: "notice_date",
      header: ({ column }) => (
        <SortButton column={column}>Notice Date</SortButton>
      ),
      cell: ({ row }) => {
        const date = row.getValue("notice_date");
        return (
          <div className="ps-2 text-foreground">
            {date ? new Date(date).toLocaleDateString("en-IN") : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <SortButton column={column}>Drawdown Status</SortButton>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status");
        const type = statusKeyType[status] || "Pending";
        return <StatusLozenge status={status} />;
      },
    },
    {
      accessorKey: "invi_filling",
      header: ({ column }) => (
        <SortButton column={column}>Invi Filling</SortButton>
      ),
      cell: ({ row }) => {
        const status = row.getValue("invi_filling") || "NA";
        const type = statusKeyType[status] || "Pending";
        return <StatusLozenge status={status} />;
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
        return <div className="text-right text-foreground">{formatted}</div>;
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
        return <div className="text-right text-foreground">{formatted}</div>;
      },
    },
  ];
}