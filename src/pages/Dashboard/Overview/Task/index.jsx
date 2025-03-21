import { useAppSelector } from "@/store/hooks";
import { useCallback } from "react";
import { Navigate } from "react-router-dom";
import TaskDashboardFundManager from "./TaskDashboardFM";
import TaskDashboardLimitedPartner from "./TaskDashboarLP";

export default function TaskPage() {
  const { user } = useAppSelector((state) => state.user);
  const userRole = user.role;

  const getTaskDashboardView = useCallback((role) => {
    switch (role) {
      case "Fund Manager":
        return <TaskDashboardFundManager />;
      default:
        return <TaskDashboardLimitedPartner />;
    }
  }, []);

  return <>{getTaskDashboardView(userRole)}</>;
}
