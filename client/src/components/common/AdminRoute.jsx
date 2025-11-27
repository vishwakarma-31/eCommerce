import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    // Redirect to home page if user is not admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;