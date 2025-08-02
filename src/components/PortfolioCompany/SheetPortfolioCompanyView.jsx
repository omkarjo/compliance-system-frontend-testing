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
import { Building2, FileText, Sprout, MapPin } from "lucide-react";

const portfolioCompanySchema = [
  {
    key: "startup_brand",
    label: "Startup Brand",
    type: "text",
    icon: <Sprout size={20} />,
  },
  {
    key: "company_name",
    label: "Company Name",
    type: "text",
    icon: <Building2 size={20} />,
  },
  {
    key: "sector",
    label: "Sector",
    type: "text",
  },
  {
    key: "product_description",
    label: "Product Description",
    type: "textarea",
    icon: <FileText size={20} />,
  },
  {
    key: "registered_address",
    label: "Registered Address",
    type: "textarea",
    icon: <MapPin size={20} />,
  },
  {
    key: "pan",
    label: "PAN Number",
    type: "text",
  },
  {
    key: "isin",
    label: "ISIN",
    type: "text",
  },
  {
    key: "created_at",
    label: "Created At",
    type: "date",
  },
  {
    key: "updated_at",
    label: "Updated At",
    type: "date",
  },
];

export default function SheetPortfolioCompanyView({
  data = {},
  isOpen = true,
  onClose = () => {},
  onEdit = () => {},
}) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className={cn("w-full sm:max-w-md")}>
        <SheetHeader className="mt-4 pb-0 md:mt-8">
          <SheetTitle>{data?.startup_brand}</SheetTitle>
          <SheetDescription>{data?.company_name}</SheetDescription>
          <Badge variant="outline" className="w-fit text-xs">
            {data?.sector || "Unknown Sector"}
          </Badge>
        </SheetHeader>
        <hr className="mx-auto w-11/12" />
        <ScrollArea className="overflow-y-auto pb-4">
          <table className="mx-auto w-11/12 text-sm">
            <tbody>
              {portfolioCompanySchema.map(({ key, label, type, icon }) =>
                renderCell(key, label, type, icon, data)
              )}
            </tbody>
          </table>
          <div className="flex w-full justify-center pb-4">
            {/* <Button
              onClick={() => onEdit(data)}
              className="mt-4 flex w-11/12 items-center justify-center gap-2"
              size="lg"
            >
              Edit
            </Button> */}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
