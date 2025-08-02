import BadgeStatusTask from "@/components/includes/badge-status";
import DataTable from "@/components/includes/data-table";
import SortButton from "@/components/includes/SortButton";
import { Button } from "@/components/ui/button";
import { currencyFormatter } from "@/lib/formatter";
import { useGetDrawdowns } from "@/react-query/query/drawdown/useGetDrawdowns";
import { ArrowUpDown } from "lucide-react";

const statusKeyType = {
  Onboarded: "Completed",
  "Waiting For KYC": "Pending",
  "Under Review": "Review",
};

export default function TableDrawdownView({ openView = () => {} }) {
  const columns = [
    {
      accessorKey: "quarter",
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
        <div className="max-w-42 truncate ps-2 text-left md:max-w-52 lg:max-w-64">
          {row.getValue("quarter")}
        </div>
      ),
    },
    {
      accessorKey: "notice_date",
      header: "Notice Date",
      cell: ({ row }) => {
        const date = row.getValue("notice_date");
        // only date not time
        return (
          <div className="max-w-42 truncate ps-2 text-left md:max-w-52 lg:max-w-64">
            {date ? new Date(date).toLocaleDateString("en-IN") : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "drawdown_status",
      header: "Drawdown Status",

      cell: ({ row }) => {
        const status = row.getValue("invi_filling_status");
        const type = statusKeyType[status] || "Pending";
        return <BadgeStatusTask text={status} type={type} />;
      },
    },

    {
      accessorKey: "invi_filling_status",
      header: "Invi Filling Status",

      cell: ({ row }) => {
        const status = row.getValue("invi_filling_status");
        const type = statusKeyType[status] || "Pending";
        return <BadgeStatusTask text={status} type={type} />;
      },
    },

    {
      accessorKey: "drawdown_amount",
      header: ({ column }) => (
        <SortButton column={column} className={"ms-auto justify-end"}>
          Drawdown Amount
        </SortButton>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("drawdown_amount"));
        const formatted = amount ? currencyFormatter(amount, "INR") : "-";
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
      fetchData={useGetDrawdowns}
      filterOptions={filterOptions}
      initialPageSize={10}
      searchBox={true}
      searchBoxPlaceholder="Search Drawdowns..."
      openView={openView}
    />
  );
}
