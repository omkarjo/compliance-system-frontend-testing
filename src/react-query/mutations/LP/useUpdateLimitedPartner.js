import { limitedPartnersApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";

export function prepareLPFormData(values) {
  return {
    ...values,
    dob: values.dob ? format(values.dob, "yyyy-MM-dd") : null,
    doi: values.doi ? format(values.doi, "yyyy-MM-dd") : null,
    date_of_agreement: values.date_of_agreement
      ? format(values.date_of_agreement, "yyyy-MM-dd")
      : null,
    email_for_drawdowns: values.emaildrawdowns?.length
      ? values.emaildrawdowns.join(",")
      : "",
    commitment_amount: Number(values.commitment_amount),
  };
}

async function updateLP({ id, values }) {
  const data = prepareLPFormData(values);

  const response = await apiWithAuth.put(
    `${limitedPartnersApiPaths.updateLimitedPartnerPrefix}${id}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

export function useUpdateLimitedPartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-limited-partner"],
    mutationFn: ({ id, values }) => updateLP({ id, values }),
    onMutate: () => {
      toast.loading("Updating Limited Partner...", { id: "lp-update" });
    },
    onSuccess: () => {
      toast.success("Limited Partner updated successfully", {
        id: "lp-update",
      });
      queryClient.invalidateQueries(["limited-partners"]);
    },
    onError: (error) => {
      toast.error("Failed to update Limited Partner", {
        id: "lp-update",
        description:
          error?.response?.data?.detail || "Something went wrong",
      });
    },
  });
}
