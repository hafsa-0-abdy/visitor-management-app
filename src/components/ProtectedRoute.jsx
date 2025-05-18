import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  // If authentication is still loading, show nothing or a loading spinner
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified and the user's role is not in the allowed roles, redirect
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect based on user role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'resident':
        return <Navigate to="/resident" replace />;
      case 'watchman':
        return <Navigate to="/watchman" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // If authenticated and authorized, render the children
  return <>{children}</>;
};

export default ProtectedRoute;