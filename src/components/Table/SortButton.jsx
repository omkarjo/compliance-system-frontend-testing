import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function SortButton({ column, children, className }) {
  const sortState = column.getIsSorted();
  
  return (
    <div 
      className={cn(
        "flex items-center cursor-pointer select-none py-3 px-3 -mx-3",
        className,
      )}
      onClick={() => column.toggleSorting(sortState === "asc")}
    >
      <span className="text-muted-foreground text-sm font-medium">
        {children}
      </span>
      
      <div className="relative ml-1 flex flex-col items-center p-1 group">
        <ChevronUp 
          size={12} 
          className={cn(
            "transition-colors -mb-1",
            sortState === "asc" 
              ? "text-foreground" 
              : "text-muted-foreground/40 group-hover:text-foreground/80"
          )}
        />
        <ChevronDown 
          size={12} 
          className={cn(
            "transition-colors",
            sortState === "desc" 
              ? "text-foreground" 
              : "text-muted-foreground/40 group-hover:text-foreground/80"
          )}
        />
      </div>
    </div>
  );
}
