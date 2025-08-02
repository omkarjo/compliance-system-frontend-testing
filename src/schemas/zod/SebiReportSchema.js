import { z } from "zod";

export const SebiReportSchema = z.object({
  temporary_investments: z
    .number({ invalid_type_error: "Temporary Investments must be a number" })
    .min(0, { message: "Temporary Investments cannot be negative" }),
  cash_in_hand: z
    .number({ invalid_type_error: "Cash in Hand must be a number" })
    .min(0, { message: "Cash in Hand cannot be negative" }),
  estimated_expenses: z
    .number({ invalid_type_error: "Estimated Expenses must be a number" })
    .min(0, { message: "Estimated Expenses cannot be negative" }),
});
