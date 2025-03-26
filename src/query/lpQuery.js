import { limitedPartnersApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchData = async ({ pageIndex, pageSize, sortBy, search }) => {
  const skip = pageIndex * pageSize;
  const limit = pageSize;

  const params = {
    skip,
    limit,
    sortBy,
  };

  try {
    let response;
    if (search) {
      params.name = search;
      response = await apiWithAuth.get(limitedPartnersApiPaths.searchLimitedPartners, { params });
    } else {
      response = await apiWithAuth.get(limitedPartnersApiPaths.getLimitedPartners, { params });
    }
    const data = response.data;

    return { data, total: data.length };
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
