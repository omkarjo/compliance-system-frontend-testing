import { ADMIN_ROLES, ALL_ROLES } from "@/constant/roles";
import ProtectRoutes from "@/pages/Auth/ProtectRoutes";
import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const DashboardLayout = lazy(() => import("@/layouts/DashboardLayout"));
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));

const TaskPage = lazy(() => import("@/pages/Dashboard/Overview/Task"));
const LPDashboard = lazy(
  () => import("@/pages/Dashboard/Compliance/LPDashboard"),
);

const Home = lazy(() => import("@/pages/public/Home"));
const Register = lazy(() => import("@/pages/Auth/Register"));
const Login = lazy(() => import("@/pages/Auth/Login"));
const ActivityLog = lazy(
  () => import("@/pages/Dashboard/Overview/ActivityLog"),
);
const Docoments = lazy(() => import("@/pages/Dashboard/Overview/Docoments"));
const DashBoard = lazy(() => import("@/pages/Dashboard/Overview/DashBoard"));
const LPBulkUpload = lazy(
  () => import("@/pages/Dashboard/Compliance/LPBulkUpload"),
);

const UsersDashboard = lazy(
  () => import("@/pages/Dashboard/Admin/UsersDashboard"),
);

const AppRoutes = () => {
  return (
    // <Suspense fallback={<Loading />}>
    <Routes>
      <Route path="/">
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route element={<ProtectRoutes redirect="/login" />}>
            <Route index element={<DashBoard />} />
            <Route path="documents" element={<Docoments />} />
            <Route path="activity-log" element={<ActivityLog />} />
            <Route path="task" element={<TaskPage />} />
          </Route>
          <Route
            element={
              <ProtectRoutes allowedRoles={ADMIN_ROLES} redirect="/dashboard" />
            }
          >
            <Route path="limited-partners">
              <Route index element={<LPDashboard />} />
              <Route path="bulk-upload" element={<LPBulkUpload />} />
            </Route>
            <Route path="portfolio-companies" element={<div>Portfolio</div>} />

            <Route path="users" element={<ProtectRoutes  allowedRoles={ALL_ROLES} redirect="/dashboard" />}>
              <Route index element={<UsersDashboard />} />
            </Route>

          </Route>
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Route>
    </Routes>
    // </Suspense>
  );
};

export default AppRoutes;
