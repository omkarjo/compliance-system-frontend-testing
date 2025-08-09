import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { renderCell } from "@/lib/renderCell";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";

const fundSchema = [
  { key: "scheme_name", label: "Scheme Name", type: "text" },
  { key: "scheme_status", label: "Status", type: "badge" },
  { key: "aif_name", label: "AIF Name", type: "text" },
  { key: "aif_pan", label: "AIF PAN", type: "text" },
  { key: "aif_registration_no", label: "Registration No", type: "text" },
  { key: "legal_structure", label: "Legal Structure", type: "text" },
  { key: "category_subcategory", label: "Category/Subcategory", type: "text" },
  { key: "scheme_structure_type", label: "Structure Type", type: "text" },
  { key: "custodian_name", label: "Custodian", type: "text" },
  { key: "rta_name", label: "RTA", type: "text" },
  { key: "nav", label: "NAV", type: "currency" },
  { key: "target_fund_size", label: "Target Fund Size", type: "text" },
  { key: "date_launch_of_scheme", label: "Launch Date", type: "date" },
  { key: "date_initial_close", label: "Initial Close Date", type: "date" },
  { key: "date_final_close", label: "Final Close Date", type: "date" },
  { key: "bank_name", label: "Bank Name", type: "text" },
  { key: "bank_account_no", label: "Bank Account No", type: "text" },
  { key: "entity_name", label: "Entity Name", type: "text" },
  { key: "entity_pan", label: "Entity PAN", type: "text" },
];

export default function SheetFundView({
  data = {},
  isOpen = false,
  onClose = () => {},
}) {
  const navigate = useNavigate();

  if (data == null) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className={cn("w-full sm:max-w-md")}>
        <SheetHeader className="mt-4 pb-0 md:mt-8">
          <SheetTitle>{data?.scheme_name || "Fund Details"}</SheetTitle>
          <SheetDescription>{data?.aif_name || ""}</SheetDescription>
          {data?.scheme_status && (
            <Badge variant="outline" className="w-fit text-xs">
              {data.scheme_status}
            </Badge>
          )}
        </SheetHeader>
        
        <hr className="mx-auto w-11/12" />

        <ScrollArea className="overflow-y-auto pb-4">
          <table className="mx-auto w-11/12 text-sm">
            <tbody>
              {fundSchema
                .filter(
                  ({ key }) =>
                    data[key] !== null &&
                    data[key] !== undefined &&
                    data[key] !== "",
                )
                .map(({ key, label, type }) =>
                  renderCell(key, label, type, null, data),
                )}
            </tbody>
          </table>
          <div className="mt-3 px-4">
            <Button
              variant=""
              size="sm"
              onClick={() =>
                navigate(
                  `/dashboard/funds-details/${data?.fund_id}?action=view`,
                )
              }
            >
              View More
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
