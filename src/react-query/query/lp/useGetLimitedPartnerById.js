import { limitedPartnersApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const getLimitedPartnerById = async (id) => {
  const response = await apiWithAuth.get(
    `${limitedPartnersApiPaths.getLimitedPartnerByIdPrefix}/${id}`,
  );
  return response.data;
};

export function useGetLimitedPartnerById(id) {
  return useQuery({
    queryKey: ["limited-partner", id],
    queryFn: () => getLimitedPartnerById(id),
    enabled: !!id,
  });
}
