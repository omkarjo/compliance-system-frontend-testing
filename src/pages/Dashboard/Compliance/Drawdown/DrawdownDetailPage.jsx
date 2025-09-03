import { InfoCards, InfoCardsSkeleton } from "@/components/Cards/InfoCard";
import DialogForm from "@/components/Dashboard/includes/dialog-form";
import BadgeStatusTask from "@/components/includes/badge-status";
import { DataTable, SortButton } from "@/components/Table";
import SheetView from "@/components/Sheet/SheetView";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currencyFormatter, formatPayloadForFastAPI } from "@/lib/formatter";
import { useManualRecordPayment } from "@/react-query/mutations/Payments/useManualRecordPayment";
import { useGenerateUnitAllotments } from "@/react-query/mutations/UnitAllotment/useGenerateUnitAllotments";
import { useGetDrawdowns } from "@/react-query/query/drawdown/useGetDrawdowns";
import { useGetLP } from "@/react-query/query/lp/lpQuery";
import { useGetPayments } from "@/react-query/query/payment/useGetPayments";
import { useGetUnitAllotments } from "@/react-query/query/UnitAllotments/useGetUnitAllotments";
import { manualPaymentSchema } from "@/schemas/form/PaymentSchema";
import { manualPaymentZodSchema } from "@/schemas/zod/PaymentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const statusKeyType = {
  "Drawdown Payment Pending": "Pending",
  "Drawdown Pending": "Pending",
  Active: "Completed",
  "Over-payment": "Error",
  Shortfall: "Error",
};

const drawdownSchema = [
  { key: "drawdown_quarter", label: "Quarter", type: "text" },
  { key: "notice_date", label: "Notice Date", type: "date" },
  { key: "drawdown_due_date", label: "Due Date", type: "date" },
  { key: "drawdown_percentage", label: "Percentage", type: "text" },
  { key: "committed_amt", label: "Committed Amount", type: "currency" },
  { key: "drawdown_amount", label: "Drawdown Amount", type: "currency" },
  { key: "amount_called_up", label: "Amount Called Up", type: "currency" },
  {
    key: "remaining_commitment",
    label: "Remaining Commitment",
    type: "currency",
  },
  {
    key: "forecast_next_quarter",
    label: "Forecast Next Quarter",
    type: "currency",
  },
  { key: "status", label: "Status", type: "badge" },
  {
    key: "payment_received_date",
    label: "Payment Received Date",
    type: "date",
  },
  { key: "amt_accepted", label: "Amount Accepted", type: "currency" },
  { key: "allotted_units", label: "Allotted Units", type: "number" },
  { key: "nav_value", label: "NAV Value", type: "currency" },
  { key: "date_of_allotment", label: "Date of Allotment", type: "date" },
  { key: "mgmt_fees", label: "Management Fees", type: "currency" },
  { key: "stamp_duty", label: "Stamp Duty", type: "currency" },
  { key: "reference_number", label: "Reference Number", type: "text" },
  { key: "drawdown_count", label: "No Of LPs", type: "number" },
  { key: "notes", label: "Notes", type: "textarea" },
];

const paymentSchema = [
  { key: "lp_name", label: "Limited Partner", type: "text" },
  { key: "amount_due", label: "Amount Due", type: "currency" },
  { key: "paid_amount", label: "Paid Amount", type: "currency" },
  { key: "payment_date", label: "Payment Date", type: "date" },
  { key: "status", label: "Status", type: "badge" },
];

