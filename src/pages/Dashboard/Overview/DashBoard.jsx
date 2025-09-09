import DashboardLatestTask from "@/components/layout/dashboard/includes/DashboardLatestTask";
import CardStats from "@/components/common/includes/card-stats.jsx";
import TaskOverviewChart from "@/components/common/includes/task-overview-chart.jsx";
import { useGetOverviewStats } from "@/react-query/query/overview/useOverviewQuery";

const overviewStatsValues = [
  { title: "Total", color: "text-foreground", key: "total_tasks" },
  { title: "Completed", color: "text-green-600 dark:text-green-400", key: "completed_tasks" },
  { title: "Overdue", color: "text-red-600 dark:text-red-400", key: "overdue_tasks" },
  { title: "Open", color: "text-yellow-600 dark:text-yellow-400", key: "open_tasks" },
  { title: "Pending", color: "text-slate-600 dark:text-slate-400", key: "pending_tasks" },
  { title: "Required Review", color: "text-orange-600 dark:text-orange-400", key: "review_required_tasks"},
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
        <div className="mt-4 flex flex-wrap gap-4">
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
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="">
            <TaskOverviewChart
              title="Compliance"
              description="Task completion status"
              data={taskData}
              total={overviewStats.total_tasks}
            />
          </div>
          <div className="flex-1">
          <DashboardLatestTask />
          </div>
        </div>
      </main>
    </section>
  );
}
