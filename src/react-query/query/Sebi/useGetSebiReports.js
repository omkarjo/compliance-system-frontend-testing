import { useQuery } from "@tanstack/react-query";

const fetchSebiReportsData = async ({
  pageIndex = 0,
  pageSize = 10,
  sortBy,
  search,
}) => {
  const allReports = [];

  let filtered = [...allReports];

  if (search) {
    filtered = filtered.filter((item) =>
      item.title?.toLowerCase().includes(search.toLowerCase()),
    );
  }

  if (sortBy?.[0]) {
    const { id, desc } = sortBy[0];
    filtered.sort((a, b) => {
      const aVal = a[id];
      const bVal = b[id];

      if (aVal == null || bVal == null) return 0;

      if (!isNaN(parseFloat(aVal)) && !isNaN(parseFloat(bVal))) {
        return desc
          ? parseFloat(bVal) - parseFloat(aVal)
          : parseFloat(aVal) - parseFloat(bVal);
      }

      return desc
        ? String(bVal).localeCompare(String(aVal))
        : String(aVal).localeCompare(String(bVal));
    });
  }

  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const paginatedData = filtered.slice(start, end);

  return {
    data: paginatedData,
    totalCount: filtered.length,
  };
};

export const useGetSebiReports = ({ pageIndex, pageSize, sortBy, search }) => {
  return useQuery({
    queryKey: ["sebi-reports-query", pageIndex, pageSize, sortBy, search],
    queryFn: () =>
      fetchSebiReportsData({ pageIndex, pageSize, sortBy, search }),
    placeholderData: (prev) => prev,
    onError: (error) => {
      console.error("SEBI Reports fetch error:", error.message);
    },
  });
};
