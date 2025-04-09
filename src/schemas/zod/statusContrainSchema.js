import { z } from "zod";

export const textConstrainSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export const fileConstrainSchema = z.object({
  attachments: z
    .array(
      z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
        message: "File size must be less than 4MB",
      }),
    )
    .min(1, {
      message: "Required",
    })
    .max(5, {
      message: "Maximum 5 files are allowed",
    }),
});
