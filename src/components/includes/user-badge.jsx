import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail } from "lucide-react";

export default function UserBadge({ name, email, avatar }) {
  const fallbackAvtarText = name
    .split(" ", 2)
    .map((name) => name[0])
    .join("");

  return (
    <div className="flex items-start justify-center gap-2">
      <Avatar>
        <AvatarImage src={avatar} />
        <AvatarFallback>{fallbackAvtarText}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
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
