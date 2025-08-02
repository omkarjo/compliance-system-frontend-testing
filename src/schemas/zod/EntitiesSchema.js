import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";
import {
    Entity,
    gstRequired,
    incorporationDateRequired,
    pocDinPanRequired,
    registrationRequired,
    tanRequired,
} from "../constant/Entity";

export const EntitySchema = z
  .object({
    entity_type: z.enum(Object.values(Entity), {
      errorMap: () => ({ message: "Entity type is required" }),
    }),
    entity_name: z.string().min(1, "Entity Name is required"),
    entity_email: z.string().email("Invalid email address"),
    entity_telephone: z
      .string()
      .nonempty("Phone number is required")
      .refine(isValidPhoneNumber, {
        message: "Invalid phone number",
      }),
    entity_address: z.string().min(1, "Address is required"),
    entity_pan: z
      .string()
      .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
    entity_registration_number: z.string().optional(),
    entity_tan: z.string().optional(),
    entity_date_of_incorporation: z.union([z.string(), z.date()]).optional(),
    entity_gst_number: z.string().optional(),
    entity_poc: z.string().optional(),
    entity_poc_din: z.string().optional(),
    entity_poc_pan: z.string().optional(),
  })
  .superRefine((data, ctx) => {

    const {
      entity_type,
        entity_registration_number,
        entity_tan,
        entity_date_of_incorporation,
        entity_gst_number,
        entity_poc,
        entity_poc_din,
        entity_poc_pan,
    } = data;
    if (
      registrationRequired.includes(entity_type) &&
      !entity_registration_number
    ) {
      ctx.addIssue({
        path: ["entity_registration_number"],
        code: z.ZodIssueCode.custom,
        message: "Registration number is required",
      });
    }

    if (tanRequired.includes(entity_type) && !entity_tan) {
      ctx.addIssue({
        path: ["entity_tan"],
        code: z.ZodIssueCode.custom,
        message: "TAN number is required",
      });
    }

    if (
      incorporationDateRequired.includes(entity_type) &&
      !entity_date_of_incorporation
    ) {
      ctx.addIssue({
        path: ["entity_date_of_incorporation"],
        code: z.ZodIssueCode.custom,
        message: "Date of incorporation is required",
      });
    }

    if (gstRequired.includes(entity_type) && !entity_gst_number) {
      ctx.addIssue({
        path: ["entity_gst_number"],
        code: z.ZodIssueCode.custom,
        message: "GST number is required",
      });
    }

    if (pocDinPanRequired.includes(entity_type)) {
      if (!entity_poc) {
        ctx.addIssue({
          path: ["entity_poc"],
          code: z.ZodIssueCode.custom,
          message: "Point of Contact is required",
        });
      }
      if (!entity_poc_din) {
        ctx.addIssue({
          path: ["entity_poc_din"],
          code: z.ZodIssueCode.custom,
          message: "Point of Contact DIN is required",
        });
      }
      if (!entity_poc_pan) {
        ctx.addIssue({
          path: ["entity_poc_pan"],
          code: z.ZodIssueCode.custom,
          message: "Point of Contact PAN is required",
        });
      }
    }
  });
