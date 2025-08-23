import { unitAllotmentApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchUnitAllotments = async ({
  fundId,
  pageIndex,
  pageSize,
  sortBy,
  filters,
}) => {
  if (!fundId) throw new Error("Fund ID is required");

  try {
    const firstSort = sortBy?.[0];
    const sort =
      firstSort?.id && firstSort?.desc !== undefined
        ? `${firstSort.id}_${firstSort.desc ? "desc" : "asc"}`
        : "";

    const searchParams = {
      fund_id: fundId,
      limit: pageSize,
      skip: pageIndex * pageSize,
      sort,
      ...filters.reduce((acc, filter) => {
        acc[filter.filterid] = filter.optionid;
        return acc;
      }, {}),
    };

    const response = await apiWithAuth.get(unitAllotmentApiPaths.get, {
      params: searchParams,
    });

    const { unit_allotments, total_count } = response.data;
    return {
      data: unit_allotments || [],
      totalCount: total_count || 0,
    };
  } catch (error) {
    console.error("Error fetching unit allotments:", error);

    let message = "Failed to fetch unit allotments";
    if (
      error.response?.data?.detail &&
      typeof error.response.data.detail === "string"
    ) {
      message = error.response.data.detail;
    }
    throw new Error(message);
  }
};

export const useGetUnitAllotments = ({
  fundId,
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
    queryKey: ["unit-allotments", fundId, pageIndex, pageSize, sort, filters],
    queryFn: () =>
      fetchUnitAllotments({
        fundId,
        pageIndex,
        pageSize,
        sortBy,
        filters,
      }),
    enabled: !!fundId,
    placeholderData: (prev) => prev,
  });
};
