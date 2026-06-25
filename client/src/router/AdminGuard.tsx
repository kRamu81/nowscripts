import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/Auth";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/signin/in" replace />;
  if (user?.role !== "Admin" && user?.role !== "Super Admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
