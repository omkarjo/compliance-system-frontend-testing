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
        .enum(["DAY", "WEEK", "MONTH", "YEAR"], {
          required_error: "Recurrence is required",
        })
        .optional(),
    ),

    predecessor_task: z.string().optional(),

    attachements: z
      .array(z.string().nonempty("Attachment is required"))
      .optional(),

    assignee_id: z.string().nonempty("Assignee ID is required"),
    reviewer_id: z.string().nonempty("Reviewer ID is required"),
    approver_id: z.string().nonempty("Approver ID is required"),
  })
  .superRefine((data, ctx) => {
    console.log("zod data", data);
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
