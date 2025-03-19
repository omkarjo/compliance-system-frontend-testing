import DataTable from "@/components/includes/data-table";
import { Button } from "@/components/ui/button";
import { currencyFormatter } from "@/lib/formatter";
import { useGetLP } from "@/query/lpQuerry";
import {
  AlertTriangle,
  ArrowUpDown,
  Bell,
  CheckCircle,
  Clock,
  FileBarChart,
  FileQuestion,
  FileSignature,
  FileText,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function TableLPViewFM({ openView = () => {} }) {
  const taskColumn = [
    {
      accessorKey: "lp_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown size={16} />
          </Button>
        );
      },
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
      header: ({ column }) => {
        return (
          <div className="ms-auto flex justify-end">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className=""
            >
              <span className="me-2 max-md:hidden">Commitment </span>
              <span className="ms-0">Amount</span>
              <ArrowUpDown size={16} />
            </Button>
          </div>
        );
      },
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

  const [sorting, setSorting] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [filters, setFilters] = useState([]);
  const [searchOptions, setSearchOptions] = useState({
    filterId: "",
    search: "",
  });

  const { data, isLoading, error } = useGetLP({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    sortBy: sorting,
  });

  return (
    <DataTable
      columns={taskColumn}
      data={data?.data ?? []}
      totalCount={data?.totalCount ?? 0}
      loading={isLoading}
      sorting={sorting}
      setSorting={setSorting}
      pagination={pagination}
      setPagination={setPagination}
      error={error?.message}
      // setRowSelection={setRowSelection}
      openView={openView}
      filter={{
        filters,
        filterOptions,
        searchOptions,
        setFilters,
        setSearchOptions,
      }}
    />
  );
}
