import { z } from "zod";

export const manualPaymentZodSchema = z.object({
  paid_amount: z.preprocess((val) => Number(val), z.number().min(0, "Paid amount must be a positive number")),
  payment_date: z.date({ required_error: "Payment date is required" }),
  notes: z.string().optional(),
});
