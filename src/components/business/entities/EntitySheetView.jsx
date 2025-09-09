import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const entitySchema = [
  { key: "entity_type", label: "Entity Type" },
  { key: "entity_name", label: "Entity Name" },
  { key: "entity_pan", label: "PAN" },
  { key: "entity_address", label: "Address" },
  { key: "entity_telephone", label: "Phone" },
  { key: "entity_email", label: "Email" },
  { key: "entity_poc", label: "POC Name" },
  {
    key: "entity_registration_number",
    label: "Registration Number",
  },
  { key: "entity_tan", label: "TAN" },
  {
    key: "entity_date_of_incorporation",
    label: "Incorporation Date",
  },
  { key: "entity_gst_number", label: "GST Number" },
  { key: "entity_poc_din", label: "POC DIN" },
  { key: "entity_poc_pan", label: "POC PAN" },
];

export default function EntitySheetView({
  data = {},
  isOpen = true,
  onClose = () => {},
  buttons = [],
}) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className={cn("w-full sm:max-w-md")}>
        <SheetHeader className="mt-4 space-y-1 pb-0 md:mt-8">
          {data?.entity_type && (
            <Badge variant="outline">{data.entity_type}</Badge>
          )}
          <SheetTitle>{data?.entity_name}</SheetTitle>
          <SheetDescription>{data?.entity_pan}</SheetDescription>
        </SheetHeader>

        <hr className="mx-auto my-2 w-11/12" />

        <table className="mx-auto w-11/12 text-sm">
          <tbody>
            {entitySchema.map(({ key, label, icon }) =>
              data?.[key] ? (
                <tr key={key} className="py-2 text-left">
                  <td className="text-muted-foreground py-2 pr-4 align-top">
                    <div className="flex items-center gap-2 font-medium">
                      {icon} {label}
                    </div>
                  </td>
                  <td className="text-foreground py-2 align-top">
                    {String(data[key])}
                  </td>
                </tr>
              ) : null,
            )}
          </tbody>
        </table>

        <SheetFooter className="mx-auto mt-4 flex w-11/12 flex-col items-center justify-center gap-2 p-0">
          {buttons.length > 0 &&
            buttons.map((button, index) => (
              <button
                key={index}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium",
                  button.className,
                )}
                onClick={() => {
                  button.onClick(data);
                  onClose(false);
                }}
                disabled={button.disabled}
              >
                {button.icon && <span>{<button.icon />}</span>}
                {button.label}
              </button>
            ))}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
