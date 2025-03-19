import BadgeStatusTask from "@/components/includes/badge-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  currencyFormatter,
  getCountryDetails,
  getPhoneDetails,
} from "@/lib/formatter";
import { CircleUserRound, File, Timer, TriangleAlert } from "lucide-react";
import { useCallback } from "react";
import { Link } from "react-router-dom";

const taskDataOrder = [
  { key: "attachements", label: "Attachments" },
  { key: "lp_name", label: "Name" },
  { key: "gender", label: "Gender" },
  { key: "dob", label: "Date of Birth" },
  { key: "mobile_no", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "pan", label: "PAN Number" },
  { key: "nominee", label: "Nominee" },
  // { key : "doi", label: "Date of Agreement" },
  { key: "commitment_amount", label: "Commitment Amount" },
  { key: "acknowledgement_of_ppm", label: "Acknowledgement of PPM" },
  { key: "depository", label: "Depository" },
  { key: "dpid", label: "DPID" },
  { key: "client_id", label: "Client ID" },
  { key: "class_of_shares", label: "Class of Shares" },
  { key: "isin", label: "ISIN" },
  { key: "type", label: "Type" },
  { key: "citizenship", label: "Citizenship" },
  { key: "geography", label: "Geography" },
];

export default function SheetLPViewFM({
  data = {},
  isOpen = true,
  onClose = () => {},
}) {
  const renderCell = useCallback((key, label, data) => {
    if (!data) return null;
    const value = data[key];
    if (!value) return null;
    switch (key) {
      case "frequency":
        return (
          <tr key={key} className="">
            <td className="mb-4 flex items-center gap-2 text-gray-500">
              Repeat Task:
            </td>
            <td className="pb-4 capitalize">
              <span>
                Every {data.every} {data.frequency}
                {data.every > 1 ? "s" : ""}
              </span>
            </td>
          </tr>
        );
      case "attachements":
        return (
          <tr key={key} className="">
            <td className="mb-4 flex items-center gap-2 text-gray-500">
              Attachements:
            </td>
            <td className="pb-4">
              {value?.map((file, index) => (
                <Link
                  key={index}
                  to={file.link}
                  className="my-1 flex items-center gap-2"
                >
                  <File size={20} className="text-gray-500" />
                  <span className="text-blue-600/60 hover:underline">
                    {file.name}
                  </span>{" "}
                </Link>
              ))}
            </td>
          </tr>
        );
      case "commitment_amount":
        return (
          <tr key={key} className="">
            <td className="mb-4 flex items-center gap-2 text-gray-500">
              {label}:
            </td>
            <td className="pb-4">{currencyFormatter(value)}</td>
          </tr>
        );
      case "mobile_no": {
        const { formatted, flag } = getPhoneDetails(value);
        return (
          <tr key={key} className="">
            <td className="mb-4 flex items-center gap-2 text-gray-500">
              {label}:
            </td>
            <td className="pb-4">
              <span className="flex items-center gap-2">
                {flag}
                <span className="ms-2">{formatted}</span>
              </span>
            </td>
          </tr>
        );
      }
      case "geography": {
        const { name, flag } = getCountryDetails(value);
        return (
          <tr key={key} className="">
            <td className="mb-4 flex items-center gap-2 text-gray-500">
              {label}:
            </td>
            <td className="pb-4">
              <span className="flex items-center gap-2">
                {flag}
                <span className="ms-2">{name}</span>
              </span>
            </td>
          </tr>
        );
      }
      case "address":
        return (
          <tr key={key} className="">
            <td className="mb-4 flex items-center gap-2 text-gray-500">
              {label}:
            </td>
            <td className="pb-4">
              <span className="break-words">
                {value
                  .split(/(.{20})/)
                  .filter(Boolean)
                  .join("\n")}
              </span>
            </td>
          </tr>
        );
      case "acknowledgement_of_ppm":
        return (
          <tr key={key} className="">
            <td className="mb-4 flex items-center gap-2 text-gray-500">
              {label}:
            </td>
            <td className="pb-4">{value ? "Yes" : "No"}</td>
          </tr>
        );
      default:
        return (
          <tr key={key} className="">
            <td className="mb-4 flex items-center gap-2 text-gray-500">
              {label}:
            </td>
            <td className="max-w-1/2 pb-4 capitalize">{value}</td>
          </tr>
        );
    }
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right">
        <SheetHeader className={"mt-4 pb-0 md:mt-8"}>
          <SheetTitle>{data?.lp_name}</SheetTitle>
          <SheetDescription>{data?.email}</SheetDescription>
          <BadgeStatusTask type="sucess" text="Pending" className={"mt-2"} />
        </SheetHeader>
        <hr className="mx-auto w-11/12" />
        <ScrollArea className="overflow-y-auto pb-4">
          <table className="mx-auto w-11/12 text-sm">
            <tbody className="">
              {taskDataOrder.map(({ key, label }) =>
                renderCell(key, label, data),
              )}
            </tbody>
          </table>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
