import { Navigate } from "react-router-dom";
import { getUser, canAccess, homeRoute } from "../utils/permissions";

function ProtectedRoute({ children, module }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const user = getUser();

  // Not allowed to see this module → send to their own home page
  if (module && !canAccess(user?.role, module)) {
    return <Navigate to={homeRoute(user?.role)} replace />;
  }

  return children;
}

export default ProtectedRoute;
