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
    name: "percentage",
    label: "Percentage drawdown",
    placeholder: "Enter percentage drawdown",
    description: "Enter the value in percentage",
    type: "number",
    required: true,
  },
  {
    name: "amount",
    label: "Expected Drawdown Amount",
    placeholder: "Enter expected drawdown amount",
    description: "Enter the value in INR",
    type: "number",
    required: true,
  }
];
