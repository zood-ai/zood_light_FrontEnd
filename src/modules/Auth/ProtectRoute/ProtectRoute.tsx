// import { Layout } from "@/components/layout";
import { Layout } from "@/components/layout/Layout";
import AuthGuard from "@/guards/WithGuard";
import AuthGuardLogin from "@/guards/WithGuardAuth";
import { Outlet } from "react-router-dom";

export const AuthRoute = AuthGuard(() => (
  <Layout>
    <Outlet />
  </Layout>
));

export const AuthRouteLogin = AuthGuardLogin(() => <Outlet />);

export const UnAuthRoute = Outlet;
