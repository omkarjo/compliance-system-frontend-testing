import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell, Label } from "recharts";

export default function TaskOverviewChart({ title, description, data, config }) {
  const totalTasks = data?.reduce((sum, task) => sum + task.value, 0) || 0;
  
  const isAllZero = data?.every(item => item.value === 0) || false;
  
  const chartConfig = config || {
    tooltip: {
      content: {
        hideLabel: true
      }
    },
    colors: {
      Overdue: "#FF4D4F",
      Completed: "#52C41A",
      Empty: "#E0E0E0"
    },
  };

  if (!data || data.length === 0) {
    return (
      <Card className="flex flex-col gap-0">
        <CardHeader className="items-center pb-0 text-center">
          <CardTitle className="text-lg">{title || "Task Overview"}</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const emptyStateData = [
    { name: "Empty", value: 1, fill: "#E0E0E0" }
  ];

  return (
    <Card className="flex flex-col gap-0">
      <CardHeader className="items-center pb-0 text-center">
        {title && <CardTitle className="text-lg">{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer 
          config={chartConfig}
          className="mx-auto aspect-square h-64"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={isAllZero ? emptyStateData : data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={isAllZero ? 0 : 5}
            >
              {(isAllZero ? emptyStateData : data).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalTasks}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {/* complaince */}
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}