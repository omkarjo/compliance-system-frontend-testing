import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const DashboardLayout = lazy(() => import("@/layouts/DashboardLayout"));
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));

const TaskDashboard = lazy(
  () => import("@/pages/Dashboard/Overview/TaskDashboardAdmin"),
);
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

const AppRoutes = () => {
  return (
    // <Suspense fallback={<Loading />}>
    <Routes>
      <Route path="/">
        <Route index element={<Home />} />
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<div>Dashbord</div>} />
          <Route path="documents" element={<Docoments />} />
          <Route path="activity-log" element={<ActivityLog />} />
          <Route path="task" element={<TaskDashboard />} />
          <Route path="limited-partners" element={<LPDashboard />} />

          <Route path="*" element={<div>Page Not Found</div>} />
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
