import StatusLozenge from "@/components/common/includes/StatusLozenge";
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


export function unitAllotmentTableColumns() {
  return [
    {
      accessorKey: "first_holder_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="First Holder Name" />
      ),
      cell: ({ row }) => (
        <div className="truncate">{row.getValue("first_holder_name")}</div>
      ),
    },
    {
      accessorKey: "depository",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Depository" />
      ),
      cell: ({ row }) => <div>{row.getValue("depository")}</div>,
    },
    {
      accessorKey: "allotted_units",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Allotted Units" />
      ),
      cell: ({ row }) => <div>{row.getValue("allotted_units")}</div>,
    },
    {
      accessorKey: "date_of_allotment",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date of Allotment" />
      ),
      cell: ({ row }) => {
        const date = row.getValue("date_of_allotment");
        return <div>{date ? new Date(date).toLocaleDateString() : "-"}</div>;
      },
    },
    {
      accessorKey: "committed_amt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Committed Amount" />
      ),
      cell: ({ row }) => {
        const amt = parseFloat(row.getValue("committed_amt"));
        return (
          <div className="">{currencyFormatter(amt, "INR")}</div>
        );
      },
    },
    {
      accessorKey: "drawdown_amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Drawdown Amount" />
      ),
      cell: ({ row }) => {
        const amt = parseFloat(row.getValue("drawdown_amount"));
        return (
          <div className="">{currencyFormatter(amt, "INR")}</div>
        );
      },
    },
    {
      accessorKey: "mgmt_fees",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mgmt Fees" />
      ),
      cell: ({ row }) => {
        const amt = parseFloat(row.getValue("mgmt_fees"));
        return (
          <div className="">{currencyFormatter(amt, "INR")}</div>
        );
      },
    },
    {
      accessorKey: "amt_accepted",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount Accepted" />
      ),
      cell: ({ row }) => {
        const amt = parseFloat(row.getValue("amt_accepted"));
        return (
          <div className="">{currencyFormatter(amt, "INR")}</div>
        );
      },
    },
    {
      accessorKey: "stamp_duty",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Stamp Duty" />
      ),
      cell: ({ row }) => {
        const amt = parseFloat(row.getValue("stamp_duty"));
        return (
          <div className="">{currencyFormatter(amt, "INR")}</div>
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
        return (
          <div className="flex justify-end">
            <StatusLozenge status={status} />
          </div>
        );
      },
    },
  ];
}