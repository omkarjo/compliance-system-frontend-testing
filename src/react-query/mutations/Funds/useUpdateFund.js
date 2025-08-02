import { fundApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const updateFund = async ({ id, data }) => {
  const response = await apiWithAuth.patch(
    `${fundApiPaths.update}/${id}`,
    data,
  );
  return response.data;
};

export function useUpdateFund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-fund"],
    mutationFn: updateFund,

    onMutate: () => {
      toast.loading("Updating fund...", { id: "fund-loading" });
    },

    onSuccess: () => {
      toast.success("Fund updated successfully", { id: "fund-loading" });
    },

    onError: (error) => {
      const detail = error?.response?.data?.detail;

      const errorMessages = Array.isArray(detail)
        ? detail.map((err) => err.msg).join(", ")
        : typeof detail === "string"
          ? detail
          : "Something went wrong";

      console.error("Update Fund Error:", errorMessages);
      toast.error("Fund creation failed", {
        id: "fund-loading",
        description: "Failed to update fund. Please try again.",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries(["funds"]);
    },
  });
}
