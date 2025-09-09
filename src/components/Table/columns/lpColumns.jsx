import SortButton from "@/components/Table/SortButton";
import StatusLozenge from "@/components/common/includes/StatusLozenge";
import { currencyFormatter } from "@/lib/formatter";

/**
 * Returns column definitions for the LP Table, using SortButton.
 * @returns {Array}
 */
export function lpColumns() {
  const statusKeyType = {
    Onboarded: "Completed",
    "Waiting For KYC": "Pending",
    "Under Review": "Review",
  };

  return [
    {
      accessorKey: "lp_name",
      header: ({ column }) => (
        <SortButton column={column}>Name</SortButton>
      ),
      cell: ({ row }) => (
        <div className="max-w-42 truncate ps-2 text-left text-foreground md:max-w-52 lg:max-w-64">
          {row.getValue("lp_name")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <SortButton column={column}>Email</SortButton>
      ),
      cell: ({ row }) => {
        const email = row.getValue("email");
        return (
          <div className="max-w-42 truncate ps-2 text-left text-foreground md:max-w-52 lg:max-w-64">
            {email}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <SortButton column={column}>Status</SortButton>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status");
        const type = statusKeyType[status] || "Pending";
        return <StatusLozenge status={status} />;
      },
    },
    {
      accessorKey: "commitment_amount",
      header: ({ column }) => (
        <SortButton column={column} className="ms-auto justify-end">Commitment Amount</SortButton>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("commitment_amount"));
        const formatted = currencyFormatter(amount, "INR");
        return <div className="me-4 text-right text-foreground md:me-6">{formatted}</div>;
      },
    },
    {
      accessorKey: "remaining_drawdown",
      header: ({ column }) => (
        <SortButton column={column} className="ms-auto justify-end">Remaining Drawdown</SortButton>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("remaining_drawdown"));
        const formatted = amount ? currencyFormatter(amount, "INR") : "-";
        return <div className="me-4 text-right text-foreground md:me-6">{formatted}</div>;
      },
    },
  ];
}