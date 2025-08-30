import { paymentApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchPayments = async ({
  pageIndex,
  pageSize,
  sortBy,
  filters,
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

    const response = await apiWithAuth.get(paymentApiPaths.list, {
      params: searchParams,
    });

    const payments = response.data.payments || [];
    const total_count = response.data.total_count || 0;

    return {
      data: payments,
      totalCount: total_count,
    };
  } catch (error) {
    console.error("Error fetching payments:", error);

    let message = "Failed to fetch payments";
    if (
      error.response?.data?.detail &&
      typeof error.response.data.detail === "string"
    ) {
      message = error.response.data.detail;
    }
    throw new Error(message);
  }
};

export const useGetPayments = ({
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
    queryKey: ["payments", pageIndex, pageSize, sort, filters],
    queryFn: () =>
      fetchPayments({
        pageIndex,
        pageSize,
        sortBy,
        filters,
      }),
    placeholderData: (prev) => prev,
  });
};