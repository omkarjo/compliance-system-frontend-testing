import { useQuery } from "@tanstack/react-query";
import { apiWithAuth } from "@/utils/api";
import { fundApiPaths } from "@/constant/apiPaths";

let allFundsCache = null;
const forceRefreshCache = false;

const getAllFunds = async () => {
  if (
    forceRefreshCache ||
    !allFundsCache ||
    allFundsCache.length === 0
  ) {
    const response = await apiWithAuth.get(fundApiPaths.getFunds, {
      params: {
        limit: 1000,
      },
    });

    allFundsCache = response.data || [];
  }

  return {
    data: allFundsCache,
    totalCount: allFundsCache.length,
  };
};

const fetchFundsData = async ({
  pageIndex = 0,
  pageSize = 10,
  sortBy,
  search,
}) => {
  await getAllFunds(); 

  let filtered = [...allFundsCache];

  if (search && search.length > 2) {
    filtered = filtered.filter((item) =>
      item.scheme_name?.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (sortBy?.[0]) {
    const { id, desc } = sortBy[0];
    filtered.sort((a, b) => {
      const aVal = a[id];
      const bVal = b[id];

      if (aVal == null || bVal == null) return 0;

      if (!isNaN(parseFloat(aVal)) && !isNaN(parseFloat(bVal))) {
        return desc
          ? parseFloat(bVal) - parseFloat(aVal)
          : parseFloat(aVal) - parseFloat(bVal);
      }

      return desc
        ? String(bVal).localeCompare(String(aVal))
        : String(aVal).localeCompare(String(bVal));
    });
  }

  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const paginatedData = filtered.slice(start, end);

  return {
    data: paginatedData,
    totalCount: filtered.length,
  };
};

export const useGetFunds = ({ pageIndex, pageSize, sortBy, search }) => {
  return useQuery({
    queryKey: ["funds-query", pageIndex, pageSize, sortBy, search],
    queryFn: () =>
      fetchFundsData({ pageIndex, pageSize, sortBy, search }),
    placeholderData: (prev) => prev,
    onError: (error) => {
      console.error("Funds fetch error:", error.message);
    },
  });
};
