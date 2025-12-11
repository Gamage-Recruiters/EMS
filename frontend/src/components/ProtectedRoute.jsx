import React from "react";

const ProtectedRoute = ({ children }) => {
  // Render children directly (no auth checks for now)
  return children;
};

export default ProtectedRoute;