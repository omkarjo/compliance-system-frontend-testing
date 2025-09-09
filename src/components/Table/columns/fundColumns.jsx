import StatusLozenge from "@/components/common/includes/StatusLozenge";
import SortButton from "@/components/Table/SortButton";
import { currencyFormatter } from "@/lib/formatter";

/**
 * Returns column definitions for the Fund Table.
 * @returns {Array}
 */
export function fundColumns() {
  const statusKeyType = {
    Onboarded: "Completed",
    "Waiting For KYC": "Pending",
    "Under Review": "Review",
  };

  return [
    {
      accessorKey: "scheme_name",
      header: ({ column }) => (
        <SortButton column={column}>Scheme Name</SortButton>
      ),
      cell: ({ row }) => (
        <div className="max-w-42 truncate ps-2 text-left text-foreground md:max-w-52 lg:max-w-64">
          {row.getValue("scheme_name")}
        </div>
      ),
    },
    {
      accessorKey: "date_launch_of_scheme",
      header: ({ column }) => (
        <SortButton column={column}>Date of Launch</SortButton>
      ),
      cell: ({ row }) => {
        const date = row.getValue("date_launch_of_scheme");
        // only date not time
        return (
          <div className="max-w-42 truncate ps-2 text-left text-foreground md:max-w-52 lg:max-w-64">
            {date ? new Date(date).toLocaleDateString("en-IN") : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "scheme_status",
      header: ({ column }) => (
        <SortButton column={column}>Scheme Type</SortButton>
      ),
      cell: ({ row }) => {
        const status = row.getValue("scheme_status");
        const type = statusKeyType[status] || "Pending";
        return <StatusLozenge status={status} />;
      },
    },
    {
      accessorKey: "target_fund_size",
      header: ({ column }) => (
        <SortButton column={column} className="ms-auto justify-end">
          Fund Size
        </SortButton>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("target_fund_size"));
        const formatted = amount ? currencyFormatter(amount, "INR") : "-";
        return <div className="me-4 text-right text-foreground md:me-6">{formatted}</div>;
      },
    },
    {
      accessorKey: "total_received",
      header: ({ column }) => (
        <SortButton column={column} className="ms-auto justify-end">
          Total Received
        </SortButton>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("total_received"));
        const formatted = amount ? currencyFormatter(amount, "INR") : "-";
        return <div className="me-4 text-right text-foreground md:me-6">{formatted}</div>;
      },
    },
  ];
}