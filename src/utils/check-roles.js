import { useAppSelector } from "@/store/hooks";

const useCheckRoles = (allowedRoles) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  if (!isAuthenticated) {
    return false;
  }

  if (!allowedRoles) {
    return true;
  }

  if(!user?.role) {
    return false
  }

  const hasPermission = allowedRoles.includes(user.role);

  return hasPermission;
};

export default useCheckRoles;
