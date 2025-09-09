import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";

export default function UserBadge({ name = "", email = "", avatar ="", className = "" }) {
  const fallbackAvtarText = name
    .split(" ", 2)
    .map((name) => name[0])
    .join("");

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Avatar>
        <AvatarImage src={avatar} />
        <AvatarFallback>{fallbackAvtarText}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start justify-center">
        <span className="font-medium">{name}</span>
        {email && (
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <Mail className="h-3 w-3" />
            <span>{email}</span>
          </div>
        )}
      </div>
    </div>
  );
}
