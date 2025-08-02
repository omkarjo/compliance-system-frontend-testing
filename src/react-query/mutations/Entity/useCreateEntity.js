import { apiWithAuth } from "@/utils/api";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { entityApiPaths } from "@/constant/apiPaths"; 

const createEntity = async (data) => {

  
  const response = await apiWithAuth.post(entityApiPaths.create, data);
  return response.data;
};

export function useCreateEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-entity"],
    mutationFn: createEntity,

    onMutate: () => {
      toast.loading("Creating entity...", { id: "entity-loading" });
    },

    onSuccess: () => {
      toast.success("Entity created successfully", { id: "entity-loading" });
    },

    onError: (error) => {
      toast.error("Entity creation failed", {
        id: "entity-loading",
        description: error?.response?.data?.detail || "Something went wrong",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries(["entities"]);
    },
  });
}