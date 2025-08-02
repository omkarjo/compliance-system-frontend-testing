import { entityApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchEntities = async ({ pageIndex, pageSize, sortBy, search }) => {
  const skip = pageIndex * pageSize;
  const limit = pageSize;

  const firstSort = sortBy?.[0];
  const sort = firstSort
    ? `${firstSort.id}_${firstSort.desc ? "desc" : "asc"}`
    : undefined;

  try {
    const params = {
      skip,
      limit,
      ...(sort ? { sort } : {}),
      ...(search ? { name: search } : {}),
    };

    const response = await apiWithAuth.get(entityApiPaths.getEntities, {
      params,
    });

    const { data = [], total = 0 } = response.data;

    return {
      data,
      totalCount: total,
    };
  } catch (error) {
    console.error("Error fetching entities:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch entities. Please try again.",
    );
  }
};

export const useGetEntities = ({ pageIndex, pageSize, sortBy, search }) => {
  return useQuery({
    queryKey: ["entity-query", pageIndex, pageSize, sortBy, search],
    queryFn: () => fetchEntities({ pageIndex, pageSize, sortBy, search }),
    placeholderData: (prev) => prev,
    keepPreviousData: true,
    onError: (error) => {
      console.error("React Query Error:", error.message);
    },
  });
};

const searchEntities = async (search) => {
  try {
    const response = await apiWithAuth.get(entityApiPaths.search, {
      params: { query: search },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching entities:", error);
    throw new Error(
      error.response?.data?.message || "Failed to search entities.",
    );
  }
};


export const useSearchEntities = (search) => {
  return useQuery({
    queryKey: ["entity-search", search],
    queryFn: () => searchEntities(search),
    placeholderData: prev => prev,
    onError: (error) => {
      console.error("React Query Search Error:", error.message);
    },
  });
}