export default function DrawdownDetailPage() {
  const { quarter } = useParams();

  const { mutate: manualRecordPayment, isLoading } = useManualRecordPayment();

  const { data: drawdownsResp, isLoading: isLoadingDrawdown } = useGetDrawdowns(
    {
      pageIndex: 0,
      pageSize: 100,
      sortBy: [],
      filters: [],
      groupByQuarter: false,
    },
  );

  const { data: lpData, isLoading: isLoadingLP } = useGetLP({
    pageIndex: 0,
    pageSize: 1000,
    search: "",
  });

  const { data: paymentsResp, isLoading: isLoadingPayments } = useGetPayments({
    pageIndex: 0,
    pageSize: 10,
    sortBy: [],
    filters: [{ filterid: "quarter", optionid: quarter }],
  });

  const drawdownRows =
    drawdownsResp?.data?.filter((d) => d.drawdown_quarter === quarter) || [];

  const cardData = mapDrawdownToCards(drawdownRows);

  const [sheetProps, setSheetProps] = React.useState(null);
  const [manualPaymentProps, setManualPaymentProps] = React.useState(null);

  const form = useForm({
    resolver: zodResolver(manualPaymentZodSchema),
  });

  const handleManualPaymentFormOpen = (data) => {
    setSheetProps(null);
    setManualPaymentProps({
      title: "Manual Payment",
      description: "Enter the payment details below:",
      data: data,
    });
  };

  const handleManualPaymentSubmit = (data) => {
    manualRecordPayment(
      formatPayloadForFastAPI({
        ...data,
        lp_id: manualPaymentProps.data.lp_id,
        fund_id: manualPaymentProps.data.fund_id,
        drawdown_quarter: manualPaymentProps.data.drawdown_quarter,
      }),
      {
        onSuccess: () => {
          setManualPaymentProps(null);
          form.reset();
        },
      },
    );
  };

  const handleViewDrawdownDetails = (data) => {
    setSheetProps({
      schema: drawdownSchema,
      title: "Drawdown Details",
      data: data,
      buttons: [
        <Button
          key="update-status"
          onClick={() => handleManualPaymentFormOpen(data)}
        >
          Update Payment
        </Button>,
      ],
    });
  };

  const handleViewPaymentDetails = (data) => {
    setSheetProps({
      schema: paymentSchema,
      title: "Payment Details",
      data: data,
      buttons: [
        <Button
          key="update-status"
          onClick={() => {
            toast.success("Update Payment Status clicked", {
              description:
                "Implement update payment status functionality here.",
            });
          }}
        >
          Update Payment Status
        </Button>,
      ],
    });
  };

  const drawdownTableRows = drawdownRows.map((drawdown) => {
    const lp = lpData?.data?.find((l) => l.lp_id === drawdown.lp_id);
    return {
      ...drawdown,
      lp_name: lp ? lp.lp_name : "-",
    };
  });

  const drawdownTableColumns = [
    {
      accessorKey: "lp_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Limited Partners
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 ps-2">
          {row.getValue("lp_name")}
        </div>
      ),
    },
    {
      accessorKey: "drawdown_amount",
      header: ({ column }) => (
        <SortButton column={column} className="ms-auto justify-end">
          Drawdown Amount
        </SortButton>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("drawdown_amount"));
        const formatted = amount ? currencyFormatter(amount, "INR") : "-";
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
        const formatted = amount ? currencyFormatter(amount, "INR") : "-";
        return <div className="text-right">{formatted}</div>;
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <SortButton column={column} className="ms-auto justify-end">
          Drawdown Status
        </SortButton>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status");
        const type = statusKeyType[status] || "Pending";
        return (
          <div className="flex justify-end">
            <BadgeStatusTask text={status} type={type} />
          </div>
        );
      },
    },
  ];

  const paymentTableRows =
    paymentsResp?.data?.map((payment) => {
      const lp = lpData?.data?.find((l) => l.lp_id === payment.lp_id);
      return {
        ...payment,
        lp_name: lp ? lp.lp_name : payment.lp_name || "-",
      };
    }) || [];

  const paymentTableColumns = [
    {
      accessorKey: "lp_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Limited Partners
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 ps-2">
          {row.getValue("lp_name")}
        </div>
      ),
    },
    {
      accessorKey: "amount_due",
      header: ({ column }) => (
        <SortButton column={column} className="ms-auto justify-end">
          Amount Due
        </SortButton>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount_due"));
        const formatted = amount ? currencyFormatter(amount, "INR") : "-";
        return <div className="text-right">{formatted}</div>;
      },
    },
    {
      accessorKey: "paid_amount",
      header: ({ column }) => (
        <SortButton column={column} className="ms-auto justify-end">
          Paid Amount
        </SortButton>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("paid_amount"));
        const formatted = amount ? currencyFormatter(amount, "INR") : "-";
        return <div className="text-right">{formatted}</div>;
      },
    },
    {
      accessorKey: "payment_date",
      header: ({ column }) => (
        <SortButton column={column} className="ms-auto justify-end">
          Payment Date
        </SortButton>
      ),
      cell: ({ row }) => (
        <div className="text-right">{row.getValue("payment_date")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <SortButton column={column} className="ms-auto justify-end">
          Payment Status
        </SortButton>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status");
        const type = statusKeyType[status] || "Pending";
        return (
          <div className="flex justify-end">
            <BadgeStatusTask text={status} type={type} />
          </div>
        );
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
        return (
          <div className="flex justify-end">
            <BadgeStatusTask text={status} type={type} />
          </div>
        );
      },
    },
  ];

  const { mutate: generateUnitAllotments, isLoading: isGenerating } =
    useGenerateUnitAllotments();

  const handleGenerateUnitAllotments = () => {
    if (drawdownRows.length > 0 && drawdownRows[0].fund_id) {
      generateUnitAllotments(drawdownRows[0].fund_id);
    }
  };

  function mapDrawdownToCards(rows) {
    if (!rows || rows.length === 0) return [];
    const first = rows[0];
    let expectedDrawdown = 0;
    let totalDrawdownTillDate = 0;
    let totalDrawdownPercent = 0;

    rows.forEach((row) => {
      expectedDrawdown += parseFloat(row.drawdown_amount || 0);
      totalDrawdownTillDate += parseFloat(row.amount_called_up || 0);
      totalDrawdownPercent += parseFloat(row.drawdown_percentage || 0);
    });

    return [
      {
        label: "Notice Date",
        value: first.notice_date
          ? new Date(first.notice_date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "-",
      },
      {
        label: "Due Date",
        value: first.drawdown_due_date
          ? new Date(first.drawdown_due_date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "-",
      },
      {
        label: "Percentage Drawdown",
        value: first.drawdown_percentage
          ? `${first.drawdown_percentage}%`
          : "-",
      },
      {
        label: "Expected Drawdown",
        value: expectedDrawdown
          ? currencyFormatter(expectedDrawdown, "INR")
          : "-",
      },
      {
        label: "Forecasted Drawdown",
        value: first.forecast_next_quarter
          ? `${first.forecast_next_quarter}%`
          : "-",
      },
      {
        label: "Next Drawdown Date",
        value: first.forecast_next_quarter_period
          ? first.forecast_next_quarter_period
          : "-",
      },
      {
        label: "Total Drawdown Till Date",
        value: totalDrawdownTillDate
          ? currencyFormatter(totalDrawdownTillDate, "INR")
          : "-",
      },
      {
        label: "Total Drawdown (%)",
        value: `${totalDrawdownPercent}%`,
      },
    ];
  }

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
      <div className="relative mb-4 flex w-full flex-wrap items-center">
        {isLoadingDrawdown ? (
          <InfoCardsSkeleton />
        ) : (
          <InfoCards data={cardData} />
        )}
      </div>
      <Tabs defaultValue="drawdown">
        <div className="flex justify-end">
          <TabsList>
            <TabsTrigger value="drawdown">Drawdown</TabsTrigger>
            <TabsTrigger value="unit-allotments">Unit Allotments</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="drawdown">
          <DataTable
            columns={drawdownTableColumns}
            data={drawdownTableRows}
            isLoading={isLoadingLP}
            openView={handleViewDrawdownDetails}
          />
        </TabsContent>
        <TabsContent value="unit-allotments">
          <DataTable
            columns={columnsUnitAllotments}
            fetchData={(args) => {
              return useGetUnitAllotments({
                ...args,
                filters: [{ filterid: "quarter", optionid: quarter }],
              });
            }}
          />
        </TabsContent>
        <TabsContent value="payments">
          <DataTable
            columns={paymentTableColumns}
            data={paymentTableRows}
            isLoading={isLoadingPayments}
            openView={handleViewPaymentDetails}
          />
        </TabsContent>
      </Tabs>
      <SheetView
        isOpen={!!sheetProps}
        onClose={() => setSheetProps(null)}
        {...sheetProps}
      />

      <DialogForm
        title={manualPaymentProps?.title}
        description={manualPaymentProps?.description}
        submitText="Update"
        form={form}
        onSubmit={form.handleSubmit(handleManualPaymentSubmit)}
        formFields={manualPaymentSchema}
        isOpen={!!manualPaymentProps}
        onClose={() => setManualPaymentProps(null)}
      />
    </section>
  );
}
