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
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  // const start = pageIndex * pageSize;
  // const end = start + pageSize;
  // const slicedData = data.slice(start, end);
  return { data: data, total: data.length };
};

export const useGetLP = ({ pageIndex, pageSize, sortBy }) => {
  const { token } = useAppSelector((state) => state.user);
  return useQuery({
    queryKey: ["lp-querry", pageIndex, pageSize, sortBy],
    queryFn: () => fetchData({ token, pageIndex, pageSize, sortBy }),
    keepPreviousData: true,
  });
};
