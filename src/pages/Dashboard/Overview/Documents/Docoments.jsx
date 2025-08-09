import S3FileExplorer from "@/components/AWS/S3Explorer/S3FileExplorer";
import DeleteAlertDialog from "@/components/Dashboard/includes/delete-alert-dilog";
import { AuthWrapper } from "@/components/includes/AuthWrapper";
import { documentApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "@/utils/api";
import useCheckRoles from "@/utils/check-roles";
import { useQueryClient } from "@tanstack/react-query";
import { Trash, ViewIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function ActivityLog() {
  const haveAdminPermission = useCheckRoles([
    "Fund Manager",
    "Compliance Officer",
  ]);

  const queryClient = useQueryClient();

  const [deleteAlertDialog, setDeleteAlertDialog] = useState({
    isOpen: false,
    document_id: "",
    title: "",
    description: "",
    onDelete: null,
  });

  const handleDeleteAlertDialogClose = useCallback((isOpen) => {
    setDeleteAlertDialog((prev) => ({
      ...prev,
      isOpen,
      onDelete: null,
    }));
  }, []);

  const handleDeleteDocument = useCallback(async (document_id) => {
    toast.loading("Deleting document...", { id: "delete-document-toast" });

    try {
      await apiWithAuth.delete(
        `${documentApiPaths.deleteDocumentPrefix}${document_id}`,
      );

      toast.success("Document deleted successfully", {
        id: "delete-document-toast",
      });
      queryClient.invalidateQueries("documents-query");
    } catch (error) {
      toast.error("Failed to delete document", {
        id: "delete-document-toast",
        description: error?.response?.data?.message || "An error occurred",
      });
    }
  }, []);

  const handleDeleteDocumentOpen = useCallback(
    (data) => {
      if (!haveAdminPermission) {
        setDeleteAlertDialog({
          isOpen: true,
          title: `Cannot delete document “${data.name}”`,
          description: `You do not have permission to delete the document “${data.name}”.`,
          onDelete: null,
          document_id: data.document_id,
        });
        return;
      }

      setDeleteAlertDialog({
        isOpen: true,
        title: `Are you absolutely sure you want to delete the “${data.name}” document?`,
        description:
          "This action cannot be undone. This will permanently delete the document.",
        onDelete: () => {
          handleDeleteDocument(data.document_id);
          handleDeleteAlertDialogClose(false);
        },
        document_id: data.document_id,
      });
    },
    [haveAdminPermission, handleDeleteDocument, handleDeleteAlertDialogClose],
  );

  const actionType = [
    {
      title: "View",
      className: "",
      icon: <ViewIcon />,
      onClick: (data) => {
        if (!data.drive_link) {
          toast.error("No Link Found");
          return;
        }
        window.open(data.drive_link, "_blank");
      },
    },
    {
      title: "Delete",
      className: "text-red-500",
      icon: <Trash className="text-red-500" />,
      onClick: (data) => {
        handleDeleteDocumentOpen(data);
      },
    },
  ];

  return (
    <AuthWrapper>
      <section>
        <main className="mx-4 flex-1">
          <S3FileExplorer />
        </main>
        <DeleteAlertDialog
          title={deleteAlertDialog.title}
          description={deleteAlertDialog.description}
          isOpen={deleteAlertDialog.isOpen}
          onClose={handleDeleteAlertDialogClose}
          onDelete={deleteAlertDialog.onDelete}
        />
      </section>
    </AuthWrapper>
  );
}
