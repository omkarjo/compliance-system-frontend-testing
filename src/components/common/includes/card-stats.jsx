import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

const CardStats = ({ title, value = 0, color }) => {
  return (
    <Card className="card-stats">
      <CardContent className="flex flex-col items-center justify-start">
        <span className="text-muted-md">{title}</span>
        <span className={cn("text-value", color)}>{value}</span>
      </CardContent>
    </Card>
  );
};
export default CardStats;
