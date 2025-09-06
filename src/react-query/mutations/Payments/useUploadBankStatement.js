import { paymentApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Uploads a bank statement for payment reconciliation.
 * @param {Object} data - { bank_statement: File | Blob, fund_id: number }
 * @returns {Promise<any>}
 */
const uploadBankStatement = async (data) => {
  const formData = new FormData();
  formData.append("bank_statement", data.bank_statement);
  formData.append("fund_id", data.fund_id);

  const response = await apiWithAuth.post(
    paymentApiPaths.uploadStatement,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export function useUploadBankStatement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["upload-bank-statement"],
    mutationFn: uploadBankStatement,

    onMutate: () => {
      toast.loading("Uploading bank statement...", {
        id: "bank-upload-loading",
      });
    },

    onSuccess: () => {
      toast.success("Bank statement uploaded successfully", {
        id: "bank-upload-loading",
      });
    },

    onError: (error) => {
      const detail = error?.response?.data?.detail;
      const errorMessages = Array.isArray(detail)
        ? detail.map((err) => err.msg).join(", ")
        : typeof detail === "string"
          ? detail
          : "Something went wrong";

      console.error("Bank Statement Upload Error:", errorMessages);

      toast.error("Bank statement upload failed", {
        id: "bank-upload-loading",
        description: errorMessages,
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries(["payment-reconciliations"]);
    },
  });
}
