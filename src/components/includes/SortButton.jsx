import { cn } from "@/lib/utils";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";

export default function SortButton({ column, children, className }) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "text-muted-foreground flex items-center justify-between text-sm font-medium",
        className,
      )}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      <span className="flex items-center gap-2">{children}</span>
      {column.getIsSorted() === "asc" ? (
        <ChevronUp size={16} />
      ) : column.getIsSorted() === "desc" ? (
        <ChevronDown size={16} />
      ) : (
        <ChevronsUpDown size={16} />
      )}
    </Button>
  );
}
