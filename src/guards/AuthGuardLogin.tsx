import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Login from "@/modules/Auth/Login/Login";
import { DEFAULT_INSIGHTS_DATE } from "@/constants/constants";

const AuthGuardLogin =
  (
    Component: React.ComponentType<{ permission: { [key: string]: boolean } }>
  ) =>
  ({ ...props }) => {
    const token = Cookies.get("token");
    const navigate = useNavigate();

    useEffect(() => {
      if (!token) {
        navigate("/login");
      } else {
        navigate(`/insights/sales?${DEFAULT_INSIGHTS_DATE}`);
      }
    }, [token]);

    const permission: { [key: string]: boolean } = {
      canWrite: true,
      canRead: true,
      canDelete: true,
    };

    return token ? <Component {...props} permission={permission} /> : <Login />;
  };

export default AuthGuardLogin;
