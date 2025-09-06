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



export function paymentTableColumns() {
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
      accessorKey: "amount_due",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount Due" />
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount_due"));
        const formatted = amount ? currencyFormatter(amount, "INR") : "-";
        return <div className="">{formatted}</div>;
      },
    },
    {
      accessorKey: "paid_amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Paid Amount" />
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("paid_amount"));
        const formatted = amount ? currencyFormatter(amount, "INR") : "-";
        return <div className="">{formatted}</div>;
      },
    },
    {
      accessorKey: "payment_date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Payment Date" />
      ),
      cell: ({ row }) => (
        <div className="">{row.getValue("payment_date")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Payment Status" />
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