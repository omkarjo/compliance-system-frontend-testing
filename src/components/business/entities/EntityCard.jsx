"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Eye, MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function EntityCard({ data, onView, onDelete }) {
  const handleCopy = (label, value) => {
    if (!value) return;
    navigator.clipboard
      .writeText(value)
      .then(() => toast.success(`${label} copied!`))
      .catch(() => toast.error("Failed to copy"));
  };

  const handleGlobalCopy = () => {
    const text = `
${data.entity_name}
${data.entity_email}
${data.entity_telephone}
PAN: ${data.entity_pan}
${data.entity_tan ? `TAN: ${data.entity_tan}` : ""}
    `.trim();

    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Entity details copied!"))
      .catch(() => toast.error("Failed to copy entity details"));
  };

  function renderBadgeWithCopy(label, value) {
    return (
      <Badge
        variant="outline"
        className="inline-flex items-center gap-1 rounded-md text-xs font-medium"
      >
        {label && <span className="text-muted-foreground">{label}:</span>}{" "}
        {value}
        <button
          type="button"
          onClick={() => handleCopy(label || "Value", value)}
        >
          <Copy
            size={14}
            className="ml-1 cursor-pointer opacity-70 hover:opacity-100"
          />
        </button>
      </Badge>
    );
  }

  return (
    <Card className="w-full max-w-sm gap-0 rounded-xl border shadow-sm">
      <CardHeader className="flex items-start justify-between space-y-0 pb-2">
        <div className="flex flex-col">
          <Badge
            variant="outline"
            className="mb-1 rounded-md text-xs font-medium capitalize"
          >
            {data.entity_type || "Unknown"}
          </Badge>

          <CardTitle className="mt-1 text-lg font-semibold">
            {data.entity_name}
          </CardTitle>
        </div>

        <div className="flex items-center gap-2">

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground h-8 w-8 p-0"
              >
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleGlobalCopy}>
                <Copy className="mr-2 size-4" />
                Copy All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onView?.(data)}>
                <Eye className="mr-2 size-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(data)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {renderBadgeWithCopy(null, data.entity_email || "-")}
          {renderBadgeWithCopy(null, data.entity_telephone || "-")}
          {renderBadgeWithCopy("PAN", data.entity_pan || "-")}
          {data.entity_tan && renderBadgeWithCopy("TAN", data.entity_tan)}
        </div>
      </CardContent>
    </Card>
  );
}
export function EntityCardSkeleton() {
  return (
    <Card className="w-full max-w-sm gap-0 rounded-xl border shadow-sm">
      <CardHeader className="flex items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col space-y-1">
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="h-6 w-40 rounded" />
        </div>
        <Skeleton className="h-8 w-8" />
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-28 rounded-md" />
          <Skeleton className="h-6 w-32 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
