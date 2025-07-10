import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminPrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin !== "true") {
    return <Navigate to="/home" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.clear();
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (err) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
};

export default AdminPrivateRoute;
