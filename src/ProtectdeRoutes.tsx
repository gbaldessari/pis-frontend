import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Cookies from 'js-cookie';
interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const usertoken = Cookies.get('token');
  if (!usertoken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;