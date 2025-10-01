import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;