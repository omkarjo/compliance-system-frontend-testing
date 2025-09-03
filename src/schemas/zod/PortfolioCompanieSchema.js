import { subSectorData } from "../constant/portfolio";
import { z } from "zod";


export const PortfolioCompanieSchema = z.object({
  startup_brand: z.string().min(1, "Startup Brand is required"),
  sector: z.array(z.string()).min(1, "Select at least 1 category").max(2, "You can select up to 2 categories"),
  subSector: z.array(z.string()).min(1, "Select at least one sub-sector"),
  pan: z.string().min(1, "PAN is required"),
  isin: z.string().min(1, "ISIN is required"),
  product_description: z.string().min(1, "Product Description is required"),
  founders: z.array(
    z.object({
      name: z.string().min(1, "Founder name is required"),
      email: z.string().email("Invalid email"),
      role: z.string().min(1, "Role is required"),
      LinkedIn: z.string().url("Invalid LinkedIn URL").optional(),
    })
  ).min(1, "At least one founder is required"),
  fund_id: z.string().min(1, "Fund ID is required"),
  amount_invested: z.coerce.number({
    invalid_type_error: "Amount Invested must be a number",
    required_error: "Amount Invested is required",
  }),
  termsheet_sign_date: z.coerce.date({ invalid_type_error: "Invalid date" }),
  funding_date: z.coerce.date({ invalid_type_error: "Invalid date" }),
  ec_sign_date: z.coerce.date({ invalid_type_error: "Invalid date" }),
  latest_valuation: z.coerce.number({
    invalid_type_error: "Latest Valuation must be a number",
    required_error: "Latest Valuation is required",
  }),
  valuation_date: z.coerce.date({ invalid_type_error: "Invalid date" }),
  sha_document: z.array(
    z.instanceof(File).refine(
      (file) =>
        file.size < 10 * 1024 * 1024 &&
        [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ].includes(file.type),
      {
        message: "Invalid file. Only PDF or XLSX up to 10MB allowed.",
      }
    )
  ).min(1, "At least one file is required"),
}).superRefine((data, ctx) => {
  // For each selected sector, at most one sub-sector is allowed, zero is allowed
  for (const category of data.sector) {
    const validSubs = (data.subSector || []).filter(
      sub => subSectorData[category]?.some(s => s.value === sub)
    );
    if (validSubs.length > 1) {
      ctx.addIssue({
        path: ["subSector"],
        code: z.ZodIssueCode.custom,
        message: `You can select at most one sub-sector for "${category}".`,
      });
    }
  }
  // Check for invalid sub-sectors (not belonging to selected categories)
  const allValidSubSectors = data.sector.flatMap(
    category => subSectorData[category]?.map(s => s.value) ?? []
  );
  if (!data.subSector.every(sub => allValidSubSectors.includes(sub))) {
    ctx.addIssue({
      path: ["subSector"],
      code: z.ZodIssueCode.custom,
      message: "Only select sub-sectors that match your chosen categories.",
    });
  }
  // At least one sub-sector must be selected (already checked by .min(1), this is just for explicit error message)
  if (!data.subSector || data.subSector.length < 1) {
    ctx.addIssue({
      path: ["subSector"],
      code: z.ZodIssueCode.too_small,
      type: "array",
      minimum: 1,
      inclusive: true,
      message: "Select at least one sub-sector",
    });
  }
});