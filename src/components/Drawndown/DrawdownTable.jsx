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

export default function DrawdownTable({ openView = () => {} }) {
  const columns = [
    {
      accessorKey: "drawdown_quarter",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
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
        const formatted = amount
          ? currencyFormatter(amount, "INR")
          : "-";
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
        const formatted = amount
          ? currencyFormatter(amount, "INR")
          : "-";
        return <div className="text-right">{formatted}</div>;
      },
    },
  ];

  const filterOptions = [
  ];

  return (
    <DataTable
      columns={columns}
      fetchData={useGetDrawdowns}
      filterOptions={filterOptions}
      initialPageSize={10}
      searchBox
      searchBoxPlaceholder="Search Drawdowns..."
      openView={openView}
    />
  );
}