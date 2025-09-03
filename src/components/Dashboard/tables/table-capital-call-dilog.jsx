import { DataTable } from "@/components/Table";
import { currencyFormatter } from "@/lib/formatter";

export default function CapitalCallDialogTable() {
  const columns = [
    {
      accessorKey: "name",
      header: () => <span className="ms-2 flex items-center">{"Name"}</span>,
      cell: ({ row }) => (
        <div className="ms-2 text-left uppercase">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Drawdown Amount",
      cell: ({ row }) => {
        const amount = row.getValue("amount");
        const formattedAmount = currencyFormatter(amount, "INR");
        return <span className="">{formattedAmount}</span>;
      },
    },
    {
      accessorKey: "drawdown_so_far",
      header: "Drawdown So Far",
      cell: ({ row }) => {
        const amount = row.getValue("drawdown_so_far");
        const formattedAmount = currencyFormatter(amount, "INR");
        return <span className="">{formattedAmount}</span>;
      },
    },
  ];

  const dummyData = [
    {
      name: "John Doe",
      amount: 1000000,
      drawdown_so_far: 500000,
    },
    {
      name: "Jane Smith",
      amount: 2000000,
      drawdown_so_far: 800000,
    },
  ];

  return <DataTable columns={columns} data={dummyData}  showPageSizeSelector={false}/>;
}
