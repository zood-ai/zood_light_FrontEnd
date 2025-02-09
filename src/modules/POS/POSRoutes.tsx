import { lazy } from "react";

interface POSRouter {
  index?: boolean;
  path: string;
  element?: JSX.Element;
  children?: any;
}

const Orders = lazy(() => import("./Orders/Orders"));
const Customers = lazy(() => import("./Customers/Customers"));

const POSRouters: POSRouter[] = [
  {
    index: true,
    path: "",
    element: <Orders />,
  },
  {
    path: "orders",
    element: <Orders />,
  },
  {
    path: "customers",
    element: <Customers />,
  },
];

export default POSRouters;
