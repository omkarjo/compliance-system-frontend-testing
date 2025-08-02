import { portfolioCompaniesApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const deletePortfolioCompany = async (id) => {
  const response = await apiWithAuth.delete(
    `${portfolioCompaniesApiPaths.delete}${id}`
  );
  return response.data;
};

export function useDeletePortfolioCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-portfolio-company"],
    mutationFn: deletePortfolioCompany,
    onMutate: () => {
      toast.loading("Deleting portfolio company...", { id: "pc-delete" });
    },
    onSuccess: () => {
      toast.success("Portfolio company deleted successfully", {
        id: "pc-delete",
      });
    },
    onError: (error) => {
      toast.error("Deletion failed", {
        id: "pc-delete",
        description: error?.response?.data?.detail || "Something went wrong",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(["portfolio-companies"]);
      queryClient.invalidateQueries({ queryKey: ["portfolio-companies-query"] });
    },
  });
}
