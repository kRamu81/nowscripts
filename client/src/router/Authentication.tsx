import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/Auth";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the intended route so we can redirect back after login
    localStorage.setItem("redirect_after_login", location.pathname + location.search);
    return <Navigate to="/signin/in" replace />;
  }

  return <>{children}</>;
}
