import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import PayDialog from './PayDialog';
import { Permissions } from './roles';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import Loader from '@/components/loader';

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
  const hasToken = Cookies.get('accessToken');

  // لا تسجيل خروج إذا كان التوكن موجوداً (حالة سباق بعد تسجيل الدخول)
  if (!user && !hasToken) {
    logout();
    return <Navigate to="/" replace />;
  }
  if (!user && hasToken) {
    return <Loader className="min-h-[50vh]" />; // انتظار تحديث حالة المستخدم
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
      {/* <PayDialog showRemaining={true} /> */}
      {children}
    </>
  );
};

export default ProtectedRoute;
