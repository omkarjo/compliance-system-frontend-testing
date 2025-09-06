/**
 * Returns the schema for Payment Sheet (sheet view, form, etc.).
 * @returns {Array}
 */
export function paymentSheetSchema() {
  return [
    { key: "lp_name", label: "Limited Partner", type: "text" },
    { key: "amount_due", label: "Amount Due", type: "currency" },
    { key: "paid_amount", label: "Paid Amount", type: "currency" },
    { key: "payment_date", label: "Payment Date", type: "date" },
    { key: "status", label: "Status", type: "badge" },
  ];
}