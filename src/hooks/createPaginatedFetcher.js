import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

const createPaginatedFetcher = (data, id) => {
  return ({ pageIndex, pageSize }) => {
    const [currentData, setCurrentData] = useState(data);

    useEffect(() => {
      setCurrentData(data);
    }, []);

    const fetchPaginatedData = useCallback(async () => {
      const start = pageIndex * pageSize;
      const end = start + pageSize;
      const paginatedData = currentData?.slice(start, end) || [];

      const totalCount = currentData?.length || 0;

      return { data: paginatedData, totalCount };
    }, [currentData, pageIndex, pageSize]);

    return useQuery({
      queryKey: [`paginated-data-${id}`, pageIndex, pageSize],
      queryFn: fetchPaginatedData,
      keepPreviousData: true,
    });
  };
};

export default createPaginatedFetcher;
