import { fundEntityApiPaths, fundApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const getFundEntitiesByFundId = async (fundId) => {
  if (!fundId) throw new Error("Fund ID is required");

  const response = await apiWithAuth.get(
    `${fundEntityApiPaths.getFundEntitiesByFundIdPrefix}${fundId}${fundEntityApiPaths.getFundEntityByFundIdSuffix}`,
  );
  return response.data;
};

export const useGetFundEntitiesByFundId = (fundId) => {
  return useQuery({
    queryKey: ["fund-entities-by-fund-id", fundId],
    queryFn: () => getFundEntitiesByFundId(fundId),
    enabled: !!fundId,
    onError: (error) => {
      console.error("Error fetching fund entities by Fund ID:", error.message);
    },
  });
};
