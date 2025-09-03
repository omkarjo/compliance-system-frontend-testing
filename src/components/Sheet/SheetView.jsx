import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import React from "react";

/**
 * Renders a value based on its type for the generic sheet.
 * @param {any} value
 * @param {string} type
 * @returns {React.ReactNode}
 */
function renderValue(value, type) {
  if (value === undefined || value === null || value === "")
    return <span>-</span>;

  switch (type) {
    case "textarea":
      return (
        <div className="text-muted-foreground whitespace-pre-line">{value}</div>
      );
    case "amount":
      // Replace with your currencyFormatter if needed
      return <span className="font-bold">{`₹${value}`}</span>;
    case "user":
      if (typeof value === "object" && value !== null)
        return (
          <div>
            <div className="font-semibold">{value.name || "-"}</div>
            <div className="text-muted-foreground text-xs">
              {value.email || "-"}
            </div>
          </div>
        );
      return <span>{value}</span>;
    case "files":
      if (Array.isArray(value) && value.length > 0)
        return (
          <ul className="list-disc pl-4">
            {value.map((file, i) => (
              <li key={i}>
                {file.url ? (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    {file.name || file.url}
                  </a>
                ) : (
                  file.name || "-"
                )}
              </li>
            ))}
          </ul>
        );
      return <span>-</span>;
    case "bool":
      return (
        <Badge variant={value ? "default" : "outline"}>
          {value ? "Yes" : "No"}
        </Badge>
      );
    case "phone_no":
      return value ? (
        <a href={`tel:${value}`} className="text-primary underline">
          {value}
        </a>
      ) : (
        <span>-</span>
      );
    case "text":
    default:
      return <span>{value}</span>;
  }
}

/**
 * GenericSheetView Component
 * @param {object} props
 * @param {Array} props.schema - [{ label, key, type }]
 * @param {object} props.data - Data object
 * @param {string} props.title - Title
 * @param {string|React.ReactNode} props.description - Description or key to description in data
 * @param {string} props.statusKey - Key for status badge (optional, only used if statusComponent not provided)
 * @param {string} props.statusVariant - Badge variant when using statusKey
 * @param {React.ReactNode} props.statusComponent - Custom React node for status display
 * @param {boolean} props.isOpen - Sheet open state
 * @param {function} props.onClose - Sheet close handler
 * @param {Array} props.buttons - Array of button components
 * @param {React.ReactNode} props.children - Any children to render after the table
 */
export default function SheetView({
  schema = [],
  data = {},
  title = "Details",
  description = "",
  statusKey,
  statusVariant = "outline",
  statusComponent,
  isOpen = true,
  onClose = () => {},
  buttons = [],
  children,
}) {
  if (!data) return null;

  // Allow description to be a key or a node/string
  const desc =
    typeof description === "string" && data[description] !== undefined
      ? data[description]
      : description;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className={cn("w-full sm:max-w-md")}>
        <SheetHeader className="mt-4 pb-0 md:mt-8">
          <SheetTitle>{title}</SheetTitle>
          {desc && <SheetDescription>{desc}</SheetDescription>}
          {statusComponent
            ? statusComponent
            : statusKey &&
              data?.[statusKey] && (
                <Badge variant={statusVariant} className="w-fit text-xs">
                  {data[statusKey]}
                </Badge>
              )}
        </SheetHeader>
        <hr className="mx-auto w-11/12" />
        <ScrollArea className="overflow-y-auto pb-4">
          <table className="mx-auto w-11/12 text-sm">
            <tbody>
              {schema
                .filter(
                  ({ key }) =>
                    data[key] !== null &&
                    data[key] !== undefined &&
                    data[key] !== "",
                )
                .map(({ key, label, type }) => (
                  <tr key={key}>
                    <td className="text-muted-foreground py-2 pr-4 font-medium whitespace-nowrap">
                      {label}
                    </td>
                    <td className="py-2">{renderValue(data[key], type)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {Array.isArray(buttons) && buttons.length > 0 && (
            <div className="mt-3 flex gap-2 px-4">
              {buttons.map((btn, idx) => (
                <React.Fragment key={idx}>{btn}</React.Fragment>
              ))}
            </div>
          )}
          {children}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
