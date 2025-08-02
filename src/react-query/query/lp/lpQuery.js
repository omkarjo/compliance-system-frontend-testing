import { limitedPartnersApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

let allLPsCache = null;
const forceRefreshCache = true;

const getAllLimitedPartners = async ({ pageIndex, pageSize }) => {
  try {
    if (forceRefreshCache || !allLPsCache || allLPsCache.length === 0) {
      const response = await apiWithAuth.get(
        limitedPartnersApiPaths.getLimitedPartners,
        {
          params: { limit: 1000 },
        },
      );
      allLPsCache = response.data?.data || [];
    }

    const start = pageIndex * pageSize;
    const end = start + pageSize;
    const paginatedData = allLPsCache.slice(start, end);

    return {
      data: paginatedData,
      totalCount: allLPsCache.length,
    };
  } catch (error) {
    console.error("Error fetching limited partners:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch limited partners.",
    );
  }
};

const fetchData = async ({ pageIndex, pageSize, sortBy, search }) => {
  const skip = pageIndex * pageSize;
  const limit = pageSize;

  const first_sort = sortBy?.[0];
  const sort = first_sort
    ? `${first_sort.id}_${first_sort.desc ? "desc" : "asc"}`
    : "";

  try {
    if (search) {
      const params = {
        skip,
        limit,
        sort,
        name: search,
      };
      const response = await apiWithAuth.get(
        limitedPartnersApiPaths.searchLimitedPartners,
        { params },
      );
      const searchResults = response.data;

      return {
        data: Array.isArray(searchResults) ? searchResults : [],
        totalCount: Array.isArray(searchResults) ? searchResults.length : 0,
      };
    } else {
      return await getAllLimitedPartners({ pageIndex, pageSize });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch data. Please try again.",
    );
  }
};

export const useGetLP = ({ pageIndex, pageSize, sortBy, search }) => {
  return useQuery({
    queryKey: ["lp-query", pageIndex, pageSize, sortBy, search],
    queryFn: () => fetchData({ pageIndex, pageSize, sortBy, search }),
    placeholderData: (previousData) => previousData,
    onError: (error) => {
      console.error("React Query Error:", error.message);
    },
  });
};
