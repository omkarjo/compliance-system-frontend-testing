import { z } from "zod";

export const lpTaskSchema = z.object({
  attachments: z
    .array(
      z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
        message: "File size must be less than 4MB",
      }),
    )
    .max(5, {
      message: "Maximum 5 files are allowed",
    }),
});
