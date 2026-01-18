import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRedirect() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  console.log(user.role)

  switch (user.role) {
    case "CEO":
      return <Navigate to="/dashboard/ceo" replace />;
    case "SystemAdmin":
      return <Navigate to="/dashboard/system-admin" replace />;
    case "TL":
      return <Navigate to="/dashboard/tl" replace />;
    case "ATL":
      return <Navigate to="/dashboard/atl" replace />;
    case "PM":
      return <Navigate to="/dashboard/pm" replace />;
    case "Developer":
      return <Navigate to="/dashboard/dev" replace />;
    case "Unassigned":
      return <Navigate to="/dashboard" replace />; // generic fallback
    default:
      return <Navigate to="/dashboard" replace />;
  }
}
