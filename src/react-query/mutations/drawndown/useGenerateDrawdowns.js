import { apiWithAuth } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { drawdownApiPaths } from "@/constant/apiPaths";

const generateDrawdowns = async (data) => {
  const res = await apiWithAuth.post(drawdownApiPaths.create, data);
  return res.data;
};

export function useGenerateDrawdowns() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["generate-drawdowns"],
    mutationFn: generateDrawdowns,

    onMutate: () => {
      toast.loading("Sending drawdowns...", { id: "drawdown-generate" });
    },

    onSuccess: () => {
      toast.success("Drawdowns sent successfully", { id: "drawdown-generate" });
      queryClient.invalidateQueries(["drawdowns"]); // refresh table
    },

    onError: (error) => {
      toast.error("Failed to send drawdowns", {
        id: "drawdown-generate",
        description: error?.response?.data?.detail || "Something went wrong",
      });
    },
  });
}