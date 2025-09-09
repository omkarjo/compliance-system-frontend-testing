import StatusLozenge from "@/components/common/includes/StatusLozenge";
import { ServerDataTable, SortButton } from "@/components/Table";
import { currencyFormatter } from "@/lib/formatter";
import { useGetDrawdowns } from "@/react-query/query/drawdown/useGetDrawdowns";

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
        <SortButton column={column}>Quarter</SortButton>
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
        return <StatusLozenge status={status} />;
      },
    },
    {
      accessorKey: "invi_filling",
      header: "Invi Filling",
      cell: ({ row }) => {
        const status = row.getValue("invi_filling") || "NA";
        const type = statusKeyType[status] || "Pending";
        return <StatusLozenge status={status} />;
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

  const filterableColumns = [];

  return (
    <ServerDataTable
      columns={columns}
      fetchQuery={(params) => useGetDrawdowns({ ...params, groupByQuarter: true })}
      filterableColumns={filterableColumns}
      initialPageSize={10}
      onRowClick={(row) => openView(row.original)}
      searchPlaceholder="Search Drawdowns..."
      emptyMessage="No drawdowns found"
    />
  );
}