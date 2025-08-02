export const campaignCapitalCallSchema = [
//   {
//     type: "heading",
//     label: "Capital Call",
//     className: "",
//   },
//   {
//     type: "subheading",
//     label: "Send capital call to all onboarded Limited Partners",
//   },
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
    name: "percentage",
    label: "Percentage drawdown",
    placeholder: "Enter percentage drawdown",
    type: "number",
    required: true,
  },
  {
    name: "amount",
    label: "Expected drawdown amount for this quarter",
    placeholder: "2000000",
    type: "number",
    required: true,
  },
  {
    name: "force_drawdown",
    label: "Forecasted drawdown for next quarter",
    type : "number",
    placeholder: "2000000",
    required: true,
  },
];
