import { paymentApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const manualRecordPayment = async (data) => {
  const response = await apiWithAuth.post(paymentApiPaths.manualRecord, data);
  return response.data;
};

export function useManualRecordPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["manual-record-payment"],
    mutationFn: manualRecordPayment,

    onMutate: () => {
      toast.loading("Recording payment...", { id: "manual-payment-loading" });
    },

    onSuccess: () => {
      toast.success("Payment recorded successfully", {
        id: "manual-payment-loading",
      });
    },

    onError: (error) => {
      const detail = error?.response?.data?.detail;
      const errorMessages = Array.isArray(detail)
        ? detail.map((err) => err.msg).join(", ")
        : typeof detail === "string"
          ? detail
          : "Something went wrong";

      console.error("Manual Record Payment Error:", errorMessages);

      toast.error("Payment recording failed", {
        id: "manual-payment-loading",
        description: errorMessages,
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries(["payments"]);
    },
  });
}
