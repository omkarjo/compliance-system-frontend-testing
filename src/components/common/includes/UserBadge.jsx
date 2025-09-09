import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";

export default function UserBadge({ name = "", email = "", avatar ="", className = "" }) {
  return (
    <div className={cn("flex flex-col items-start justify-center", className)}>
      <span className="text-sm font-medium text-foreground">{name}</span>
      {email && (
        <div className="flex items-center gap-1">
          <Mail className="h-3 w-3 text-foreground" />
          <span className="text-xs text-foreground">{email}</span>
        </div>
      )}
    </div>
  );
}
