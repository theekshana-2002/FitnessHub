import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SuperAdminDashboard from "../../features/dashboard/super-admin/pages/SuperAdminDashboard";
import OwnerDashboard from "../../features/dashboard/owner/pages/OwnerDashboard";
import CoachDashboard from "../../features/dashboard/coach/pages/CoachDashboard";
import MemberDashboard from "../../features/dashboard/member/pages/MemberDashboard";
import AppLayout from "../../components/layout/AppLayout";
import ChangePasswordPage from "../../features/auth/pages/ChangePasswordPage";
import ForgotPasswordPage from "../../features/auth/pages/ForgotPasswordPage";
import LoginPage from "../../features/auth/pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../../features/auth/context/AuthContext";
import { roleToPath } from "../../features/auth/utils/roleToPath";
import RouteErrorBoundary from "../../components/layout/RouteErrorBoundary";

function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? (user.mustChangePassword ? "/change-password" : roleToPath(user.role)) : "/login"} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/change-password"
        element={(
          <ProtectedRoute allowedRoles={["super-admin", "owner", "coach", "member"]}>
            <RouteErrorBoundary>
              <ChangePasswordPage />
            </RouteErrorBoundary>
          </ProtectedRoute>
        )}
      />

      <Route element={<AppLayout />}>
        <Route
          path="/super-admin"
          element={(
            <ProtectedRoute allowedRoles={["super-admin"]}>
              <RouteErrorBoundary>
                <SuperAdminDashboard />
              </RouteErrorBoundary>
            </ProtectedRoute>
          )}
        />
        <Route
          path="/owner"
          element={(
            <ProtectedRoute allowedRoles={["owner"]}>
              <RouteErrorBoundary>
                <OwnerDashboard />
              </RouteErrorBoundary>
            </ProtectedRoute>
          )}
        />
        <Route
          path="/coach"
          element={(
            <ProtectedRoute allowedRoles={["coach"]}>
              <RouteErrorBoundary>
                <CoachDashboard />
              </RouteErrorBoundary>
            </ProtectedRoute>
          )}
        />
        <Route
          path="/member"
          element={(
            <ProtectedRoute allowedRoles={["member"]}>
              <RouteErrorBoundary>
                <MemberDashboard />
              </RouteErrorBoundary>
            </ProtectedRoute>
          )}
        />
      </Route>

      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}
