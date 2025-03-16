import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .regex(
      /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
      "Invalid email format",
    )
    .nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});


export const registerSchema = z.object({
  name: z.string().nonempty("Name is required").max(255, "Name is too long"),
  email: z
    .string()
    .email("Invalid email format")
    .regex(
      /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
      "Invalid email format",
    )
    .nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
  phone: z
    .string()
    .nonempty("Phone is required")
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  role: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.enum(
      [
        "Compliance Officer",
        "LP",
        "Portfolio Company",
        "Auditor",
        "Legal Consultant",
        "Fund Manager",
      ],
      {
        required_error: "Role is required",
      },
    ),
  ),
});
