/**
 * Returns the schema for Drawdown Sheet (sheet view, form, etc.).
 * @returns {Array}
 */
export function drawdownSheetSchema() {
  return [
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
}