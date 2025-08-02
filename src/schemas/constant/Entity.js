export const Entity = {
  Sponsor: "Sponsor",
  Manager: "Manager",
  Trust: "Trust",
  Custodian: "Custodian",
  RTA: "RTA",
  Trustee: "Trustee",
  Auditor: "Auditor",
  Merchant_Banker: "Merchant Banker",
  Legal_Advisor: "Legal Advisor",
  Compliance_Officer: "Compliance Officer",
  Accountant: "Accountant",
  Tax: "Tax",
};

export const registrationRequired = [
  Entity.Sponsor,
  Entity.Manager,
  Entity.Merchant_Banker,
  Entity.Auditor,
  Entity.RTA,
  Entity.Trustee,
  Entity.Trust,
];

export const tanRequired = [Entity.Sponsor, Entity.Manager, Entity.Trust];
export const incorporationDateRequired = [
  Entity.Sponsor,
  Entity.Manager,
  Entity.Trust,
];
export const gstRequired = [Entity.Sponsor, Entity.Manager];
export const pocDinPanRequired = [Entity.Manager];


export const alwaysVisibleFields = [
  "entity_type",
  "entity_name",
  "entity_email",
  "entity_telephone",
  "entity_address",
  "entity_pan",
];


export const defaultValues = {
  entity_type: undefined,
  entity_name: "",
  entity_email: "",
  entity_telephone: "",
  entity_address: "",
  entity_pan: "",
  entity_registration_number: "",
  entity_tan: "",
  entity_date_of_incorporation: undefined,
  entity_gst_number: "",
  entity_poc: "",
  entity_poc_din: "",
  entity_poc_pan: "",
};
