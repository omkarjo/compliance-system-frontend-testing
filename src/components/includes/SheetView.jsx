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
import { cn } from "@/lib/utils";
import React from "react";

export default function SheetView({
  schema = [],
  data = {},
  title = "Details",
  description = "",
  statusKey = "status",
  statusVariant = "outline",
  isOpen = true,
  onClose = () => {},
  buttons = [],
}) {
  if (data == null) return null;

  const desc =
    typeof description === "string" && data[description] !== undefined
      ? data[description]
      : description;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className={cn("w-full sm:max-w-md")}>
        <SheetHeader className="mt-4 pb-0 md:mt-8">
          <SheetTitle>{title}</SheetTitle>
          {desc && (
            <SheetDescription>
              {desc}
            </SheetDescription>
          )}
          {statusKey && data?.[statusKey] && (
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
                .map(({ key, label, type }) =>
                  renderCell(key, label, type, null, data),
                )}
            </tbody>
          </table>
          {Array.isArray(buttons) && buttons.length > 0 && (
            <div className="mt-3 px-4 flex gap-2">
              {buttons.map((btn, idx) => (
                <React.Fragment key={idx}>{btn}</React.Fragment>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}