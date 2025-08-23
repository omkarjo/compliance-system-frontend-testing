import {
  CategorySubcategory,
  LegalStructure,
  SchemeStructure,
} from "../constant/Fund";

// {
//   "scheme_name": "string",
//   "scheme_status": "Active",
//   "aif_name": "string",
//   "aif_pan": "string",
//   "aif_registration_no": "string",
//   "legal_structure": "Trust",
//   "category_subcategory": "Category I AIF",
//   "scheme_structure_type": "Close Ended",
//   "custodian_name": "string",
//   "rta_name": "string",
//   "compliance_officer_name": "string",
//   "compliance_officer_email": "string",
//   "compliance_officer_phone": "string",
//   "investment_officer_name": "string",
//   "investment_officer_designation": "string",
//   "investment_officer_pan": "string",
//   "investment_officer_din": "string",
//   "date_of_appointment": "2025-07-15",
//   "scheme_pan": "string",
//   "nav": 0,
//   "target_fund_size": 0,
//   "date_final_draft_ppm": "2025-07-15",
//   "date_sebi_ppm_comm": "2025-07-15",
//   "date_launch_of_scheme": "2025-07-15",
//   "date_initial_close": "2025-07-15",
//   "date_final_close": "2025-07-15",
//   "commitment_initial_close_cr": 0,
//   "terms_end_date": "2025-07-15",
//   "bank_name": "string",
//   "bank_ifsc": "string",
//   "bank_account_name": "string",
//   "bank_account_no": "string",
//   "bank_contact_person": "string",
//   "bank_contact_phone": "string",
//   "entity_type": "string",
//   "entity_name": "string",
//   "entity_pan": "string",
//   "entity_email": "string",
//   "entity_address": "string",
//   "extension_permitted": true,
//   "extended_end_date": "2025-07-15",
//   "greenshoe_option": 0
// }

