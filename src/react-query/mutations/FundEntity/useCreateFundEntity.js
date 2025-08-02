import { fundEntityApiPaths } from "@/constant/apiPaths"; // add this path mapping
import { apiWithAuth } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const createFundEntity = async (data) => {
  const response = await apiWithAuth.post(fundEntityApiPaths.create, data);
  return response.data;
};

export function useCreateFundEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-fund-entity"],
    mutationFn: createFundEntity,

    onMutate: () => {
      toast.loading("Linking entity to fund...", { id: "fund-entity-loading" });
    },

    onSuccess: () => {
      toast.success("Entity linked to fund successfully", {
        id: "fund-entity-loading",
      });
    },

    onError: (error) => {
      toast.error("Failed to link entity to fund", {
        id: "fund-entity-loading",
        description: error?.response?.data?.detail || "Something went wrong",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries(["fund-entities"]);
    },
  });
}
