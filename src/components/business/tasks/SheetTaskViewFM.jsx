import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatusLozenge from "@/components/common/includes/StatusLozenge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { renderCell } from "@/lib/renderCell"; // Import shared utility
import { cn } from "@/lib/utils";
import {
  Calendar,
  CircleUserRound,
  File,
  Timer,
  TriangleAlert,
} from "lucide-react";
import StateChangeSelector from "@/components/layout/dashboard/includes/state-change-selector";

const taskDataSchema = [
  { key: "deadline", label: "Due by", type: "date", icon: <Timer size={20} /> },
  {
    key: "recurrence",
    label: "Repeat Task",
    type: "text",
    icon: <Calendar size={20} />,
  },
  {
    key: "documents",
    label: "Attachments",
    type: "file",
    icon: <File size={20} />,
  },
  {
    key: "predecessorTask",
    label: "Predecessor Task",
    type: "link",
    icon: <TriangleAlert size={20} className="text-yellow-500" />,
  },
  { key: "category", label: "Category", type: "text" },
  { key: "assignee_name", label: "Assignee Name", type: "user" },
  { key: "reviewer_name", label: "Reviewer Name", type: "user" },
  { key: "approver_name", label: "Approver Name", type: "user" },
  {
    key: "created_at",
    label: "Created At",
    type: "date",
    icon: <Timer size={20} />,
  },
  {
    key: "updated_at",
    label: "Last Updated",
    type: "date",
    icon: <Timer size={20} />,
  },
];

export default function SheetTaskViewFM({
  data = {},
  isOpen = true,
  onClose = () => {},
  buttons = [],
}) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className={cn("w-full sm:max-w-md")}>
        <SheetHeader className="mt-4 space-y-0.5 pb-0 md:mt-8">
          {data?.category && <StatusLozenge status={data.category} />}
          <SheetTitle>{data?.description}</SheetTitle>
          <SheetDescription>{""}</SheetDescription>
          <div
            onClick={(e) => {
              const target = e.target;
              const insideStatusSelector = target.closest(
                '[data-type="status-selector"]',
              );
              const insideStatusOption = target.closest(
                '[data-role="status-option"]',
              );

              if (!insideStatusSelector || insideStatusOption) {
                onClose(false);
              }
            }}
            className="cursor-pointer"
          >
            <StateChangeSelector data={data} disabledPropagation={false} />
          </div>{" "}
          {data?.assignee_id && (
            <div className="mt-2 flex items-center gap-2">
              <CircleUserRound className="h-6 w-6 text-foreground" />
              <span className="text-sm text-foreground">{data.assignee_name}</span>
              <StatusLozenge status="assigned" />
            </div>
          )}
        </SheetHeader>
        <hr className="mx-auto w-11/12" />

        <table className="mx-auto w-11/12 text-sm">
          <tbody>
            {taskDataSchema.map(({ key, label, type, icon }) =>
              renderCell(key, label, type, icon, data),
            )}
          </tbody>
        </table>
        <SheetFooter className="mx-auto my-0 mt-4 flex w-11/12 flex-col items-center justify-center gap-2 p-0">
          {buttons.length > 0 &&
            buttons.map((button, index) => (
              <Button
                key={index}
                variant={button.variant || ""}
                size="lg"
                onClick={() => {
                  button.onClick(data);
                  onClose(false);
                }}
                className={cn(
                  "w-full",
                  button.className,
                  "flex items-center gap-1",
                )}
                disabled={button.disabled}
              >
                {button.icon && <span className="mr-1">{<button.icon />}</span>}
                {button.label}
              </Button>
            ))}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
