import BadgeStatusTask from "@/components/includes/badge-status";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { renderCell } from "@/lib/renderCell";
import { CircleUserRound, File, Timer, TriangleAlert, Calendar, CheckCircle } from "lucide-react";


const lpDataSchema = [
  {
    key: "attachments",
    label: "Attachments",
    type: "file",
    icon: <File size={20} />,
  },
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
    key: "acknowledgement_of_ppm",
    label: "Acknowledgement of PPM",
    type: "boolean",
  },
  {
    key: "doi",
    label: "Date of Incorporation",
    type: "date",
    icon: <Timer size={20} />,
  },
  {
    key: "date_of_agreement",
    label: "Date of Agreement",
    type: "date",
    icon: <Calendar size={20} />,
  },
  { key: "depository", label: "Depository", type: "text" },
  { key: "dpid", label: "DPID", type: "text" },
  { key: "client_id", label: "Client ID", type: "text" },
  { key: "class_of_shares", label: "Class of Shares", type: "text" },
  { key: "isin", label: "ISIN", type: "text" },
  { key: "type", label: "Type", type: "text" },
  { key: "citizenship", label: "Citizenship", type: "text" },
  { key: "geography", label: "Geography", type: "country" },
];

export default function SheetLPViewFM({
  data = {},
  isOpen = true,
  onClose = () => {},
}) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right">
        <SheetHeader className="mt-4 pb-0 md:mt-8">
          <SheetTitle>{data?.lp_name}</SheetTitle>
          <SheetDescription>{data?.email}</SheetDescription>
          <BadgeStatusTask type="success" text="Pending" className="mt-2" />
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
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
