import { fundApiPaths } from "@/constant/apiPaths";
import { formatPayloadForFastAPI } from "@/lib/formatter";
import { apiWithAuth } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const createFund = async (data) => {
  const payload = formatPayloadForFastAPI(data);
  const response = await apiWithAuth.post(fundApiPaths.createFund, payload);
  return response.data;
};

export function useCreateFund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-fund"],
    mutationFn: createFund,

    onMutate: () => {
      toast.loading("Creating fund...", { id: "fund-loading" });
    },

    onSuccess: () => {
      toast.success("Fund created successfully", { id: "fund-loading" });
    },

    onError: (error) => {
      const detail = error?.response?.data?.detail;

      const errorMessages = Array.isArray(detail)
        ? detail.map((err) => err.msg).join(", ")
        : typeof detail === "string"
          ? detail
          : "Something went wrong";

      console.error("Create Fund Error:", errorMessages);

      toast.error("Fund creation failed", {
        id: "fund-loading",
        description: "Failed to create fund. Please try again.",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries(["funds"]);
    },
  });
}
