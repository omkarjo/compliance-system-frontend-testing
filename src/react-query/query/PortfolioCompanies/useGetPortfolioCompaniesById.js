import { portfolioCompaniesApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const getPortfolioCompanyFullData = async (id) => {
  const [companyRes, foundersRes, docsRes] = await Promise.all([
    apiWithAuth.get(`${portfolioCompaniesApiPaths.idPrefix}${id}`),
    apiWithAuth.get(`${portfolioCompaniesApiPaths.idPrefix}${id}/founders`),
    apiWithAuth.get(`${portfolioCompaniesApiPaths.idPrefix}${id}/documents`),
  ]);

  return {
    company: companyRes.data,
    founders: foundersRes.data?.data || [],
    documents: docsRes.data?.data || [],
  };
};

export function useGetPortfolioCompanyFullData(id) {
  return useQuery({
    queryKey: ["portfolio-company-full", id],
    queryFn: () => getPortfolioCompanyFullData(id),
    enabled: !!id,
  });
}
