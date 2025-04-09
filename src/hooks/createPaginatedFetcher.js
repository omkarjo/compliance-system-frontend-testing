import { useQuery } from "@tanstack/react-query";

const createPaginatedFetcher = (data, id) => {
  return ({ pageIndex, pageSize }) => {
    const fetchPaginatedData = async () => {
      const start = pageIndex * pageSize;
      const end = start + pageSize;
      const paginatedData = data?.slice(start, end) || [];

      const totalCount = data?.length || 0;

      return { data: paginatedData, totalCount };
    };

    return useQuery({
      queryKey: [`paginated-data-${id}`, pageIndex, pageSize],
      queryFn: fetchPaginatedData,
      keepPreviousData: true,
    });
  };
};

export default createPaginatedFetcher;
