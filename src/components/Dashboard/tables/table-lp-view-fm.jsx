import BadgeStatusTask from "@/components/includes/badge-status";
import DataTable from "@/components/includes/data-table";
import SortButton from "@/components/includes/SortButton";
import { Button } from "@/components/ui/button";
import { currencyFormatter } from "@/lib/formatter";
import { useGetLP } from "@/query/lpQuery";
import { ArrowUpDown } from "lucide-react";

const statusKeyType = {
  Onboarded: "Completed",
  "Waiting For KYC": "Pending",
  "Under Review": "Review",
};

export default function TableLPViewFM({ openView = () => {} }) {
  const columns = [
    {
      accessorKey: "lp_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown size={16} />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="max-w-42 truncate ps-2 text-left md:max-w-52 lg:max-w-64">
          {row.getValue("lp_name")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
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
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        const type = statusKeyType[status] || "Pending";
        return <BadgeStatusTask text={status} type={type} />;
      },
    },

    {
      accessorKey: "commitment_amount",
      header: ({ column }) => (
        <SortButton column={column} className={"ms-auto justify-end"}>
          Commitment Amount
        </SortButton>
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
        <SortButton column={column} className={"ms-auto justify-end"}>
          Remaining Drawdown
        </SortButton>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("remaining_drawdown"));
        const formatted = amount ? currencyFormatter(amount, "INR") : "-";
        return <div className="me-4 text-right md:me-6">{formatted}</div>;
      },
    },
  ];

  const filterOptions = [];

  return (
    <DataTable
      columns={columns}
      fetchData={useGetLP}
      filterOptions={filterOptions}
      initialPageSize={10}
      searchBox={true}
      searchBoxPlaceholder="Search LPs..."
      openView={openView}
    />
  );
}
