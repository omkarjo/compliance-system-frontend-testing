import { documentApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchData = async ({ pageIndex, pageSize, sortBy, filters, search }) => {
  try {
    const searchParams = {
      limit: pageSize,
      skip: pageIndex * pageSize,
      sort: sortBy,
      name: search,
      ...filters.reduce((acc, filter) => {
        acc[filter.filterid] = filter.optionid;
        return acc;
      }, {}),
    };
    const response = await apiWithAuth.get(documentApiPaths.getDocument, {
      params: searchParams,
    });
    const { documents, total } = response.data;
    return { data: documents || [], totalCount: total || 0 };
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

export const useGetAllDocuments = ({
  pageIndex,
  pageSize,
  search = "",
  sortBy = [],
  filters = [],
}) => {
  const first_sort = sortBy.at(0);
  const sort = first_sort
    ? `${first_sort.id}_${first_sort.desc ? "desc" : "asc"}`
    : "";
  return useQuery({
    queryKey: ["task-querry", pageIndex, pageSize, sort, filters, search],
    queryFn: () =>
      fetchData({ pageIndex, pageSize, sortBy: sort, filters, search }),
    placeholderData: (keepPreviousData) => keepPreviousData,
  });
};
