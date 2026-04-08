import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import { isTokenExpired } from "../../../utils/jwt";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const PrivateRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { token, isAuthenticated, role, authChecked } = useSelector(
    (state: RootState) => state.auth
  );
  
  /* ================= WAIT FOR AUTH RESTORE ================= */
  //  DO NOT redirect until we finish checking localStorage
  if (!authChecked) {
    return null; // or a loader component
  }

  /* ================= NO TOKEN ================= */
  if (!token) {
    return <Navigate to="/registrationlogin/login" replace />;
  }

  /* ================= TOKEN EXPIRED ================= */
  if (isTokenExpired(token)) {
    return <Navigate to="/registrationlogin/login" replace />;
  }

  /* ================= NOT AUTHENTICATED ================= */
  if (!isAuthenticated) {
    return <Navigate to="/registrationlogin/login" replace />;
  }

  /* ================= ROLE CHECK ================= */
   if (allowedRoles) {
    // Admin group access
   if (role?.includes("admin")) {
    return <>{children}</>;
  }

    // Non-admin exact match
    if (allowedRoles.includes(role || "")) {
      return <>{children}</>;
    }

    // Role not allowed
    return <Navigate to="/" replace />;
  }
  /* ================= ACCESS GRANTED ================= */
  return <>{children}</>;
};

export default PrivateRoute;
