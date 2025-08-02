import { entityApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const updateEntity = async ({ id, data }) => {
  const response = await apiWithAuth.patch(
    `${entityApiPaths.update}/${id}`,
    data,
  );
  return response.data;
};

export function useUpdateEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-entity"],
    mutationFn: updateEntity,

    onMutate: () => {
      toast.loading("Updating entity...", { id: "entity-loading" });
    },

    onSuccess: () => {
      toast.success("Entity updated successfully", { id: "entity-loading" });
    },

    onError: (error) => {
      toast.error("Entity update failed", {
        id: "entity-loading",
        description: error?.response?.data?.detail || "Something went wrong",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries(["entities"]);
    },
  });
}
