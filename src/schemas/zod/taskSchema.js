import { z } from "zod";

export const taskSchema = z
  .object({
    description: z.string().nonempty("Description is required"),
    category: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.enum(["LP", "Portfolio Company", "SEBI", "RBI", "IT/GST"], {
        required_error: "Category is required",
      }),
    ),
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
        z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
          message: "File size must be less than 4MB",
        }),
      )
      .max(5, {
        message: "Maximum 5 files are allowed",
      })
      .optional(),

    assignee_id: z.string().nonempty("Assignee ID is required"),
    reviewer_id: z.string().nonempty("Reviewer ID is required"),
    approver_id: z.string().nonempty("Approver ID is required"),
  })
  .superRefine((data, ctx) => {
    if (data.repeat === true && !data.recurrence) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Required when repeat is enabled",
        path: ["recurrence"],
      });
    }
    if (!data.repeat) {
      data.recurrence = undefined;
    }
  });
