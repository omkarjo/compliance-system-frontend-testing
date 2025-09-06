import { limitedPartnersApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";

function showToastWithView(id) {
  const url = `/dashboard/limited-partners?id=${id}&action=edit`;

  toast("Limited Partner created", {
    description: "Click the button below to view the LP.",
    action: {
      label: "View",
      onClick: () => {
        window.location.href = url;
      },
    },
  });
}

const createLP = async (values) => {
  const formData = new FormData();

  if (values.kyc_file?.[0]) formData.append("kyc_file", values.kyc_file[0]);
  if (values.ca_file?.[0]) formData.append("ca_file", values.ca_file[0]);
  if (values.cml_file?.[0]) formData.append("cml_file", values.cml_file[0]);

  formData.append("kyc_category", "kyc");
  formData.append("ca_category", "contribution_agreement");
  formData.append("cml_category", "cml");

  if (values.fund_id) formData.append("fund_id", values.fund_id);

  const response = await apiWithAuth.post(
    limitedPartnersApiPaths.createLimitedPartner,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 0,
    },
  );

  if (response.status !== 201) {
    throw new Error("Failed to create Limited Partner");
  }

  showToastWithView(response.data.lp_id);

  return response.data;
};

export function useCreateLimitedPartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-limited-partner"],
    mutationFn: createLP,
    onMutate: () => {
      toast.loading("Creating Limited Partner...", { id: "lp-loading" });
    },
    onSuccess: () => {
      toast.success("Limited Partner created successfully", {
        id: "lp-loading",
      });
    },
    onError: (error) => {
      toast.error("Failed to create Limited Partner", {
        id: "lp-loading",
        description: error?.response?.data?.detail || "Something went wrong",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(["limited-partners"]);
    },
  });
}
