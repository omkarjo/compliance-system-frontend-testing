import { useAppSelector } from "@/store/hooks";
import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";


const fetchData = async ({ token, pageIndex, pageSize, sortBy, filters }) => {
  if (!token) {
    throw new Error("Unauthorized");
  }
  const searchParams = {
    limit: pageSize,
    skip: pageIndex * pageSize,
    sort: sortBy,
    ...filters.reduce((acc, filter) => {
      acc[filter.filterid] = filter.optionid;
      return acc;
    }, {}),
  };

  console.log(filters);
  const response = await api.get("/api/tasks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: searchParams,
  });
  const { tasks, total } = response.data;
  return { data: tasks || [], totalCount: total };
};

export const useGetTask = ({
  pageIndex,
  pageSize,
  sortBy = [],
  filters = [],
}) => {
  const { token } = useAppSelector((state) => state.user);
  const first_sort = sortBy.at(0);
  const sort = first_sort
    ? `${first_sort.id}_${first_sort.desc ? "desc" : "asc"}`
    : "";

  return useQuery({
    queryKey: ["task-querry", pageIndex, pageSize, sort, filters],
    queryFn: () =>
      fetchData({ token, pageIndex, pageSize, sortBy: sort, filters }),
    placeholderData: keepPreviousData => keepPreviousData,
  });
};
