import { Card, CardContent } from "@/components/ui/card";
import { Folder } from "lucide-react";

export default function FolderCard({ name, count, onClick }) {
  return (
    <Card
      className="w-[235px] h-[100px] flex flex-col justify-center px-4 py-3 shadow-sm hover:shadow transition cursor-pointer border"
      onClick={onClick}
    >
      <CardContent className="p-0 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Folder className="w-6 h-6 text-gray-400" />
          <span className="font-medium text-base truncate">{name}</span>
        </div>
        <span className="text-xs text-muted-foreground mt-1">{count} document{count === 1 ? "" : "s"}</span>
      </CardContent>
    </Card>
  );
}