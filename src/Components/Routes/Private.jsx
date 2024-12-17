

import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component }) => {
  // Fetch and parse the stored user object
  const aquaUser = JSON.parse(localStorage.getItem("aquaUser"));

  // Check if the user is authenticated
  const isAuthenticated = aquaUser && aquaUser.token ? true : false;

  // Debug logs
  console.log("aquaUser:", aquaUser);
  console.log("Token in localStorage:", aquaUser?.token);
  console.log("isAuthenticated:", isAuthenticated);

  // Return the component or redirect to signup
  return isAuthenticated ? Component : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
