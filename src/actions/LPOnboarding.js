import { limitedPartnersApiPaths } from "@/constant/apiPaths";
import queryClient from "@/query/queryClient";
import { useAppSelector } from "@/store/hooks";
import { apiWithAuth } from "@/utils/api";
import fileUpload from "@/utils/file-upload";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useLPOnboarding() {
  const { isAuthenticated, user } = useAppSelector((state) => state.user);

  return useMutation({
    mutationFn: async ({ lpData, cmlFile }) => {
      try {
        // Step 1: Preparing LP data
        toast.loading("Preparing LP data...", { id: "lp-prep" });

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
        toast.success("LP data prepared.", { id: "lp-prep" });

        // Step 2: Creating LP entry
        toast.loading("Creating LP entry...", { id: "lp-create" });
        const lpResponse = await apiWithAuth.post(
          limitedPartnersApiPaths.createLimitedPartner,
          preparedLPData,
        );
        toast.success("LP entry created.", { id: "lp-create" });
        const lpId = lpResponse.data.lp_id;

        // Step 3: Creating compliance task
        toast.loading("Creating compliance task...", { id: "task-create" });
        const taskData = {
          description: `Onboarding document upload for ${preparedLPData.lp_name}`,
          deadline: new Date().toISOString(),
          category: "SEBI",
          assignee_id: user.user_id,
          reviewer_id: "14a89dcc-110d-4b14-b51f-50dd28fa4c95",
          approver_id: "85217b6d-41c3-4f68-b5fa-0c5cd352c7c7",
        };
        const taskResponse = await apiWithAuth.post("/api/tasks/", taskData);
        toast.success("Compliance task created.", { id: "task-create" });
        const taskId = taskResponse.data.compliance_task_id;

        // Step 4: Uploading the document
        toast.loading("Uploading documents", { id: "upload-doc" });
        const cmlUploadResponse = await fileUpload(
          cmlFile,
          "Contribution Agreement",
          taskId,
        );
        toast.success("Document uploaded successfully.", { id: "upload-doc" });

        // Step 5: Linking the document
        toast.loading("Linking uploaded document to LP entry...", {
          id: "link-doc",
        });
        await apiWithAuth.put(
          `${limitedPartnersApiPaths.createLimitedPartner}${lpId}`,
          { cml: cmlUploadResponse.data.document_id },
        );
        toast.success("Document linked successfully.", { id: "link-doc" });

        // Step 6: Completing the compliance task
        toast.loading("Marking compliance task as completed...", {
          id: "task-complete",
        });
        await apiWithAuth.patch(`/api/tasks/${taskId}`, {
          ...taskResponse.data,
          status: "Completed",
        });
        toast.success("Compliance task completed.", { id: "task-complete" });

        return lpResponse.data;
      } catch (error) {
        // In case of error, update any active loading toast to an error message
        toast.dismiss("lp-prep");
        toast.dismiss("lp-create");
        toast.dismiss("task-create");
        toast.dismiss("upload-doc");
        toast.dismiss("link-doc");
        toast.dismiss("task-complete");
        toast.error("An error occurred during onboarding.", {
          description: error.response?.data?.detail || error.message,
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lp-query"] });
      toast.success("LP Onboarded Successfully");
    },
    onError: (error) => {
      console.error("Onboarding Error:", error);
      toast.error("Failed to Onboard LP", {
        description: error.response?.data?.detail || "Unknown error occurred",
      });
    },
  });
}
