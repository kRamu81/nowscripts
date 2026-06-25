import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/Auth";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f9f9f9]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/signin/in" replace />;
  if (user?.role !== "Admin" && user?.role !== "Super Admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
