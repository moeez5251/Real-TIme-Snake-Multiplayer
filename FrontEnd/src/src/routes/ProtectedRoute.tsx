import type { JSX } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const username = localStorage.getItem("username");

  if (!username) {
    return <Navigate to="/verify" replace />;
  }

  return children;
};

export default ProtectedRoute;
