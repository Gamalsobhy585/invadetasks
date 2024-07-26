import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ userData, children }) => {
  if (userData) {
    return <Navigate to="/tasks" />;
  }

  return children;
};

export default PublicRoute;
