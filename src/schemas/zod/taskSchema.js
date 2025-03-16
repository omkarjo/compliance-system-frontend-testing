import { z } from "zod";

export const taskSchema = z
  .object({
    title: z.string().nonempty("Title is required"),
    description: z.string().nonempty("Description is required"),
    category: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.enum(["LP", "Portfolio Company", "SEBI", "RBI", "IT/GST"], {
        required_error: "Category is required",
      }),
    ),
    completion_criteria: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.enum(["Document Upload", "Textual Information"], {
        required_error: "Completion criteria is required",
      }),
    ),
    deadline: z.date(),

    repeat: z.boolean().default(false),

    every: z
      .preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number().int().positive("Every must be a positive number"),
      )
      .optional(),

    recurrence: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z
        .enum(["DAY", "WEEK", "MONTH", "YEAR"], {
          required_error: "Recurrence is required",
        })
        ,
    ).optional(),

    predecessor_task: z.string().nonempty("Predecessor task is required"),

    attachements: z
      .array(z.string().nonempty("Attachment is required"))
      .optional(),

    assignee_id: z.string().nonempty("Assignee ID is required"),
    reviewer_id: z.string().nonempty("Reviewer ID is required"),
    approver_id: z.string().nonempty("Approver ID is required"),
  })
  .superRefine((data, ctx) => {
    if (data.repeat) {
      // Check `every`
      if (!data.every) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Required when repeat is enabled",
          path: ["every"],
        });
      }

      // Check `recurrence`
      if (!data.recurrence) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Required when repeat is enabled",
          path: ["recurrence"],
        });
      }
    }
  });
