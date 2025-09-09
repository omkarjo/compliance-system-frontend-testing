import { InfoCards, InfoCardsSkeleton } from "@/components/Cards/InfoCard";
import DialogForm from "@/components/layout/dashboard/includes/dialog-form";
import { drawdownSheetSchema } from "@/components/Sheet/schemas/drawdownSheetSchema";
import { paymentSheetSchema } from "@/components/Sheet/schemas/paymentSheetSchema";
import SheetView from "@/components/Sheet/SheetView";
import { DataTable, ServerDataTable } from "@/components/Table";
import { drawdownTableColumns } from "@/components/Table/columns/drawdownSubTable/drawdownTableColumns";
import { paymentTableColumns } from "@/components/Table/columns/drawdownSubTable/paymentTableColumns";
import { unitAllotmentTableColumns } from "@/components/Table/columns/drawdownSubTable/unitAllotmentTableColumns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPayloadForFastAPI } from "@/lib/formatter";
import { useManualRecordPayment } from "@/react-query/mutations/Payments/useManualRecordPayment";
import { useUploadBankStatement } from "@/react-query/mutations/Payments/useUploadBankStatement";
import { useGenerateUnitAllotments } from "@/react-query/mutations/UnitAllotment/useGenerateUnitAllotments";
import { useGetDrawdowns } from "@/react-query/query/drawdown/useGetDrawdowns";
import { useGetLP } from "@/react-query/query/lp/lpQuery";
import { useGetPayments } from "@/react-query/query/payment/useGetPayments";
import { useGetUnitAllotments } from "@/react-query/query/UnitAllotments/useGetUnitAllotments";
import {
  manualPaymentFormFeilds,
  uploadStatementField,
} from "@/schemas/feilds/PaymentFeilds";
import {
  manualPaymentZodSchema,
  uploadStatementSchema,
} from "@/schemas/zod/PaymentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { mapDrawdownToCards } from "./mapDrawdownToCards";

export default function DrawdownDetailPage() {
  const { quarter } = useParams();

  const { mutate: manualRecordPayment } = useManualRecordPayment();
  const { mutate: uploadBankStatement, isLoading: isUploading } =
    useUploadBankStatement();

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
  const [uploadStatementProps, setUploadStatementProps] = React.useState(null);

  const form = useForm({
    resolver: zodResolver(manualPaymentZodSchema),
  });

  const uploadStatementForm = useForm({
    resolver: zodResolver(uploadStatementSchema),
  });

  const handleManualPaymentFormOpen = (data) => {
    setSheetProps(null);
    setManualPaymentProps({
      title: "Manual Payment",
      description: "Enter the payment details below:",
      data: data,
    });
  };

  const handleUploadStatementFormOpen = (data) => {
    setSheetProps(null);
    setUploadStatementProps({
      title: "Upload Bank Statement",
      description: "Upload the bank statement file below:",
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

  const handleUploadStatementSubmit = (data) => {
    if (!uploadStatementProps?.data?.fund_id) {
      toast.error("Fund ID is missing. Cannot upload bank statement.");
      return;
    }

    if (!data.bank_statement || data.bank_statement.length === 0) {
      toast.error("Please select a bank statement file to upload.");
      return;
    }

    const file = data.bank_statement[0];

    if (file.type !== "application/pdf") {
      toast.error("Invalid file type. Please upload a PDF file.");
      return;
    }

    uploadBankStatement(
      {
        fund_id: uploadStatementProps.data.fund_id,
        bank_statement: file,
      },
      {
        onSuccess: () => {
          setUploadStatementProps(null);
          uploadStatementForm.reset();
        },
      },
    );
  };

  const drawdownsheetschema = drawdownSheetSchema();

  const handleViewDrawdownDetails = (data) => {
    setSheetProps({
      schema: drawdownsheetschema,
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

  const paymentSchema = paymentSheetSchema();
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

  const paymentTableRows =
    paymentsResp?.data?.map((payment) => {
      const lp = lpData?.data?.find((l) => l.lp_id === payment.lp_id);
      return {
        ...payment,
        lp_name: lp ? lp.lp_name : payment.lp_name || "-",
      };
    }) || [];

  const { mutate: generateUnitAllotments, isLoading: isGenerating } =
    useGenerateUnitAllotments();

  const handleGenerateUnitAllotments = () => {
    if (drawdownRows.length > 0 && drawdownRows[0].fund_id) {
      generateUnitAllotments(drawdownRows[0].fund_id);
    }
  };

  return (
    <section className="p-6">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <Button
          variant="secondary"
          onClick={handleGenerateUnitAllotments}
          isLoading={isGenerating}
        >
          Generate Unit Allotments
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            handleUploadStatementFormOpen(
              drawdownRows.length > 0 ? drawdownRows[0] : {},
            )
          }
          isLoading={isUploading}
        >
          Upload Bank Statements
        </Button>
        <Button
          variant="secondary"
          // onClick={handleGenerateUnitAllotments}
          // isLoading={isGenerating}
        >
          Generate Invi Filing
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
            columns={drawdownTableColumns()}
            data={drawdownTableRows}
            isLoading={isLoadingLP}
            onRowClick={(row) => handleViewDrawdownDetails(row.original)}
          />
        </TabsContent>
        <TabsContent value="unit-allotments">
          <ServerDataTable
            columns={unitAllotmentTableColumns()}
            fetchQuery={(args) => {
              return useGetUnitAllotments({
                ...args,
                filters: [{ filterid: "quarter", optionid: quarter }],
              });
            }}
          />
        </TabsContent>
        <TabsContent value="payments">
          <DataTable
            columns={paymentTableColumns()}
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
        formFields={manualPaymentFormFeilds}
        isOpen={!!manualPaymentProps}
        onClose={() => setManualPaymentProps(null)}
      />

      <DialogForm
        title={uploadStatementProps?.title}
        description={uploadStatementProps?.description}
        submitText="Upload"
        form={uploadStatementForm}
        onSubmit={uploadStatementForm.handleSubmit(handleUploadStatementSubmit)}
        formFields={uploadStatementField}
        isOpen={!!uploadStatementProps}
        onClose={() => setUploadStatementProps(null)}
      />
    </section>
  );
}
