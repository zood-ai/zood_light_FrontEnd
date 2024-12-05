import { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { DEFAULT_INSIGHTS_DATE } from "@/constants/constants";

const AuthGuard =
  (
    Component: React.ComponentType<{ permission: { [key: string]: boolean } }>
  ) =>
  ({ ...props }) => {
    const token = Cookies.get("token");
    const { pathname } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
      if (token && pathname === "/login") {
        navigate("/insights/sales?" + DEFAULT_INSIGHTS_DATE);
      }
    }, [pathname]);

    const permission: { [key: string]: boolean } = {
      canWrite: true,
      canRead: true,
      canDelete: true,
    };

    return token ? (
      <Component {...props} permission={permission} />
    ) : (
      <Navigate to="/login" />
    );
  };

export default AuthGuard;
