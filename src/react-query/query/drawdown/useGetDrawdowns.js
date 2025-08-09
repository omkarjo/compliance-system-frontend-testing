import { apiWithAuth } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchDrawdowns = async ({ pageIndex, pageSize, sortBy, filters }) => {
  try {
    const firstSort = sortBy?.[0];
    const sort =
      firstSort?.id && firstSort?.desc !== undefined
        ? `${firstSort.id}_${firstSort.desc ? "desc" : "asc"}`
        : "";

    const searchParams = {
      limit: pageSize,
      skip: pageIndex * pageSize,
      sort,
      ...filters.reduce((acc, filter) => {
        acc[filter.filterid] = filter.optionid;
        return acc;
      }, {}),
    };

    const response = await apiWithAuth.get("/api/drawdowns/", {
      params: searchParams,
    });

    const { drawdowns, total_count } = response.data;
    return {
      data: drawdowns || [],
      totalCount: total_count || 0,
    };
  } catch (error) {
    console.error("Error fetching drawdowns:", error);

    let message = "Failed to fetch drawdowns";
    if (
      error.response?.data?.detail &&
      typeof error.response.data.detail === "string"
    ) {
      message = error.response.data.detail;
    }
    throw new Error(message);
  }
};

export const useGetDrawdowns = ({
  pageIndex,
  pageSize,
  sortBy = [],
  filters = [],
}) => {
  const firstSort = sortBy.at(0);
  const sort =
    firstSort?.id && firstSort?.desc !== undefined
      ? `${firstSort.id}_${firstSort.desc ? "desc" : "asc"}`
      : "";

  return useQuery({
    queryKey: ["drawdowns", pageIndex, pageSize, sort, filters],
    queryFn: () =>
      fetchDrawdowns({
        pageIndex,
        pageSize,
        sortBy,
        filters,
      }),
    placeholderData: (prev) => prev,
  });
};