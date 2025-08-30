import { apiWithAuth } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchDrawdowns = async ({
  pageIndex,
  pageSize,
  sortBy,
  filters,
  groupByQuarter = false,
}) => {
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

    let drawdowns = response.data.drawdowns || [];
    const total_count = response.data.total_count || 0;

    if (groupByQuarter) {
      const grouped = {};
      for (const d of drawdowns) {
        const q = d.drawdown_quarter;
        if (!grouped[q]) {
          grouped[q] = {
            drawdown_quarter: q,
            notice_date: d.notice_date,
            status: d.status,
            invi_filling: d.invi_filling,
            drawdown_amount: 0,
            remaining_commitment: 0,
            drawdown_count: 0,
          };
        }
        grouped[q].drawdown_amount += parseFloat(d.drawdown_amount || 0);
        grouped[q].remaining_commitment += parseFloat(
          d.remaining_commitment || 0,
        );
        grouped[q].drawdown_count += 1;
      }
      drawdowns = Object.values(grouped);
      return {
        data: drawdowns,
        totalCount: drawdowns.length,
      };
    }

    return {
      data: drawdowns,
      totalCount: total_count,
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
  groupByQuarter = false,
}) => {
  const firstSort = sortBy.at(0);
  const sort =
    firstSort?.id && firstSort?.desc !== undefined
      ? `${firstSort.id}_${firstSort.desc ? "desc" : "asc"}`
      : "";

  return useQuery({
    queryKey: ["drawdowns", pageIndex, pageSize, sort, filters, groupByQuarter],
    queryFn: () =>
      fetchDrawdowns({
        pageIndex,
        pageSize,
        sortBy,
        filters,
        groupByQuarter,
      }),
    placeholderData: (prev) => prev,
  });
};
