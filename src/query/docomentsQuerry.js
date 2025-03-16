import { apiWithAuth } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchData = async ({ pageIndex, pageSize, sortBy, filters }) => {
  console.log("filters", filters);
  console.log("sortBy", sortBy);
  const searchParams = {
    limit: pageSize,
    skip: pageIndex * pageSize,
    sort: sortBy,
    ...filters.reduce((acc, filter) => {
      acc[filter.filterid] = filter.optionid;
      return acc;
    }, {}),
  };
  const response = await apiWithAuth.get("/api/documents/", {
    params: searchParams,
  });
  const { documents, total } = response.data;
  return { data: documents || [], totalCount: total || 0 };
};

export const useGetAllDocuments = ({
  pageIndex,
  pageSize,
  sortBy = [],
  filters = [],
}) => {
  const first_sort = sortBy.at(0);
  const sort = first_sort
    ? `${first_sort.id}_${first_sort.desc ? "desc" : "asc"}`
    : "";
  return useQuery({
    queryKey: ["task-querry", pageIndex, pageSize, sort, filters],
    queryFn: () => fetchData({ pageIndex, pageSize, sortBy: sort, filters }),
    keepPreviousData: true,
  });
};
