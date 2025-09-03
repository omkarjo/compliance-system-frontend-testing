import BadgeStatusTask from "@/components/includes/badge-status";
import { DataTable, SortButton } from "@/components/Table";

import { Button } from "@/components/ui/button";
import { currencyFormatter } from "@/lib/formatter";
import { useGetFunds } from "@/react-query/query/Funds/useGetFunds";
import { ArrowUpDown } from "lucide-react";

const statusKeyType = {
  Onboarded: "Completed",
  "Waiting For KYC": "Pending",
  "Under Review": "Review",
};

export default function TableFundView({ openView = () => {} }) {
  const columns = [
    {
      accessorKey: "scheme_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Scheme Name
          <ArrowUpDown size={16} />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="max-w-42 truncate ps-2 text-left md:max-w-52 lg:max-w-64">
          {row.getValue("scheme_name")}
        </div>
      ),
    },
    {
      accessorKey: "date_launch_of_scheme",
      header: "Date of Launch",
      cell: ({ row }) => {
        const date = row.getValue("date_launch_of_scheme");
        // only date not time
        return (
          <div className="max-w-42 truncate ps-2 text-left md:max-w-52 lg:max-w-64">
            {date ? new Date(date).toLocaleDateString("en-IN") : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "scheme_status",
      header: "Scheme Type",

      cell: ({ row }) => {
        const status = row.getValue("scheme_status");
        const type = statusKeyType[status] || "Pending";
        return <BadgeStatusTask text={status} type={type} />;
      },
    },

    {
      accessorKey: "target_fund_size",
      header: ({ column }) => (
        <SortButton column={column} className={"ms-auto justify-end"}>
          Fund Size
        </SortButton>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("target_fund_size"));
        const formatted = amount ? currencyFormatter(amount, "INR") : "-";
        return <div className="me-4 text-right md:me-6">{formatted}</div>;
      },
    },

    {
      accessorKey: "total_received",
      header: ({ column }) => (
        <SortButton column={column} className={"ms-auto justify-end"}>
          Total Received
        </SortButton>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("total_received"));
        const formatted = amount ? currencyFormatter(amount, "INR") : "-";
        return <div className="me-4 text-right md:me-6">{formatted}</div>;
      },
    },
  ];

  const filterOptions = [];

  return (
    <DataTable
      columns={columns}
      fetchData={useGetFunds}
      filterOptions={filterOptions}
      initialPageSize={10}
      searchBox={true}
      searchBoxPlaceholder="Search..."
      openView={openView}
    />
  );
}
