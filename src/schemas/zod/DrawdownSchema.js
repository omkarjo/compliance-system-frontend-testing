import { z } from "zod";

export const DrawdownSchema = z.object({
    fund_id: z.union([z.string(), z.number()])
        .refine((val) => val !== "" && val !== null && val !== undefined, { message: "Fund is required" }),
    notice_date: z.date(),
    due_date: z.date(),
    percentage_drawdown: z.coerce.number()
        .refine((val) => !isNaN(val), { message: "Percentage drawdown must be a number" })
        .refine((val) => val >= 0 && val <= 100, { message: "Percentage drawdown must be between 0 and 100" }),
    forecast_next_quarter: z.coerce.number()
        .refine((val) => !isNaN(val), { message: "Forecasted drawdown for next quarter must be a number" }),
});
