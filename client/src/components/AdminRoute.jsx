import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading message="Checking admin permissions..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="unauthorized-page">
        <div className="unauthorized-card">
          <h2>Access Denied</h2>
          <p>
            You do not have administrative privileges to access this area.
            Only NGO administrators can view and manage system records.
          </p>
          <a href="/" className="back-btn">
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
