import { apiWithAuth } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const useGetOverviewStats = () => {
  return useQuery({
    queryKey: ["stats-overview-query"],
    queryFn: () => apiWithAuth.get("/api/reports/tasks-stats"),
  });
};
