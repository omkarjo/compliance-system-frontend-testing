import { apiWithAuth } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchData = async ({ pageIndex, pageSize, sortBy, filters }) => {
  try {
    const searchParams = {
      limit: pageSize,
      skip: pageIndex * pageSize,
      ...(sortBy && { sort: sortBy }),
      ...filters.reduce((acc, filter) => {
        acc[filter.filterid] = filter.optionid;
        return acc;
      }, {}),
    };

    const response = await apiWithAuth.get("/api/tasks", {
      params: searchParams,
    });
    const { tasks, total } = response.data;
    return { data: tasks || [], totalCount: total };
  } catch (error) {
    console.error("Error fetching data:", error);

    let message = "Failed to fetch activity logs";
    if (
      error.response?.data?.detail &&
      typeof error.response.data.detail === "string"
    ) {
      message = error.response.data.detail;
    }

    throw new Error(message);
  }
};

export const useGetTask = ({
  pageIndex = 0,
  pageSize = 10,
  sortBy = [],
  filters = [],
}) => {
  const first_sort = sortBy.at(0);
  const sort = first_sort
    ? `${first_sort.id}_${first_sort.desc ? "desc" : "asc"}`
    : "";

  return useQuery({
    queryKey: ["task-query", pageIndex, pageSize, sort, filters],
    queryFn: () => fetchData({ pageIndex, pageSize, sortBy: sort, filters }),
    placeholderData: (keepPreviousData) => keepPreviousData,
  });
};
