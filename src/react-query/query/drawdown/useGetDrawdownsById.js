import { drawdownApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const getDrawdownsById = async (id) => {
  if (!id) throw new Error("Drawdown ID is required");

  const response = await apiWithAuth.get(
    `${drawdownApiPaths.getDrawdownByIdPrefix}${id}`,
  );
  return response.data;
};

export const useGetDrawdownsById = (id) => {
  return useQuery({
    queryKey: ["drawdown-by-id", id],
    queryFn: () => getDrawdownsById(id),
    enabled: !!id,
    onError: (error) => {
      console.error("Error fetching drawdown by ID:", error.message);
    },
  });
};
