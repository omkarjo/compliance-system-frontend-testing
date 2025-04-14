import { useAppSelector } from "@/store/hooks";

export const usePermissionTaskChange = () => {
  const { user } = useAppSelector((state) => state.user);

  return (data) => {
    if (!user?.user_id || !user?.role) return false;
    if (!data?.approver_id || !data?.assignee_id || !data?.reviewer_id)
      return false;

    if (user.role === "Fund Manager") return true;

    if (user.user_id === data.approver_id) return true;
    if (user.user_id === data.assignee_id) return true;
    if (user.user_id === data.reviewer_id) return true;

    return false;
  };
};
