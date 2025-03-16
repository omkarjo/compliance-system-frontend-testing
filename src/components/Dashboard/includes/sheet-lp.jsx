import BadgeStatusTask from "@/components/includes/badge-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  { key: "status", label: "Status" },
  { key: "address", label: "Address" },
  { key: "geography", label: "Geography" },
  { key: "citizenship", label: "Citizenship" },
  { key: "type", label: "Type" },
  { key: "class_of_shares", label: "Class of Shares" },
  { key: "commitment_amount", label: "Commitment Amount" },
  { key: "nominee", label: "Nominee" },
];

export const LPData = {
  name: "Warren Buffet",
  email: "test@test.com",
  status: "Waiting for KYC",
  gender: "male",
  dob: "2025-02-28",
  phone: "1234567890",
  address: "123, xyz street, abc city, 123456",
  panNumber: "ABCDE1234F",
  attachements: [
    {
      name: "example1.pdf",
      size: "2MB",
      type: "application/pdf",
      link: "#",
    },
    {
      name: "example1.pdf",
      size: "2MB",
      type: "application/pdf",
      link: "#",
    },
    {
      name: "example2.pdf",
      size: "2MB",
      type: "application/pdf",
      link: "#",
    },
  ],
};

export default function SheetLP({
  data = LPData,
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
      default:
        return (
          <tr key={key} className="">
            <td className="mb-4 flex items-center gap-2 text-gray-500">
              {label}:
            </td>
            <td className="max-w-1/2 pb-4">{value}</td>
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

        <table className="mx-auto w-11/12 text-sm">
          <tbody className="">
            {taskDataOrder.map(({ key, label }) =>
              renderCell(key, label, data),
            )}
          </tbody>
        </table>
      </SheetContent>
    </Sheet>
  );
}
