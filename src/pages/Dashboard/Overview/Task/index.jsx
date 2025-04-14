import { useAppSelector } from "@/store/hooks";
import { useCallback } from "react";
import TaskDashboardFundManager from "./TaskDashboardFM";
import TaskDashboardUser from "./TaskDashboardUser";

export default function TaskPage() {
  const { user } = useAppSelector((state) => state.user);
  const userRole = user.role;

  const getTaskDashboardView = useCallback((role) => {
    switch (role) {
      case "Fund Manager":
      case "Compliance Officer":
        return <TaskDashboardFundManager />;
      default:
        return <TaskDashboardUser />;
    }
  }, []);

  return <>{getTaskDashboardView(userRole)}</>;
}
