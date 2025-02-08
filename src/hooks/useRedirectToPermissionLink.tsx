import { DEFAULT_INSIGHTS_DATE, PermissionsLinks } from "@/constants/constants";
import { useLocation, useNavigate } from "react-router-dom";

const useRedirectToPermissionLink = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const redirectFn = (permissions) => {
    const _admin = JSON.parse(localStorage.getItem("___admin") || "0");

    if (pathname === "/login") {
      if (_admin) {
        navigate(`/insights/sales?${DEFAULT_INSIGHTS_DATE}`);
        return;
      }
      navigate(`/?${DEFAULT_INSIGHTS_DATE}`);
    }

    if (pathname == "/" && _admin) {
      navigate(`/?${DEFAULT_INSIGHTS_DATE}`);
      return;
    }

    if (pathname !== "/login" && !_admin) {
      const permission = Object.keys(PermissionsLinks).find((permission) =>
        permissions.includes(permission)
      );
      const routes = PermissionsLinks[permission || ""];
      if (routes?.includes(pathname.split("/")[1])) {
        navigate(`${pathname}`);
        return;
      }
      navigate(`/?${DEFAULT_INSIGHTS_DATE}`);
    }
  };
  return { redirectFn };
};

export default useRedirectToPermissionLink;
