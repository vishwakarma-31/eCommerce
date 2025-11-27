import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

const CreatorRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (!user || (user.role !== 'creator' && user.role !== 'admin')) {
    // Redirect to home page if user is not creator or admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default CreatorRoute;