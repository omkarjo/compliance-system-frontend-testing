import { z } from "zod";

export const taskSchema = z.object({
  description: z.string().nonempty("Description is required"),
  category: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.enum(["LP", "Portfolio Company", "SEBI", "RBI", "IT/GST"], {
      required_error: "Category is required",
    }),
  ),
  document_type: z
    .preprocess(
      (val) => (val === "" ? undefined : val),
      z.enum(
        [
          "Contribution Agreement",
          "KYC",
          "Notification",
          "Report",
          "Others",
          "Certificate",
          "Information",
        ],
        {
          required_error: "Document Category is required",
        },
      ),
    )
    .optional(),
  deadline: z.date(),

  repeat: z.boolean().default(false),

  recurrence: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : val),
    z
      .enum(["Weekly", "Monthly", "Quarterly", "Yearly"], {
        required_error: "Recurrence is required",
      })
      .optional(),
  ),

  predecessor_task: z.string().optional(),

  attachments: z
    .array(
      z.union([
        z.instanceof(File).refine((file) => file.size < 10 * 1024 * 1024, {
          message: "File size must be less than 4MB",
        }),
        z.object({
          name: z.string(),
          id: z.string(),
          url: z.union([z.string(), z.null()]),
        }),
      ]),
    )
    .max(5, {
      message: "Maximum 5 files are allowed",
    })
    .optional(),

  assignee_id: z.string().nonempty("Assignee ID is required"),
  different_reviewer: z.boolean().default(false),
  reviewer_id: z.string().optional(),
  different_final_reviewer: z.boolean().default(false),
  approver_id: z.string().optional(),
});
