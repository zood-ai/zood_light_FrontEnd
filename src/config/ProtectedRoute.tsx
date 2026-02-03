import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import PayDialog from './PayDialog';
import { Permissions } from './roles';
import { useSelector } from 'react-redux';
import { BranchProvider } from '@/context/BranchContext';

type ProtectedRouteProps = {
  children: JSX.Element;
  requiredPermissions: Permissions[];
};

const ProtectedRoute = ({
  children,
  requiredPermissions,
}: ProtectedRouteProps) => {
  const { user, logout } = useAuth();
  const allSettings = useSelector((state: any) => state.allSettings.value);

  if (!user) {
    logout();
    return <Navigate to="/" replace />;
  }

  const hasPermission =
    requiredPermissions?.length > 0
      ? requiredPermissions.every((permission) =>
          allSettings?.WhoAmI?.user?.roles
            ?.flatMap((el) => el?.permissions?.map((el2) => el2.name))
            ?.includes(permission)
        )
      : true;

  if (!hasPermission) {
    logout();
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <BranchProvider>
        <PayDialog showRemaining={true} />
        {children}
      </BranchProvider>
    </>
  );
};

export default ProtectedRoute;
