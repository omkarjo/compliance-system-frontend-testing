import { useAppSelector } from "@/store/hooks";
import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const fetchData = async ({ token, pageIndex, pageSize, sortBy }) => {
  if (!token) {
    throw new Error("Unauthorized");
  }

  const skip = pageIndex * pageSize;
  const limit = pageSize;

  const response = await api.get("/api/lps/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      skip: skip,
      limit: limit,
      sortBy: sortBy,
    },
  });

  const data = response.data;
  return { data: data, total: data.length };
};

export const useGetLP = ({ pageIndex, pageSize, sortBy }) => {
  const { token } = useAppSelector((state) => state.user);
  return useQuery({
    queryKey: ["lp-querry", pageIndex, pageSize, sortBy],
    queryFn: () => fetchData({ token, pageIndex, pageSize, sortBy }),
    placeholderData: keepPreviousData => keepPreviousData,
  });
};
