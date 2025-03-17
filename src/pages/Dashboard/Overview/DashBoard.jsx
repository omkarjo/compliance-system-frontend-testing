import CardStats from "@/components/includes/card-stats";
import TaskOverviewChart from "@/components/includes/task-overview-chart";
import { useGetOverviewStats } from "@/query/useOverviewQuerry";

const overviewStatsValues = [
  { title: "Total", color: "text-black", key: "total_tasks" },
  { title: "Overdue", color: "text-red-500", key: "overdue_tasks" },
  { title: "Completed", color: "text-green-500", key: "completed_tasks" },
];

// Chart configuration object
const chartConfig = {
  tooltip: {
    content: {
      hideLabel: true
    }
  },
  colors: {
    Overdue: "#FF4D4F",
    Completed: "#52C41A",
  },
};

export default function DashBoard() {
  const { data, isLoading } = useGetOverviewStats();
  const overviewStats = data?.data || {
    total_tasks: 50,
    overdue_tasks: 20,
    completed_tasks: 30,
  }
  
  // Create taskData from API response if available, otherwise use fallback
  const taskData = overviewStats ? [
    { name: "Overdue", value: overviewStats.overdue_tasks || 0, fill: "#FF4D4F" },
    { name: "Completed", value: overviewStats.completed_tasks || 0, fill: "#52C41A" },
  ] : [
    { name: "Overdue", value: 20, fill: "#FF4D4F" },
    { name: "Completed", value: 70, fill: "#52C41A" },
  ];

  return (
    <section>
      <main className="mx-4 flex-1 p-2">
        <span className="text-2xl font-semibold">Task Overview</span>
        <div className="mt-4 flex gap-4">
          {overviewStatsValues.map((value, index) => (
            <CardStats
              key={index}
              title={value.title}
              value={isLoading ? "..." : overviewStats ? overviewStats[value.key] : "..."}
              color={value.color}
            />
          ))}
        </div>
        <div className="mt-4 flex gap-4">
          <TaskOverviewChart 
            title="Compliance"
            description="Task completion status" 
            data={taskData}
            config={chartConfig}
          />
        </div>
      </main>
    </section>
  );
}