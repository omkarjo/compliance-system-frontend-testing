import { Button } from "@/components/ui/button";
import DataTable from "@/components/includes/data-table";
import { currencyFormatter } from "@/lib/formatter";
import { useGetLP } from "@/query/lpQuery";
import { ArrowUpDown } from "lucide-react";

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
        <div className="max-w-42 truncate text-left md:max-w-52 lg:max-w-64">
          {row.getValue("lp_name")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "commitment_amount",
      header: ({ column }) => (
        <div className="ms-auto flex justify-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span className="me-2 max-md:hidden">Commitment </span>
            <span className="ms-0">Amount</span>
            <ArrowUpDown size={16} />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("commitment_amount"));
        const formatted = currencyFormatter(amount, "INR");

        return (
          <div className="me-4 text-right font-medium md:me-6">{formatted}</div>
        );
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