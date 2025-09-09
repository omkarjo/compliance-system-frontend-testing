import BadgeStatusTask from "@/components/includes/badge-status";
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
import {
  Calendar,
  CheckCircle,
  CircleUserRound,
  File,
  Timer,
  TriangleAlert,
} from "lucide-react";

const statusKeyType = {
  Onboarded: "Completed",
  "Waiting For KYC": "Pending",
  "Under Review": "Review",
};

const lpDataSchema = [
  { key: "lp_name", label: "Name", type: "text" },
  { key: "gender", label: "Gender", type: "text" },
  { key: "dob", label: "Date of Birth", type: "date" },
  { key: "mobile_no", label: "Phone", type: "phone" },
  { key: "email", label: "Email", type: "email" },
  { key: "address", label: "Address", type: "textarea" },
  { key: "pan", label: "PAN Number", type: "text" },
  { key: "nominee", label: "Nominee", type: "text" },
  { key: "commitment_amount", label: "Commitment Amount", type: "currency" },
  {
    key: "date_of_agreement",
    label: "Date of Agreement",
    type: "date",
    icon: <Calendar size={20} />,
  },
  { key: "dpid", label: "DPID", type: "text" },
  { key: "client_id", label: "Client ID", type: "text" },
  { key: "class_of_shares", label: "Class of Shares", type: "text" },
  { key: "isin", label: "ISIN", type: "text" },
  { key: "type", label: "Type", type: "text" },
  { key: "citizenship", label: "Citizenship", type: "text" },
];

export default function SheetLPViewFM({
  data = {},
  isOpen = true,
  onClose = () => {},
  onEdit = () => {},
}) {
  const status = data?.status || "N/A";
  const type = statusKeyType[status] || "Pending";
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className={cn("w-full sm:max-w-md")}>
        <SheetHeader className="mt-4 pb-0 md:mt-8">
          <SheetTitle>{data?.lp_name}</SheetTitle>
          <SheetDescription>{data?.email}</SheetDescription>
          <BadgeStatusTask text={status} type={type} />{" "}
        </SheetHeader>
        <hr className="mx-auto w-11/12" />
        <ScrollArea className="overflow-y-auto pb-4">
          <table className="mx-auto w-11/12 text-sm">
            <tbody>
              {lpDataSchema.map(({ key, label, type, icon }) =>
                renderCell(key, label, type, icon, data),
              )}
            </tbody>
          </table>
          <div className="flex w-full justify-center pb-4">
            <Button
              onClick={() => onEdit(data)}
              className={"mt-4 flex w-11/12 items-center justify-center gap-2"}
              size={"lg"}
            >
              Edit
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
