import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";
import {
  CategorySubcategory,
  LegalStructure,
  SchemeStructure,
} from "../constant/Fund";

const fundSchema = z.object({
  scheme_name: z.string().min(1, "Scheme name is required"),
  scheme_status: z.enum(["Active", "Inactive"], {
    errorMap: () => ({ message: "Scheme status is required" }),
  }),
  scheme_structure_type: z.enum(Object.values(SchemeStructure), {
    errorMap: () => ({ message: "Scheme structure is required" }),
  }),
  scheme_pan: z
    .string()
    .regex(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, "Invalid PAN number"),
  date_final_draft_ppm: z.coerce.date({
    errorMap: () => ({ message: "Date is required" }),
  }),
  date_sebi_ppm_comm: z.coerce.date({
    errorMap: () => ({ message: "Date is required" }),
  }),
  date_launch_of_scheme: z.coerce.date({
    errorMap: () => ({ message: "Date is required" }),
  }),
  date_initial_close: z.coerce.date({
    errorMap: () => ({ message: "Date is required" }),
  }),
  date_final_close: z.coerce.date({
    errorMap: () => ({ message: "Date is required" }),
  }),
  terms_end_date: z.coerce.date({
    errorMap: () => ({ message: "Date is required" }),
  }),
  extended_end_date: z.coerce.date({
    errorMap: () => ({ message: "Date is required" }),
  }),
  commitment_initial_close_cr: z.coerce.number().min(0, {
    message: "Must be a valid non-negative number",
  }),
  target_fund_size: z.coerce.number().min(0, {
    message: "Must be a valid non-negative number",
  }),
  greenshoe_option: z.coerce.number().min(0, {
    message: "Must be a valid non-negative number",
  }),
  // convert "true" or "false" to boolean
  extension_permitted: z.enum(["true", "false"]).transform((val) => val === "true"),
  nav: z.coerce.number().min(0, {
    message: "NAV must be a valid non-negative number",
  }),
  date_of_appointment: z.coerce.date({
    errorMap: () => ({ message: "Date of appointment is required" }),
  }),
  stamp_duty_rate: z.coerce.number().min(0, {
    message: "Stamp duty rate must be a valid non-negative number",
  }),
  mgmt_fee_rate: z.coerce.number().min(0, {
    message: "Management fee rate must be a valid non-negative number",
  }),
});

const bankDetailsSchema = z.object({
  bank_name: z.string().min(1, "Bank name is required"),
  bank_ifsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
  bank_account_name: z.string().min(1, "Account name is required"),
  bank_account_no: z.string().min(1, "Account number is required"),
  bank_contact_person: z.string().min(1, "Contact person is required"),
  bank_contact_phone: z
    .string()
    .nonempty("Phone is required")
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
});

const aifSchema = z.object({
  aif_name: z.string().min(1, "AIF name is required"),
  aif_pan: z.string().regex(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, "Invalid PAN number"),
  aif_registration_no: z.string().min(1, "Registration number is required"),
  legal_structure: z.enum(Object.values(LegalStructure), {
    errorMap: () => ({ message: "Legal structure is required" }),
  }),
  category_subcategory: z.enum(Object.values(CategorySubcategory), {
    errorMap: () => ({ message: "Category/Sub-category is required" }),
  }),
  custodian_name: z.string().min(1, "Custodian name is required"),
  rta_name: z.string().min(1, "RTA name is required"),
});

const complianceOfficerSchema = z.object({
  compliance_officer_name: z
    .string()
    .min(1, "Compliance officer name is required"),
  compliance_officer_email: z
    .string()
    .email("Invalid email")
    .min(1, "Compliance officer email is required"),
  compliance_officer_phone: z
    .string()
    .nonempty("Compliance officer phone is required")
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
});

const investmentOfficerSchema = z.object({
  investment_officer_name: z
    .string()
    .min(1, "Investment officer name is required"),
  investment_officer_designation: z
    .string()
    .min(1, "Investment officer designation is required"),
  investment_officer_pan: z
    .string()
    .regex(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, "Invalid PAN number"),
  investment_officer_din: z
    .string()
    .min(1, "Investment officer DIN is required"),
});

export const combinedFundFormSchema = fundSchema
  .merge(bankDetailsSchema)
  .merge(aifSchema)
  .merge(complianceOfficerSchema)
  .merge(investmentOfficerSchema);

export const fundEntityLinkSchema = z.object({
  entity_id: z
    .number({
      required_error: "Entity ID is required",
      invalid_type_error: "Entity ID must be a number",
    }),
  is_primary: z.boolean().default(false),
});
