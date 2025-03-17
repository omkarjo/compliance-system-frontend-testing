import useCheckRoles from "@/utils/check-roles";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "sonner";

const ProtectRoutes = ({ allowedRoles, children, redirect = "/login" }) => {
  const hasPermission = useCheckRoles(allowedRoles);
  if (!hasPermission) {
    toast.error("You are not authorized to access this page");
    return <Navigate to={redirect} />;
  }

  return children || <Outlet />;
};

export default ProtectRoutes;
