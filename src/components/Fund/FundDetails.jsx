import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormatter } from "@/lib/formatter";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Check } from "lucide-react";

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

const importantDates = (fund) => [
  { title: "PPM Final Draft Sent", date: fund.date_final_draft_ppm },
  { title: "PPM Taken on Record", date: fund.date_sebi_ppm_comm },
  { title: "Scheme Launch", date: fund.date_launch_of_scheme },
  { title: "Initial Close", date: fund.date_initial_close },
  { title: "Final Close", date: fund.date_final_close },
  { title: "End Date of Scheme", date: fund.terms_end_date },
  { title: "End Date of Extended Term", date: fund.extended_end_date },
];

export default function FundDetails({ fund , isLoading  = false }) {
  if (!fund) return null;
  if (isLoading) return <FundDetailsSkeleton />;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-4 md:col-span-2">
        <div className="rounded-2xl border bg-white">
          <div className="grid grid-cols-1 items-start gap-6 p-6 md:grid-cols-2">
            <div>
              <p className="text-muted-foreground mb-1 text-sm font-normal">
                Scheme Details
              </p>
              <div className="mb-3 text-lg md:text-xl lg:text-2xl">
                {fund.scheme_name}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={cn(
                    "px-2 py-0.5 text-xs font-medium",
                    fund.scheme_status === "Active"
                      ? "border border-green-200 bg-green-100 text-green-800"
                      : "border border-red-200 bg-red-100 text-red-800",
                  )}
                >
                  {fund.scheme_status}
                </Badge>
                <Badge
                  variant="outline"
                  className="px-2 py-0.5 text-xs font-medium"
                >
                  {fund.scheme_pan}
                </Badge>
                {fund.extension_permitted && (
                  <Badge
                    variant="outline"
                    className="px-2 py-0.5 text-xs font-medium"
                  >
                    Extension Permitted
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex min-w-[210px] flex-col items-start justify-start">
              <p className="text-muted-foreground mb-1 text-right text-sm font-normal">
                Total Fund Size
              </p>
              <div className="text-2xl font-semibold whitespace-nowrap">
                {currencyFormatter
                  ? currencyFormatter(fund.target_fund_size)
                  : fund.target_fund_size}
              </div>
            </div>
          </div>
        </div>

        <Card className={"gap-1"}>
          <CardHeader className="pb-1">
            <span className="text-muted-foreground text-sm font-normal">
              AIF Details
            </span>
            <CardTitle className="text-lg font-normal md:text-xl lg:text-2xl">
              {fund.aif_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge variant="outline">{fund.aif_pan}</Badge>
              <Badge variant="outline">{fund.aif_registration_no}</Badge>
              <Badge variant="outline">{fund.legal_structure}</Badge>
              <Badge variant="outline">{fund.category_subcategory}</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-2xl border bg-white">
          <div className="grid grid-cols-1 items-center gap-6 p-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border bg-white">
                  <AvatarImage src="" alt={fund.bank_name} />
                  <AvatarFallback className="bg-gray-50 font-bold text-gray-400">
                    {fund.bank_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-muted-foreground mb-1 text-sm font-normal">
                    HDFC Bank
                  </p>
                  <div className="mb-1 text-lg font-semibold md:text-xl">
                    {fund.bank_account_name}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="px-3 py-1 text-xs font-medium"
                >
                  {fund.bank_account_no}
                </Badge>
                <Badge
                  variant="outline"
                  className="px-3 py-1 text-xs font-medium"
                >
                  {fund.bank_ifsc}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-sm font-normal">
                Bank Contact
              </p>
              <div className="mb-1 text-lg font-semibold md:text-xl">
                {fund.bank_contact_person}
              </div>
              <Badge variant="outline">{fund.bank_contact_phone}</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-4">
              <div className="text-xs text-gray-600">Target Fund Size</div>
              <div className="text-lg font-semibold md:text-2xl">
                {currencyFormatter(fund.target_fund_size)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-xs text-gray-600">
                Corpus as on Initial Close
              </div>
              <div className="text-lg font-semibold md:text-2xl">
                {currencyFormatter(fund.commitment_initial_close_cr)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-xs text-gray-600">Greenshoe Option</div>
              <div className="text-lg font-semibold md:text-2xl">
                {currencyFormatter(fund.greenshoe_option)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="flex flex-col gap-6">
        <CardHeader>
          <CardTitle className="text-lg">Important Dates</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="relative ml-4 border-l border-gray-300">
            {importantDates(fund).map(
              ({ title, date }, idx) =>
                date && (
                  <li key={title} className="mb-8 ml-6">
                    <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
                      <Check className="h-4 w-4" />
                    </span>
                    <div
                      className={cn(
                        "font-medium",
                        idx === importantDates(fund).length - 1 &&
                          "font-semibold",
                      )}
                    >
                      {title}
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatDate(date, "dd MMM yyyy")}
                    </div>
                  </li>
                ),
            )}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

export function FundDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-4 md:col-span-2">
        {/* Scheme Details Skeleton */}
        <div className="rounded-2xl border bg-white">
          <div className="grid grid-cols-1 items-start gap-6 p-6 md:grid-cols-2">
            <div>
              <Skeleton className="mb-2 h-4 w-32" />
              <Skeleton className="mb-4 h-7 w-64" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-14 rounded" />
                <Skeleton className="h-6 w-16 rounded" />
                <Skeleton className="h-6 w-28 rounded" />
              </div>
            </div>
            <div className="flex min-w-[210px] flex-col items-start justify-start">
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-7 w-40" />
            </div>
          </div>
        </div>
        {/* AIF Details Skeleton */}
        <Card>
          <CardHeader className="pb-1">
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="mt-1 flex flex-wrap gap-2">
              <Skeleton className="h-6 w-16 rounded" />
              <Skeleton className="h-6 w-20 rounded" />
              <Skeleton className="h-6 w-16 rounded" />
              <Skeleton className="h-6 w-24 rounded" />
            </div>
          </CardContent>
        </Card>
        {/* Bank Info Skeleton */}
        <div className="rounded-2xl border bg-white">
          <div className="grid grid-cols-1 items-center gap-6 p-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div>
                  <Skeleton className="mb-2 h-4 w-20" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-32 rounded" />
                <Skeleton className="h-6 w-24 rounded" />
              </div>
            </div>
            <div>
              <Skeleton className="mb-2 h-4 w-20" />
              <Skeleton className="h-6 w-28" />
              <Skeleton className="mt-2 h-6 w-32 rounded" />
            </div>
          </div>
        </div>
        {/* Bottom Numbers Skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-4">
              <Skeleton className="mb-2 h-3 w-24" />
              <Skeleton className="h-6 w-24" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <Skeleton className="mb-2 h-3 w-32" />
              <Skeleton className="h-6 w-24" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <Skeleton className="mb-2 h-3 w-24" />
              <Skeleton className="h-6 w-24" />
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Timeline skeleton */}
      <Card className="flex flex-col gap-6">
        <CardHeader>
          <Skeleton className="mb-2 h-5 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="mb-2 h-96 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
