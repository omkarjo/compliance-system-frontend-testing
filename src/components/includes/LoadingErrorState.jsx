import { AlertCircle, Hourglass, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoadingState({ text = "Loading...", className = "" }) {
  return (
    <div
      className={cn(
        "text-muted-foreground flex flex-col items-center justify-center py-12",
        className
      )}
      data-state="loading"
    >
      <Hourglass className="h-12 w-12 animate-hourglass-rotate-delay text-gray-500" />
      <span className="mt-4 text-base font-medium text-gray-600">{text}</span>
    </div>
  );
}

export function EmptyState({ text = "No data found.", type = "empty" }) {
  const Icon = type === "error" ? AlertCircle : Inbox;
  const iconColor = false ? "text-red-500" : "text-gray-400";
  const textColor = false ? "text-red-400" : "text-gray-600";

  return (
    <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
      <Icon className={cn("mb-4 h-12 w-12", iconColor)} />
      <h2 className={cn("text-lg font-semibold", textColor)}>{text}</h2>
    </div>
  );
}
