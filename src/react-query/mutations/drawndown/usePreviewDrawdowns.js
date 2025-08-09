import { apiWithAuth } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { drawdownApiPaths } from "@/constant/apiPaths";

const previewDrawdowns = async (data) => {
  const res = await apiWithAuth.post(drawdownApiPaths.preview, data);
  return res.data;
};

export function usePreviewDrawdowns() {
  return useMutation({
    mutationKey: ["preview-drawdowns"],
    mutationFn: previewDrawdowns,

    onMutate: () => {
      toast.loading("Calculating drawdown preview...", { id: "drawdown-preview" });
    },

    onSuccess: (data) => {
      toast.dismiss("drawdown-preview");
      toast.success("Preview generated successfully");
    },

    onError: (error) => {
      toast.error("Failed to generate preview", {
        id: "drawdown-preview",
        description: error?.response?.data?.detail || "Something went wrong",
      });
    },
  });
}
