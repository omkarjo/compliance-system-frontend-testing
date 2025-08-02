import { portfolioCompaniesApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const getPortfolioCompanyById = async (id) => {
  const response = await apiWithAuth.get(
    `${portfolioCompaniesApiPaths.idPrefix}${id}`,
  );
  return response.data;
};

export function useGetPortfolioCompanyById(id) {
  return useQuery({
    queryKey: ["portfolio-company", id],
    queryFn: () => getPortfolioCompanyById(id),
    enabled: !!id,
  });
}