export const fund_Schmema_fields = [
  {
    type: "heading",
    label: "Scheme Details",
    className: "col-span-1 md:col-span-2 text-xl font-semibold",
  },
  {
    type: "subheading",
    label: "Add relevant details about the scheme.",
    className: "col-span-1 md:col-span-2",
  },
  {
    name: "scheme_name",
    label: "Scheme Name",
    type: "text",
    placeholder: "Please enter scheme name",
    required: true,
  },
  {
    name: "scheme_status",
    label: "Scheme Status",
    type: "select",
    placeholder: "Please select scheme status",
    required: true,
    options: [
      { label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive" },
    ],
  },
  {
    name: "scheme_structure_type",
    label: "Scheme Structure",
    type: "select",
    placeholder: "Please select scheme structure",
    required: true,
    options: Object.values(SchemeStructure).map((structure) => ({
      label: structure,
      value: structure,
    })),
  },
  {
    name: "scheme_pan",
    label: "Scheme PAN",
    type: "text",
    placeholder: "Please enter scheme PAN",
    required: true,
  },
  {
    label: "Date of filing final draft PPM with SEBI",
    name: "date_final_draft_ppm",
    type: "date",
    placeholder: "Select date of filing final draft PPM with SEBI",
    required: true,
  },
  {
    label: "Date of SEBI Communication for taking the PPM on record",
    name: "date_sebi_ppm_comm",
    type: "date",
    placeholder:
      "Select date of SEBI Communication for taking the PPM on record",
    required: true,
  },
  {
    label: "Date of launch of Scheme",
    name: "date_launch_of_scheme",
    type: "date",
    placeholder: "Select date of launch of Scheme",
    required: true,
  },
  {
    label: "Date of Initial Close",
    name: "date_initial_close",
    type: "date",
    placeholder: "Select date of Initial Close",
    required: true,
  },
  {
    label: "Date of Final Close",
    name: "date_final_close",
    type: "date",
    placeholder: "Select date of Final Close",
    required: true,
  },
  {
    label: "Total Commitment received (Corpus) as on Initial Close (Rs. Cr)",
    name: "commitment_initial_close_cr",
    type: "number",
    placeholder:
      "Please enter total commitment received (Corpus) as on Initial Close (Rs. Cr)",
    required: true,
  },
  {
    label: "Target Fund Size",
    name: "target_fund_size",
    type: "number",
    placeholder: "Please enter target fund size",
    required: true,
  },
  {
    label: "Greenshoe option",
    name: "greenshoe_option",
    type: "number",
    placeholder: "Please enter greenshoe option",
    required: true,
  },
  {
    label: "End date of terms of Scheme",
    name: "terms_end_date",
    type: "date",
    placeholder: "Select end date of terms of Scheme",
    required: true,
  },

  {
    label: "Any Extension of Term permitted as per fund documents",
    name: "extension_permitted",
    type: "select",
    placeholder: "Please select if extension of term is permitted",
    required: true,
    options: [
      { label: "Yes", value: "true" },
      { label: "No", value: "false" },
    ],
  },
  {
    label: "End date of Extended term",
    name: "extended_end_date",
    type: "date",
    placeholder: "Select end date of Extended term",
    required: true,
  },
  {
    name: "nav",
    label: "NAV",
    type: "number",
    placeholder: "Please enter NAV",
    required: true,
  },
  {
    name: "date_of_appointment",
    label: "Date of Appointment",
    type: "date",
    placeholder: "Select date of appointment",
    required: true,
  },
  {
    name : "mgmt_fee_rate",
    label: "Management Fee Rate",
    type: "amount",
    placeholder: "Please enter management fee rate",
    required: true,
  },
  {
    name: "stamp_duty_rate",
    label: "Stamp Duty Rate",
    type: "number",
    placeholder: "Please enter stamp duty rate",
    required: true,
  }
];

export const fund_bank_details_fields = [
  {
    type: "heading",
    label: "Bank Details",
    className: "col-span-1 md:col-span-2 text-xl font-semibold",
  },
  {
    type: "subheading",
    label: "Add relevant details about the bank account.",
    className: "col-span-1 md:col-span-2",
  },
  {
    name: "bank_name",
    label: "Bank Name",
    type: "text",
    placeholder: "Please enter bank name",
    required: true,
  },
  {
    name: "bank_ifsc",
    label: "IFSC",
    type: "text",
    placeholder: "Please enter bank IFSC",
    required: true,
  },
  {
    name: "bank_account_name",
    label: "Account Name",
    type: "text",
    placeholder: "Please enter bank account name",
    required: true,
  },
  {
    name: "bank_account_no",
    label: "Account Number",
    type: "text",
    placeholder: "Please enter bank account number",
    required: true,
  },
  {
    name: "bank_contact_person",
    label: "Bank Contact Person",
    type: "text",
    placeholder: "Please enter bank contact person",
    required: true,
  },
  {
    name: "bank_contact_phone",
    label: "Bank Contact Phone",
    type: "phone",
    placeholder: "Please enter bank contact phone",
    required: true,
  },
];

export const fundAIFSchema = [
  {
    type: "heading",
    label: "AIF Details",
    className: "col-span-1 md:col-span-2 text-xl font-semibold",
  },
  {
    type: "subheading",
    label: "Add relevant details about the Alternative Investment Fund (AIF)",
    className: "col-span-1 md:col-span-2",
  },
  {
    name: "aif_name",
    label: "Name of AIF",
    type: "text",
    placeholder: "Please enter AIF name",
    required: true,
  },
  {
    name: "aif_pan",
    label: "PAN Number of AIF",
    type: "text",
    placeholder: "Please enter AIF PAN",
    required: true,
  },
  {
    name: "aif_registration_no",
    label: "Registration Number of AIF",
    type: "text",
    placeholder: "Please enter AIF registration number",
    required: true,
  },
  {
    name: "legal_structure",
    label: "Legal Structure",
    type: "select",
    placeholder: "Please select legal structure",
    required: true,
    options: Object.values(LegalStructure).map((structure) => ({
      label: structure,
      value: structure,
    })),
  },
  {
    name: "category_subcategory",
    label: "Category and Sub-category of the AIF*",
    type: "select",
    placeholder: "Please select category and sub-category of the AIF",
    required: true,
    options: Object.values(CategorySubcategory).map((category) => ({
      label: category,
      value: category,
    })),
  },
  {
    name: "custodian_name",
    label: "Custodian Name",
    type: "text",
    placeholder: "Please enter custodian name",
    required: true,
  },
  {
    name: "rta_name",
    label: "RTA Name",
    type: "text",
    placeholder: "Please enter RTA name",
    required: true,
  },
];

export const compliance_officer_fields = [
  {
    type: "heading",
    label: "Compliance Officer Details",
    className: "col-span-1 md:col-span-2 text-xl font-semibold",
  },
  {
    type: "subheading",
    label: "Add relevant details about the compliance officer.",
    className: "col-span-1 md:col-span-2",
  },
  {
    name: "compliance_officer_name",
    label: "Compliance Officer Name",
    type: "text",
    placeholder: "Please enter compliance officer name",
    required: true,
  },
  {
    name: "compliance_officer_email",
    label: "Compliance Officer Email",
    type: "email",
    placeholder: "Please enter compliance officer email",
    required: true,
  },
  {
    name: "compliance_officer_phone",
    label: "Compliance Officer Phone",
    type: "phone",
    placeholder: "Please enter compliance officer phone",
    required: true,
  },
];

export const investment_officer_fields = [
  {
    type: "heading",
    label: "Investment Officer Details",
    className: "col-span-1 md:col-span-2 text-xl font-semibold",
  },
  {
    type: "subheading",
    label: "Add relevant details about the investment officer.",
    className: "col-span-1 md:col-span-2",
  },
  {
    name: "investment_officer_name",
    label: "Investment Officer Name",
    type: "text",
    placeholder: "Please enter investment officer name",
    required: true,
  },
  {
    name: "investment_officer_designation",
    label: "Investment Officer Designation",
    type: "text",
    placeholder: "Please enter investment officer designation",
    required: true,
  },
  {
    name: "investment_officer_pan",
    label: "Investment Officer PAN",
    type: "text",
    placeholder: "Please enter investment officer PAN",
    required: true,
  },
  {
    name: "investment_officer_din",
    label: "Investment Officer DIN",
    type: "text",
    placeholder: "Please enter investment officer DIN",
    required: true,
  },
];

export const combinedFormSchema = [
  ...fund_Schmema_fields,
  ...fund_bank_details_fields,
  ...fundAIFSchema,
  ...compliance_officer_fields,
  ...investment_officer_fields,
];

export const fundEntityLinkFields = [
  {
    name: "entity_id",
    label: "Entity",
    type: "entity_select",
    placeholder: "Please select an entity",
    required: true,
    options: [],
  },
  {
    name : "is_primary",
    type: "checkbox",
    placeholder: "Is this the primary entity?",
  }
];
