import { lazy, Suspense } from 'react';
import { Roles } from './roles';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
const PayDialog = lazy(() => import('./PayDialog'));

let counter = 0;
const ProtectedRoute = ({
  children,
}: {
  children: JSX.Element;
  requiredRole: Roles;
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }
  // counter++;
  return (
    <>
      <Suspense fallback={null}>
        <PayDialog showRemaining={true} />
      </Suspense>
      {children}
    </>
  );
};

export default ProtectedRoute;
