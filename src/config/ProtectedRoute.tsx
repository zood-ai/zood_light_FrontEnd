import React from 'react';
import { useContext } from 'react';
import { Roles } from './roles';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }: { children: JSX.Element; requiredRole: Roles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }
  // if (user) {
  //   return <Navigate to="/dashboard" />;
  // }

  // if (user.role !== requiredRole) {
  //   return <Navigate to="/unauthorized" />;
  // }

  return children;
};

export default ProtectedRoute;

