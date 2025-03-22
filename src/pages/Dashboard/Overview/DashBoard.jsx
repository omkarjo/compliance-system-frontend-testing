import CardStats from "@/components/includes/card-stats";
import TaskOverviewChart from "@/components/includes/task-overview-chart";
import { useGetOverviewStats } from "@/query/useOverviewQuery";

const overviewStatsValues = [
  { title: "Total", color: "text-black", key: "total_tasks" },
  { title: "Completed", color: "text-green-500", key: "completed_tasks" },
  { title: "Overdue", color: "text-red-500", key: "overdue_tasks" },
  { title: "Open", color: "text-yellow-500", key: "open_tasks" },
  { title: "Pending", color: "text-blue-500", key: "pending_tasks" },
  {
    title: "Required Review",
    color: "text-orange-500",
    key: "review_required_tasks",
  },
];

export default function DashBoard() {
  const { data, isLoading } = useGetOverviewStats();
  const overviewStats = data?.data || {};

  const taskData = overviewStats
    ? [
        {
          name: "Completed",
          value: overviewStats.completed_tasks || 0,
          fill: "#10B981",
        },
        {
          name: "Overdue",
          value: overviewStats.overdue_tasks || 0,
          fill: "#EF4444",
        },
        {
          name: "Open",
          value: overviewStats.open_tasks || 0,
          fill: "#FBBF24",
        },
        {
          name: "Pending",
          value: overviewStats.pending_tasks || 0,
          fill: "#3B82F6",
        },
        {
          name: "Required Review",
          value: overviewStats.review_required_tasks || 0,
          fill: "#F97316",
        },
      ]
    : [];

  return (
    <section>
      <main className="mx-4 flex-1 p-2">
        <span className="text-2xl font-semibold">Task Overview</span>
        <div className="mt-4 flex gap-4 flex-wrap">
          {overviewStatsValues.map((value, index) => (
            <CardStats
              key={index}
              title={value.title}
              value={
                isLoading
                  ? "..."
                  : overviewStats
                    ? overviewStats[value.key]
                    : "..."
              }
              color={value.color}
            />
          ))}
        </div>
        <div className="mt-4 flex gap-4">
          <TaskOverviewChart
            title="Compliance"
            description="Task completion status"
            data={taskData}
            total={overviewStats.total_tasks}
          />
        </div>
      </main>
    </section>
  );
}
