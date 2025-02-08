import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Login from "@/modules/Auth/Login/Login";
import { PERMISSIONS, PermissionsLinks } from "@/constants/constants";
import useRedirectToPermissionLink from "@/hooks/useRedirectToPermissionLink";


const AuthGuardLogin = (Component: any) => ({ ...props }) => {
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const { redirectFn } = useRedirectToPermissionLink()
  const permissions = useMemo(() => {
    return JSON.parse(localStorage.getItem("___permission") || "{}");
  }, []);

  const hasValidPermissions = Object.keys(PERMISSIONS).some(
    (key) => permissions[key]
  );

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!hasValidPermissions) {
      redirectFn(permissions);
      return
    }

    navigate('/');


  }, [token, permissions, navigate]);

  return token && permissions ? <Component {...props} /> : <Login />;
};

export default AuthGuardLogin;