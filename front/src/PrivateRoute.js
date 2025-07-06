import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.clear(); // Očisti sve podatke
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (err) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;
