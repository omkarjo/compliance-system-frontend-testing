import { z } from "zod";

export const manualPaymentZodSchema = z.object({
  paid_amount: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Paid amount must be a positive number"),
  ),
  payment_date: z.date({ required_error: "Payment date is required" }),
  notes: z.string().optional(),
});

export const uploadStatementSchema = z.object({
  bank_statement: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file && file.size <= 1024 * 1024 * 10, {
          message:
            "Each file must be a PDF and less than or equal to 10 MB in size",
        }),
    )
    .min(1, "At least one bank statement file is required")
    .max(1, "Maximum 1 file allowed"),
});
