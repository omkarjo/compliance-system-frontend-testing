import BadgeStatusTask from "@/components/includes/badge-status";
import { DataTableColumnHeader } from "@/components/Table/DataTableColumnHeader";
import { currencyFormatter } from "@/lib/formatter";
import React from "react";

const statusKeyType = {
  "Drawdown Payment Pending": "Pending",
  "Drawdown Pending": "Pending",
  Active: "Completed",
  "Over-payment": "Error",
  Shortfall: "Error",
};


export function drawdownTableColumns() {
  return [
    {
      accessorKey: "lp_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Limited Partners" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 ps-2">
          {row.getValue("lp_name")}
        </div>
      ),
    },
    {
      accessorKey: "drawdown_amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Drawdown Amount" />
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("drawdown_amount"));
        const formatted = amount ? currencyFormatter(amount, "INR") : "-";
        return <div className="">{formatted}</div>;
      },
    },
    {
      accessorKey: "remaining_commitment",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Remaining Drawdown" />
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("remaining_commitment"));
        const formatted = amount ? currencyFormatter(amount, "INR") : "-";
        return <div className="">{formatted}</div>;
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Drawdown Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status");
        const type = statusKeyType[status] || "Pending";
        return (
          <div className="flex justify-end">
            <BadgeStatusTask text={status} type={type} />
          </div>
        );
      },
    },
  ];
}