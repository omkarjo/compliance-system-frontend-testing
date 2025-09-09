import { FormGenerate } from "@/components/Form";
import StatusLozenge from "@/components/common/includes/StatusLozenge";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { lpTaskFields } from "@/schemas/feilds/lpTaskSchema";
import { lpTaskSchema } from "@/schemas/zod/lpTaskSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    DownloadIcon,
    File,
    Timer
} from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
const taskDataOrder = ["deadline", "attachments"];

const SHEET_DESCRIPTION =
  "We need you to upload the following documents for KYC";
const LIST = ["Passport", "TAX IDs", "Proof of Address"];


// Unoptimized code

export default function SheetTaskViewLP({
  data = {},
  isOpen = true,
  onClose,
  openEdit = () => {},
}) {
  const renderCell = useCallback((key, data) => {
    if (!data) return null;
    const value = data[key];
    if (!value) return null;
    switch (key) {
      case "deadline":
        return (
          <tr key={key} className="">
            <td className="mb-4 flex items-center gap-2 text-muted-foreground">
              <Timer size={20} />
              Due by:
            </td>
            <td className="pb-4">
              {new Date(value).toLocaleDateString("EN-IN")}
            </td>
          </tr>
        );

      case "attachments":
        return (
          <tr key={key} className="">
            <td className="mb-4 flex items-center gap-2 text-muted-foreground">
              attachments:
            </td>
            <td className="pb-4">
              {value?.map((file, index) => (
                <Link
                  key={index}
                  to={file.link}
                  className="my-1 flex items-center gap-2"
                >
                  <File size={20} className="text-muted-foreground" />
                  <span className="text-primary hover:underline">
                    {file.name}
                  </span>{" "}
                </Link>
              ))}
            </td>
          </tr>
        );

      default:
        return null;
    }
  }, []);

  const form = useForm({
    resolver: zodResolver(lpTaskSchema),
    defaultValues: {},
  });

  const onSubmit = useCallback(async (data) => {
    // console.log("rest", data);
    toast.success("Task created successfully");
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className={cn("w-full md:w-1/2")}>
        <SheetHeader className={"mt-4 pb-0 md:mt-8"}>
          <div className="max-w-lg rounded-lg border border-orange-200 bg-orange-100 p-4">
            <h2 className="mb-1 text-lg font-semibold">Reviewer Comments</h2>
            <p className="text-foreground">
              Please upload adhaar card front and back details as well
            </p>
          </div>
          <SheetTitle
          className={cn("text-lg font-semibold")}
          >{data?.description || "No Title"}</SheetTitle>
          <SheetDescription>{SHEET_DESCRIPTION}</SheetDescription>
          <div className="ms-2 text-sm text-muted-foreground">
            <ul className="list-disc pl-4">
              {LIST.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <StatusLozenge status={data?.state} className={"mt-2"} />
        </SheetHeader>

        <table className="mx-auto w-11/12 text-sm">
          <tbody className="">
            {taskDataOrder.map((key) => renderCell(key, data))}
          </tbody>
        </table>
        <div className="mx-auto mt-2 w-11/12">
          <FormGenerate
            className=""
            form={form}
            onSubmit={onSubmit}
            formFields={lpTaskFields}
            submitText="Submit"
          ></FormGenerate>
        </div>
        <div className="mx-auto mt-2 w-11/12">
          <hr className="mb-2 border-border" />
          <h3 className="text-base font-semibold text-foreground">
            Closing Comments
          </h3>
          <p className="text-sm text-foreground">We have successfully finished your KYC.</p>
          <Button className="mt-4 w-full" variant="secondary">
            Download KYC document <DownloadIcon size={16} className="ms-2" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
