import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Login from "@/modules/Auth/Login/Login";
import { DEFAULT_INSIGHTS_DATE } from "@/constants/constants";

const AuthGuardPermission =
  (
    Component: React.ComponentType
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


    return token ? <Component {...props} /> : <Login />;
  };

export default AuthGuardPermission;
