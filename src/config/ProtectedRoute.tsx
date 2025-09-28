import { Roles } from './roles';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import PayDialog from './PayDialog';

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
      {children}
    </>
  );
};

export default ProtectedRoute;
