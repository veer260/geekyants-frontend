// src/components/ProtectedRoute.tsx
// import { useUser } from '../context/UserProvider';
import React from 'react';
import { UserContext } from '@/providers/userProvider';

import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
  role: 'engineer' | 'manager';
}

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const context = React.useContext(UserContext);

  if (!context) {
    return <div>Error: UserContext not found</div>;
  }

  const { user, isLoading } = context;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};