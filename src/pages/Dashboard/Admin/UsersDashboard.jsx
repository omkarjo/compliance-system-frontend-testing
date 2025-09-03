import DeleteAlertDialog from "@/components/Dashboard/includes/delete-alert-dilog";
import { ServerDataTable } from "@/components/Table";
import { useGetUserByName } from "@/react-query/query/user/userQuery";
import { userColumns } from "@/schemas/columns/userColumns";
import { useAppSelector } from "@/store/hooks";
import { apiWithAuth } from "@/utils/api";
import useCheckRoles from "@/utils/check-roles";
import { useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function UsersDashboard() {
  const haveAdminPermission = useCheckRoles(["Fund Manager"]);

  const { user } = useAppSelector((state) => state.user);
  console.log("user", user);

  const queryClient = useQueryClient();

  const [deleteAlertDialog, setDeleteAlertDialog] = useState({
    isOpen: false,
    user_id: "",
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

  const handleDeleteUser = useCallback(
    async (user_id) => {
      toast.loading("Deleting user...", { id: "delete-user-toast" });

      try {
        await apiWithAuth.delete(`/api/users/${user_id}`);

        toast.success("User deleted successfully", {
          id: "delete-user-toast",
        });
        queryClient.invalidateQueries("users-query");
      } catch (error) {
        toast.error("Failed to delete user", {
          id: "delete-user-toast",
          description: error?.response?.data?.message || "An error occurred",
        });
      }
    },
    [queryClient],
  );

  const handleDeleteUserOpen = useCallback(
    (data) => {
      if (data.UserId === user?.UserId) {
        setDeleteAlertDialog({
          isOpen: true,
          title: `Cannot delete yourself`,
          description: `You cannot delete your own account.`,
          onDelete: null,
          user_id: data.user_id,
        });
        return;
      }

      if (!haveAdminPermission || data.role === "Fund Manager") {
        setDeleteAlertDialog({
          isOpen: true,
          title: `Cannot delete user “${data.UserName}”`,
          description: `You do not have permission to delete the user “${data.UserName}”.`,
          onDelete: null,
          user_id: data.UserId,
        });
        return;
      }

      setDeleteAlertDialog({
        isOpen: true,
        title: `Are you absolutely sure you want to delete the user “${data.UserName}”?`,
        description:
          "This action cannot be undone. This will permanently delete the user.",
        onDelete: () => {
          handleDeleteUser(data.UserId);
          handleDeleteAlertDialogClose(false);
        },
        user_id: data.user_id,
      });
    },
    [
      user?.userId,
      haveAdminPermission,
      handleDeleteUser,
      handleDeleteAlertDialogClose,
    ],
  );

  const actionType = [
    {
      title: "Delete",
      className: "text-red-500",
      icon: <Trash className="text-red-500" />,
      onClick: (data) => {
        handleDeleteUserOpen(data);
      },
    },
  ];

  const columns = userColumns(actionType);

  return (
    <section className="mt-4">
      <main className="mx-4 flex-1">
        <ServerDataTable
          columns={columns}
          fetchQuery={useGetUserByName}
          filterableColumns={[]}
          initialPageSize={10}
          searchPlaceholder="Search Activity..."
          emptyMessage="No activity logs found"
        />
      </main>
      <DeleteAlertDialog
        title={deleteAlertDialog.title}
        description={deleteAlertDialog.description}
        isOpen={deleteAlertDialog.isOpen}
        onClose={handleDeleteAlertDialogClose}
        onDelete={deleteAlertDialog.onDelete}
      />
    </section>
  );
}
