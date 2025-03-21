import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export const lpSchema = z.object({
  docoments: z
    .array(
      z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
        message: "File size must be less than 4MB",
      }),
    )
    .max(1, {
      message: "Maximum 5 files are allowed",
    })
    .optional(),
  lp_name: z.string().min(1, "Name is required"),
  gender: z.enum(["male", "female", "others"]),
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
    .refine((val) => !isNaN(val) && val > 1, {
      message: "Commitment amount must be greater than ₹1Cr",
    }),
  acknowledgement_of_ppm: z.enum(["yes", "no"]),
  cml: z
    .array(
      z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
        message: "File size must be less than 4MB",
      }),
    )
    .max(1, {
      message: "Maximum 5 files are allowed",
    }),
  doi : z.date(),
  // depository: z.enum(["nsdl", "cdsl"]),
  dpid: z.string().min(1, "Dpid is required"),
  client_id: z.string().min(1, "Client ID is required"),
  class_of_shares: z.enum(["INF1C8N22014", "INF1C8N22022"]),
  isin: z.string().min(1, "ISIN is required"),
  type: z.enum(["individual", "corporate", "partnership", "trust"]),
  citizenship: z.enum(["resident", "nro", "nre", "non-resident"]),
  geography: z.string().min(1, "Geography is required"),
  emaildrawdowns: z
    .string()
    .regex(
      /^([\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,},?)+$/,
      "Invalid email format for drawdowns",
    ),
});
