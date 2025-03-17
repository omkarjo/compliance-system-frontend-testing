import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

const TaskCard = ({ title, value, color }) => {
  return (
    <Card className="aspect-video min-w-fit rounded-md shadow-sm">
      <CardContent className="flex flex-col items-center justify-center px-4 md:px-6">
        <span className="text-sm text-gray-500">{title}</span>
        <span className={cn("text-3xl font-semibold", color)}>{value}</span>
      </CardContent>
    </Card>
  );
};
export default TaskCard;
