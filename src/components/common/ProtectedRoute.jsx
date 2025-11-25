import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ✅ ProtectedRoute component
 * Prevents unauthorized users from accessing restricted routes.
 * 
 * @param {ReactNode} children - The component to render
 * @param {Array} roles - Allowed roles for this route
 */
export default function ProtectedRoute({ children, roles = [] }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Not logged in → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role-based access restriction
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
