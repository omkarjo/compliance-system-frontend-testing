import { fundApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const getFundById = async (id) => {
  if (!id) throw new Error("Fund ID is required");

  const response = await apiWithAuth.get(
    `${fundApiPaths.getFundByIdPrefix}${id}`,
  );
  return response.data;
};

export const useGetFundById = (id) => {
  return useQuery({
    queryKey: ["fund-by-id", id],
    queryFn: () => getFundById(id),
    enabled: !!id,
    onError: (error) => {
      console.error("Error fetching fund by ID:", error.message);
    },
  });
};
