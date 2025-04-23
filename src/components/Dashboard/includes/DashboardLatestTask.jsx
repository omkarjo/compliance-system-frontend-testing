import BadgeStatusTask from "@/components/includes/badge-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/formatter";
import { useGetTask } from "@/query/taskQuery";
import { addMonths, format } from "date-fns";
import { CalendarDays, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardLatestTask() {
  const { data, isLoading } = useGetTask({
    page: 1,
    limit: 5,
    filters: [
      { filterid: "start_date", optionid: format(new Date(), "yyyy-MM-dd") },
      {
        filterid: "end_date",
        optionid: format(addMonths(new Date(), 1), "yyyy-MM-dd"),
      },
    ],
    sortBy: "deadline_asc",
  });

  const task = data?.data || [];

  return (
    <Card className="gap-1.5">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Upcoming Tasks</CardTitle>
        <CardDescription />
      </CardHeader>

      <CardContent>
        <div
          className="grid max-h-[400px] gap-3 overflow-y-auto"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex w-full flex-col justify-between rounded-md border p-4"
              >
                <Skeleton className="mb-2 h-4 w-2/3" />
                <div className="text-muted-foreground mb-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <Skeleton className="h-6 w-16" />
                  <div className="text-muted-foreground flex items-center gap-1">
                    <UserCircle className="h-4 w-4" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            ))
          ) : task.length === 0 ? (
            <div className="flex w-full flex-col justify-between rounded-md border p-4">
              <p className="w-full py-6 text-center text-sm text-gray-500">
                No upcoming tasks in this month.
              </p>
            </div>
          ) : (
            task.map((item) => (
              <Link
                to={`/dashboard/task/${item.compliance_task_id}`}
                key={item.compliance_task_id}
                className="flex w-full flex-col justify-between rounded-md border p-4"
              >
                {/* Title/Description */}
                <span className="mb-1 truncate text-sm font-semibold">
                  {item.description}
                </span>

                {/* Category + Deadline */}
                <div className="text-muted-foreground mb-1 flex justify-between text-xs">
                  <span className="flex items-center gap-1">
                    Category:
                    <Badge variant="outline" className="text-xs">
                      {item.category || "N/A"}
                    </Badge>
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {formatDate(item.deadline)}
                  </span>
                </div>

                {/* Status + Assignee */}
                <div className="mt-auto flex items-center justify-between text-xs">
                  <BadgeStatusTask text={item.state} />
                  {item.assignee_name && (
                    <div className="text-muted-foreground flex items-center gap-1">
                      <UserCircle className="h-4 w-4" />
                      <span>{item.assignee_name}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end pt-3">
        <Button asChild>
          <Link to="/dashboard/task">View All Tasks</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
