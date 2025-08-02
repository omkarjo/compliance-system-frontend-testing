import { portfolioCompaniesApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function showToastWithView(id) {
  const url = `/dashboard/portfolio-companies?id=${id}&action=view`;

  toast("Portfolio Company created", {
    description: "Click the button below to view the Portfolio Company.",
    action: {
      label: "View",
      onClick: () => {
        window.location.href = url;
      },
    },
  });
}

const createPortfolioCompany = async (data) => {
  const response = await apiWithAuth.post(
    portfolioCompaniesApiPaths.create,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 0,
    },
  );

  if (response.status !== 201) {
    throw new Error("Failed to create Portfolio Company");
  }
  showToastWithView(response.data.company_id);
  return response.data;
};

export function useCreatePortfolioCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-portfolio-company"],
    mutationFn: createPortfolioCompany,

    onMutate: () => {
      toast.loading("Creating portfolio company...", { id: "pc-loading" });
    },

    onSuccess: () => {
      toast.success("Portfolio company created successfully", {
        id: "pc-loading",
      });
    },

    onError: (error) => {
      toast.error("Creation failed", {
        id: "pc-loading",
        description: error?.response?.data?.detail || "Something went wrong",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries(["portfolio-companies"]);
    },
  });
}
