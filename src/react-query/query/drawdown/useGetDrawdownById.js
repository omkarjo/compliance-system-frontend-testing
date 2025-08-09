import { drawdownApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const getDrawdownById = async (id) => {
  if (!id) throw new Error("Drawdown ID is required");

  const response = await apiWithAuth.get(
    `${drawdownApiPaths.getDrawdownByIdPrefix}${id}`
  );
  return response.data;
};

export const useGetDrawdownById = (id) => {
  return useQuery({
    queryKey: ["drawdown-by-id", id],
    queryFn: () => getDrawdownById(id),
    enabled: !!id,
    onError: (error) => {
      console.error("Error fetching drawdown by ID:", error.message);
    },
  });
};
