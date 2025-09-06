export const manualPaymentFormFeilds = [
    {
        name: "paid_amount",
        label: "Paid Amount",
        type: "amount",
        placeholder: "Enter paid amount",
        required: true,
    },
    {
        name: "payment_date",
        label: "Payment Date",
        type: "date",
        placeholder: "Select payment date",
        required: true,
    },
    {
        name: "notes",
        label: "Notes",
        type: "textarea",
        placeholder: "Enter notes",
        required: false,
    },
];


export const uploadStatementField = [
  {
    name: "bank_statement",
    label: "Bank Statement",
    description: "Upload the bank statement file (PDF only).",
    type: "file",
    placeholder: "",
    required: true,
    dropZoneConfig: {
      useFsAccessApi: false,
      accept: {
        "application/pdf": [".pdf"],
      },
      maxFiles: 1,
      maxSize: 1024 * 1024 * 10, // 10 MB max size (adjust as needed)
      multiple: false,
    },
  },
];