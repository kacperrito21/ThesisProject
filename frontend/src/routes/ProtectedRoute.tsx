import { Navigate } from 'react-router-dom';
import { useAuthentication } from '../context/AuthenticationContext';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const auth = useAuthentication();
  console.error(auth);

  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
