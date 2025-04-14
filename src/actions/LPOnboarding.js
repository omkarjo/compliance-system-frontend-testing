import { limitedPartnersApiPaths } from "@/constant/apiPaths";
import { useAppSelector } from "@/store/hooks";
import { apiWithAuth } from "@/utils/api";
import fileUpload from "@/utils/file-upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useLPOnboarding() {
  const { isAuthenticated, user } = useAppSelector((state) => state.user);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ lpData, cmlFile }) => {
      try {
        // Step 1: Preparing LP data
        toast.loading("Preparing LP data...", { id: "lp-toast" });

        const preparedLPData = {
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
        // Update the toast to indicate success
        toast.success("LP data prepared.", { id: "lp-toast" });

        // Step 2: Creating LP entry
        toast.loading("Creating LP entry...", { id: "lp-toast" });
        const lpResponse = await apiWithAuth.post(
          limitedPartnersApiPaths.createLimitedPartner,
          preparedLPData,
        );
        toast.success("LP entry created.", { id: "lp-toast" });
        const lpId = lpResponse.data.lp_id;

        // Step 3: Creating compliance task
        toast.loading("Creating compliance task...", { id: "lp-toast" });
        const taskData = {
          description: `Onboarding document upload for ${preparedLPData.lp_name}`,
          deadline: new Date().toISOString(),
          category: "SEBI",
          assignee_id: user.user_id,
          reviewer_id: user.user_id,
          approver_id: user.user_id,
        };
        const taskResponse = await apiWithAuth.post("/api/tasks/", taskData);
        toast.success("Compliance task created.", { id: "lp-toast" });
        const taskId = taskResponse.data.compliance_task_id;

        // Step 4: Uploading the document
        toast.loading("Uploading documents", { id: "lp-toast" });
        const cmlUploadResponse = await fileUpload(
          cmlFile,
          "Contribution Agreement",
          taskId,
        );
        toast.success("Document uploaded successfully.", { id: "lp-toast" });

        // Step 5: Linking the document
        toast.loading("Linking uploaded document to LP entry...", {
          id: "lp-toast",
        });
        await apiWithAuth.put(
          `${limitedPartnersApiPaths.createLimitedPartner}${lpId}`,
          { cml: cmlUploadResponse.data.document_id },
        );
        toast.success("Document linked successfully.", { id: "lp-toast" });

        // Step 6: Completing the compliance task
        toast.loading("Marking compliance task as completed...", {
          id: "lp-toast",
        });
        await apiWithAuth.patch(`/api/tasks/${taskId}`, {
          ...taskResponse.data,
          status: "Completed",
        });
        toast.success("Compliance task completed.", { id: "lp-toast" });

        return lpResponse.data;
      } catch (error) {
        // In case of error, update any active loading toast to an error message
        toast.error("LP onboarding failed.", {
          id: "lp-toast",
          description: error.response?.data?.detail || "Unknown error occurred",
        });
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("LP Onboarded Successfully", {
        id: "lp-toast",
        description: "LP onboarding completed successfully. and task created",
      });
      queryClient.invalidateQueries(["lp-query"]);
      queryClient.invalidateQueries(["task-query"]);
    },
    onError: (error) => {
      console.error("Onboarding Error:", error);
      toast.error("Failed to Onboard LP", {
        id: "lp-toast",
        description: error.response?.data?.detail || "Unknown error occurred",
      });
      queryClient.invalidateQueries(["lp-query"]);
      queryClient.invalidateQueries(["task-query"]);
    },
  });
}
