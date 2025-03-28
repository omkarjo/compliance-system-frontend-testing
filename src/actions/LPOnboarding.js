import { limitedPartnersApiPaths } from "@/constant/apiPaths";
import queryClient from "@/query/queryClient";
import { useAppSelector } from "@/store/hooks";
import { apiWithAuth } from "@/utils/api";
import fileUpload from "@/utils/file-upload";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useLimitedPartnerOnboarding() {
  const { isAuthenticated, user } = useAppSelector((state) => state.user);

  return useMutation({
    mutationFn: async ({ lpData, cmlFile }) => {
      const preparedLpData = {
        ...lpData,
        dob: lpData.dob?.toISOString().split("T")[0],
        doi: lpData.doi?.toISOString().split("T")[0],
        date_of_agreement: lpData.date_of_agreement
          ?.toISOString()
          .split("T")[0],
        cml: "",
      };

      if (!isAuthenticated) {
        throw new Error("User is not authenticated");
      }

      if (!user?.user_id) {
        throw new Error("User ID is not available");
      }


      const lpResponse = await apiWithAuth.post(
        limitedPartnersApiPaths.createLimitedPartner,
        preparedLpData,
      );
      const lpId = lpResponse.data.lp_id;

      const taskData = {
        description: `Onboarding document upload for ${preparedLpData.lp_name}`,
        deadline: new Date().toISOString(),
        category: "SEBI",
        assignee_id: user.user_id,
        reviewer_id: "14a89dcc-110d-4b14-b51f-50dd28fa4c95",
        approver_id: "85217b6d-41c3-4f68-b5fa-0c5cd352c7c7",
      };

      const taskResponse = await apiWithAuth.post("/api/tasks/", taskData);
      const taskId = taskResponse.data.compliance_task_id;

      const cmlUploadResponse = await fileUpload(
        cmlFile,
        "Contribution Agreement",
        taskId,
      );

      await apiWithAuth.put(
        `${limitedPartnersApiPaths.createLimitedPartner}${lpId}`,
        { cml: cmlUploadResponse.data.document_id },
      );

      await apiWithAuth.patch(`/api/tasks/${taskId}`, { state: "Completed" });

      return lpResponse.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lp-query"] });
      toast.success("Limited Partner Onboarded Successfully");
    },
    onError: (error) => {
      console.error("Onboarding Error:", error);
      toast.error("Failed to Onboard Limited Partner", {
        description: error.response?.data?.detail || "Unknown error occurred",
      });
    },
  });
}
