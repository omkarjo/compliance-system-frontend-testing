import { useQuery } from "@tanstack/react-query";

const allDrawdownsCache = [];
const forceRefreshCache = true;

const generateDummyDrawdowns = (count = 200) => {
  const quarters = ["Q1 FY23", "Q2 FY23", "Q3 FY23", "Q4 FY23", "Q1 FY24"];

  return Array.from({ length: count }).map((_, index) => {
    const amount = 100000 + index * 1000;
    const remaining = amount / 2;

    return {
      id: `drawdown-${index + 1}`,
      quarter: quarters[index % quarters.length],
      notice_date: new Date(Date.now() - index * 86400000).toISOString(),
      drawdown_status: "Pending",
      invi_filling_status: "Pending",
      drawdown_amount: amount.toFixed(2),
      remaining_drawdown: remaining.toFixed(2),
    };
  });
};

const getAllDrawdowns = async () => {
  if (forceRefreshCache || allDrawdownsCache.length === 0) {
    const dummyData = generateDummyDrawdowns(200);
    allDrawdownsCache.splice(0, allDrawdownsCache.length, ...dummyData);
  }

  return {
    data: allDrawdownsCache,
    totalCount: allDrawdownsCache.length,
  };
};

const fetchDrawdownData = async ({ sortBy, search }) => {
  let allFiltered = allDrawdownsCache;

  if (search) {
    allFiltered = allDrawdownsCache.filter((item) =>
      item.quarter.toLowerCase().includes(search.toLowerCase())
    );
  }

  return {
    data: allFiltered,
    totalCount: allFiltered.length,
  };
};

export const useGetDrawdowns = ({ sortBy, search }) => {
  return useQuery({
    queryKey: ["drawdowns", sortBy, search],
    queryFn: async () => {
      await getAllDrawdowns();
      return fetchDrawdownData({ sortBy, search });
    },
    placeholderData: (prev) => prev,
    onError: (error) => {
      console.error("Drawdown fetch error:", error.message);
    },
  });
};