export const drawnDownFeilds = [
  {
    name: "fund_id",
    label: "Fund",
    placeholder: "Please select a fund",
    type: "fund_select",
    required: true,
  },
  {
    name: "notice_date",
    label: "Notice Date",
    placeholder: "Select notice date",
    type: "date",
    required: true,
  },
  {
    name: "due_date",
    label: "Due Date",
    placeholder: "Select due date",
    type: "date",
  },
  {
    name: "percentage_drawdown",
    label: "Percentage drawdown",
    placeholder: "Enter percentage drawdown",
    type: "number",
    required: true,
  },

  {
    name: "forecast_next_quarter",
    label: "Forecasted drawdown for next quarter",
    type: "number",
    placeholder: "",
    required: true,
  },
];
