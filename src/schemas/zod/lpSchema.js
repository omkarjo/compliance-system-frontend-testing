import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";
import { CLASS_OF_SHARES, ENTITY_TYPES, GENDER_OPTIONS } from "../feilds/lpFromFields";

const gender_Options = Object.values(GENDER_OPTIONS)
const class_Options = Object.values(CLASS_OF_SHARES);
const entity_Types = Object.values(ENTITY_TYPES);

z.setErrorMap((issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_enum_value) {
    return { message: "Invalid value" };
  }

  if (issue.code === z.ZodIssueCode.invalid_type) {
    return { message: "This field is required" };
  }

  if (issue.code === z.ZodIssueCode.too_small) {
    return { message: "Value is too short" };
  }

  return { message: ctx.defaultError };
});
export const lpSchema = z.object({
  lp_name: z.string().min(1, "Name is required"),
  gender: z.enum(gender_Options),
  dob: z.date().refine((date) => date <= new Date(), {
    message: "Date of birth must be in the past",
  }),
  mobile_no: z
    .string()
    .nonempty("Phone is required")
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  email: z.string().email("Invalid email address"),
  pan: z.string().regex(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, "Invalid PAN number"),
  address: z.string().min(1, "Address is required"),
  nominee: z.string().min(1, "Nominee is required"),
  commitment_amount: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val > 1e7, {
      message: "Commitment amount must be greater than ₹1Cr",
    }),
  // acknowledgement_of_ppm: z.enum(["yes", "no"]),
  date_of_agreement: z.date(),
  dpid: z.string().min(1, "Dpid is required"),
  client_id: z.string().min(1, "Client ID is required"),
  class_of_shares: z.enum(class_Options),
  isin: z.string().min(1, "ISIN is required"),
  type: z.enum(entity_Types),
  citizenship: z.enum(["resident", "nro", "nre", "non-resident"]),
  emaildrawdowns: z
    .array(z.string().email("Invalid email address"))
    .optional()
});

export const lpCreateZodSchema = z.object({
  kyc_file: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size <= 5 * 1024 * 1024, {
          message: "KYC file size must be less than 5MB",
        })
        .refine(
          (file) =>
            ["application/pdf", "image/jpeg", "image/png"].includes(file.type),
          { message: "Invalid KYC file type" },
        ),
    )
    .max(1, { message: "Only one KYC file allowed" })
    .min(1, { message: "KYC file is required" }),
  // kyc_expiry_date: z.date().optional(),
  ca_file: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size <= 5 * 1024 * 1024, {
          message: "CA file size must be less than 5MB",
        })
        .refine(
          (file) =>
            ["application/pdf", "image/jpeg", "image/png"].includes(file.type),
          { message: "Invalid CA file type" },
        ),
    )
    .max(1, { message: "Only one CA file allowed" })
    .min(1, { message: "CA file is required" }),
  // ca_expiry_date: z.date().optional(),
  cml_file: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size <= 4 * 1024 * 1024, {
          message: "CML file size must be less than 4MB",
        })
        .refine(
          (file) =>
            [
              "application/pdf",
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "text/plain",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ].includes(file.type),
          { message: "Invalid CML file type" },
        ),
    )
    .max(1, { message: "Only one CML file allowed" })
    .min(1, { message: "CML file is required" }),
  // cml_expiry_date: z.date().optional(),
  fund_id: z.string()
});
