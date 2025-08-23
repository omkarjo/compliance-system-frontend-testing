import BadgeStatusTask from "@/components/includes/badge-status";
import DataTable from "@/components/includes/data-table";
import SortButton from "@/components/includes/SortButton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currencyFormatter } from "@/lib/formatter";
import { useGenerateUnitAllotments } from "@/react-query/mutations/UnitAllotment/useGenerateUnitAllotments";
import { useGetDrawdownsById } from "@/react-query/query/drawdown/useGetDrawdownsById";
import { useGetLP } from "@/react-query/query/lp/lpQuery";
import { useGetUnitAllotments } from "@/react-query/query/UnitAllotments/useGetUnitAllotments";
import { ArrowUpDown } from "lucide-react";
import { useParams } from "react-router-dom";

const statusKeyType = {
  Onboarded: "Completed",
  "Waiting For KYC": "Pending",
  "Under Review": "Review",
};

function mapDrawdownToCards(data) {
  return [
    {
      label: "Notice Date",
      value: data.notice_date
        ? new Date(data.notice_date).toLocaleDateString()
        : "-",
    },
    {
      label: "Due Date",
      value: data.drawdown_due_date
        ? new Date(data.drawdown_due_date).toLocaleDateString()
        : "-",
    },
    { label: "Percentage Drawdown", value: data.drawdown_percentage ?? "-" },
    { label: "Expected Drawdown", value: data.drawdown_amount ?? "-" },
    { label: "Forecasted Drawdown", value: data.forecast_next_quarter ?? "-" },
    {
      label: "Next Drawdown Date",
      value: data.forecast_next_quarter_period ?? "-",
    },
    { label: "Total Drawdown Till Date", value: data.amount_called_up ?? "-" },
    { label: "Total Drawdown (%)", value: data.drawdown_quarter ?? "-" },
  ];
}

function InfoCards({ data }) {
  return (
    <div className="flex flex-wrap gap-4">
      {data.map((item, idx) => (
        <div
          key={idx}
          className="flex w-48 flex-col rounded-xl border bg-white p-4 shadow-sm"
        >
          <span className="text-xs text-gray-500">{item.label}</span>
          <span className="text-sm font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function InfoCardsSkeleton() {
  return (
    <div className="flex flex-wrap gap-4">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div
          key={idx}
          className="flex w-48 flex-col rounded-xl border bg-white p-4 shadow-sm"
        >
          <Skeleton className="mb-2 h-4 w-20" />
          <Skeleton className="h-6 w-28" />
        </div>
      ))}
    </div>
  );
}

export default function DrawdownDetailPage() {
  const { id } = useParams();
  const { data: drawdownData, isLoading: isLoadingDrawdown } =
    useGetDrawdownsById(id);
  const { data: lpData, isLoading: isLoadingLP } = useGetLP({
    pageIndex: 0,
    pageSize: 1000,
    search: "",
  });

  const { mutate: generateUnitAllotments, isLoading: isGenerating } =
    useGenerateUnitAllotments();
  const cardData = drawdownData ? mapDrawdownToCards(drawdownData) : [];

  const lpInvolved = lpData?.data
    ? lpData.data.filter(
        (item) =>
          new Date(item.created_at) <=
          new Date(drawdownData?.drawdown_due_date),
      )
    : [];

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

  const columnsUnitAllotments = [
    {
      accessorKey: "first_holder_name",
      header: "First Holder Name",
      cell: ({ row }) => (
        <div className="truncate">{row.getValue("first_holder_name")}</div>
      ),
    },
    {
      accessorKey: "depository",
      header: "Depository",
      cell: ({ row }) => <div>{row.getValue("depository")}</div>,
    },
    {
      accessorKey: "allotted_units",
      header: "Allotted Units",
      cell: ({ row }) => <div>{row.getValue("allotted_units")}</div>,
    },
    {
      accessorKey: "date_of_allotment",
      header: "Date of Allotment",
      cell: ({ row }) => {
        const date = row.getValue("date_of_allotment");
        return <div>{date ? new Date(date).toLocaleDateString() : "-"}</div>;
      },
    },
    {
      accessorKey: "committed_amt",
      header: "Committed Amount",
      cell: ({ row }) => {
        const amt = parseFloat(row.getValue("committed_amt"));
        return (
          <div className="text-right">{currencyFormatter(amt, "INR")}</div>
        );
      },
    },
    {
      accessorKey: "drawdown_amount",
      header: "Drawdown Amount",
      cell: ({ row }) => {
        const amt = parseFloat(row.getValue("drawdown_amount"));
        return (
          <div className="text-right">{currencyFormatter(amt, "INR")}</div>
        );
      },
    },
    {
      accessorKey: "mgmt_fees",
      header: "Mgmt Fees",
      cell: ({ row }) => {
        const amt = parseFloat(row.getValue("mgmt_fees"));
        return (
          <div className="text-right">{currencyFormatter(amt, "INR")}</div>
        );
      },
    },
    {
      accessorKey: "amt_accepted",
      header: "Amount Accepted",
      cell: ({ row }) => {
        const amt = parseFloat(row.getValue("amt_accepted"));
        return (
          <div className="text-right">{currencyFormatter(amt, "INR")}</div>
        );
      },
    },
    {
      accessorKey: "stamp_duty",
      header: "Stamp Duty",
      cell: ({ row }) => {
        const amt = parseFloat(row.getValue("stamp_duty"));
        return (
          <div className="text-right">{currencyFormatter(amt, "INR")}</div>
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
  ];

  const handleGenerateUnitAllotments = () => {
    if (drawdownData && drawdownData.fund_id) {
      generateUnitAllotments(drawdownData.fund_id);
    }
  };

  return (
    <section className="p-6">
      <div className="mb-4 flex items-center">
        <Button
          variant=""
          onClick={handleGenerateUnitAllotments}
          isLoading={isGenerating}
        >
          Generate Unit Allotments
        </Button>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Drawdown Information</h3>
      </div>
      <div className="flex flex-wrap items-center">
        {isLoadingDrawdown ? (
          <InfoCardsSkeleton />
        ) : (
          <InfoCards data={cardData} />
        )}
      </div>
      <Tabs defaultValue="drawdown">
        <div className="flex justify-end">
          <TabsList className={""}>
            <TabsTrigger value="drawdown">Drawdown</TabsTrigger>
            <TabsTrigger value="unit-allotments">Unit Allotments</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="drawdown">
          <DataTable
            columns={columns}
            data={lpInvolved}
            isLoading={isLoadingLP}
          />
        </TabsContent>
        <TabsContent value="unit-allotments">
          <DataTable
            columns={columnsUnitAllotments}
            fetchData={(args) => {
              return useGetUnitAllotments({
                fundId: drawdownData.fund_id,
                ...args,
              });
            }}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}
