import { useAppSelector } from "@/store/hooks";

const useCheckRoles = (allowedRoles) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  if (!isAuthenticated) {
    return false;
  }

  if (!allowedRoles) {
    return true;
  }
  const hasPermission = allowedRoles.includes(user.role);

  return hasPermission;
};

export default useCheckRoles;
