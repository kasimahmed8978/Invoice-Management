import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './auth';

const ProtectedRoutes = ({ children }) => {
  const { isAuth } = useAuth();

  return isAuth ? children : <Navigate to="/" />;
};

export default ProtectedRoutes;
