import { currencyFormatter } from "@/lib/formatter";

  export function mapDrawdownToCards(rows) {
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