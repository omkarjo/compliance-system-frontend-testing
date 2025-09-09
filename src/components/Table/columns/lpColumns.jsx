import { DataTableColumnHeader } from "@/components/Table/DataTableColumnHeader";
import BadgeStatusTask from "@/components/includes/badge-status";
import { currencyFormatter } from "@/lib/formatter";

/**
 * Returns column definitions for the LP Table, using DataTableColumnHeader.
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
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="max-w-42 truncate ps-2 text-left md:max-w-52 lg:max-w-64">
          {row.getValue("lp_name")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => {
        const email = row.getValue("email");
        return (
          <div className="max-w-42 truncate ps-2 text-left md:max-w-52 lg:max-w-64">
            {email}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status");
        const type = statusKeyType[status] || "Pending";
        return <BadgeStatusTask text={status} type={type} />;
      },
    },
    {
      accessorKey: "commitment_amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Commitment Amount" />
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("commitment_amount"));
        const formatted = currencyFormatter(amount, "INR");
        return <div className="me-4 text-right md:me-6">{formatted}</div>;
      },
    },
    {
      accessorKey: "remaining_drawdown",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Remaining Drawdown" />
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("remaining_drawdown"));
        const formatted = amount ? currencyFormatter(amount, "INR") : "-";
        return <div className="me-4 text-right md:me-6">{formatted}</div>;
      },
    },
  ];
}