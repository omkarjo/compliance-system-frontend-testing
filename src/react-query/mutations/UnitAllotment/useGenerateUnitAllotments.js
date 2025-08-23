import { apiWithAuth } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { unitAllotmentApiPaths } from "@/constant/apiPaths";

const generateUnitAllotments = async (fund_id) => {
  const res = await apiWithAuth.post(unitAllotmentApiPaths.generateUnitAllotments, {
    fund_id,
    force_recalculation: true,
  });
  return res.data;
};

export function useGenerateUnitAllotments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["generate-unit-allotments"],
    mutationFn: (fund_id) => generateUnitAllotments(fund_id),
    onMutate: () => {
      toast.loading("Generating unit allotments...", { id: "unit-allotments-generate" });
    },
    onSuccess: () => {
      toast.success("Unit allotments generated successfully", { id: "unit-allotments-generate" });
      queryClient.invalidateQueries(["unit-allotments"]);
    },
    onError: (error) => {
      toast.error("Failed to generate unit allotments", {
        id: "unit-allotments-generate",
        description: error?.response?.data?.detail || "Something went wrong",
      });
    },
  });
}
