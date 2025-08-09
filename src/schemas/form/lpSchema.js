const validateEmail = (email) => {
  if (typeof email !== "string" || email.trim() === "") {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const lpFromFields = [
  {
    name: "lp_name",
    label: "Name",
    type: "text",
    placeholder: "",
    required: true,
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    placeholder: "Select Gender",
    required: true,
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Others", value: "others" },
    ],
  },
  {
    name: "dob",
    label: "Date of Birth",
    type: "date",
    placeholder: "Select Date of Birth",
    required: true,
    pastDisable: false,
    futureDisable: true,
  },
  {
    name: "mobile_no",
    label: "Mobile Number",
    type: "phone",
    required: true,
    className: "",
    placeholder: "Please enter mobile number",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Please enter email",
    required: true,
  },
  {
    name: "pan",
    label: "PAN Number",
    type: "text",
    placeholder: "Please enter PAN number",
    required: true,
  },
  {
    name: "address",
    label: "Address",
    type: "textarea",
    placeholder: "Please enter address",
    required: true,
  },
  {
    type: "subheading",
    label: "Contribution",
    className: "font-bold",
  },
  {
    type: "subheading",
    label: "Add relevant details about contribution",
  },
  {
    name: "nominee",
    label: "Nominee",
    type: "text",
    placeholder: "Please enter nominee name",
    required: true,
  },
  {
    name: "commitment_amount",
    label: "Commitment Amount",
    description: "Should be greater than ₹1Cr",
    type: "number",
    min: 1,
    required: true,
    className: "",
  },
  {
    name: "doi",
    label: "Date of Incorporation",
    type: "date",
    placeholder: "Select Date of Incorporation",
    required: true,
  },
  {
    name: "date_of_agreement",
    label: "Date of Agreement",
    type: "date",
    placeholder: "Select Date of Agreement",
    required: true,
  },
  {
    name: "dpid",
    label: "Dpid",
    type: "text",
    placeholder: "",
    required: true,
  },
  {
    name: "client_id",
    label: "Client ID",
    type: "text",
    placeholder: "",
    required: true,
  },
  {
    name: "class_of_shares",
    label: "Class of Share",
    type: "select",
    placeholder: "Please select class of share",
    required: true,
    options: [
      { label: "Class A", value: "INF1C8N22014" },
      { label: "Class B", value: "INF1C8N22022" },
    ],
  },
  {
    name: "isin",
    label: "ISIN",
    type: "text",
    placeholder: "",
    required: true,
    disabled: true,
  },
  {
    name: "type",
    label: "Entity Type",
    type: "select",
    placeholder: "Please select entity type",
    required: true,
    options: [
      { label: "Individual", value: "individual" },
      { label: "Corporate", value: "corporate" },
      { label: "Partnership", value: "partnership" },
      { label: "Trust", value: "trust" },
    ],
  },
  {
    name: "citizenship",
    label: "Tax Jurisdiction",
    type: "select",
    placeholder: "Please select tax jurisdiction",
    required: true,
    options: [
      { label: "Resident", value: "resident" },
      { label: "Non-Resident Ordinary (NRO)", value: "nro" },
      { label: "Non-Resident External (NRE)", value: "nre" },
      { label: "Non-resident", value: "non-resident" },
    ],
  },
  {
    name: "emaildrawdowns",
    type: "tags_input",
    label: "Email For Drawdowns",
    description: "You can add multiple emails separated by a comma",
    placeholder: "Please enter email",
    required: true,
    separators: [",", ";", "Enter"],
    maxTags: 5,
    validateTag: validateEmail,
  },
];


export const lpCreateSchema = [
  {
    name: "kyc_file",
    label: "KYC File",
    type: "file",
    required: true,
    multiple: false,
    dropZoneConfig: {
      accept: {
        "application/pdf": [".pdf"],
      },
      maxFiles: 1,
      maxSize: 1024 * 1024 * 5,
      multiple: false,
    },
  },
  {
    name: "kyc_expiry_date",
    label: "KYC Expiry Date",
    type: "date",
    required: false,
    placeholder: "Select KYC Expiry Date",
  },
  {
    name: "ca_file",
    label: "CA File",
    type: "file",
    required: true,
    multiple: false,
    dropZoneConfig: {
      accept: {
        "application/pdf": [".pdf"],
      },
      maxFiles: 1,
      maxSize: 1024 * 1024 * 5,
      multiple: false,
    },
  },
  {
    name: "ca_expiry_date",
    label: "CA Expiry Date",
    type: "date",
    required: false,
    placeholder: "Select CA Expiry Date",
  },
  {
    name: "cml_file",
    label: "CML File",
    type: "file",
    required: true,
    multiple: false,
    dropZoneConfig: {
      accept: {
        "application/pdf": [".pdf"],
      },
      maxFiles: 1,
      maxSize: 1024 * 1024 * 4,
      multiple: false,
    },
  },
  {
    name: "cml_expiry_date",
    label: "CML Expiry Date",
    type: "date",
    required: false,
    placeholder: "Select CML Expiry Date",
  },
  {
    name: "fund_id",
    label: "Fund ID",
    type: "fund_select",
    required: false,
    placeholder: "Please select fund",
  },
];
