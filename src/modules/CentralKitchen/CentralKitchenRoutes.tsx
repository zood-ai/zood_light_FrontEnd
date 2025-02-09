import { lazy } from "react";
import Invoices from "./Invoice/Invoice";

interface CentralKitchenRouter {
  index?: boolean;
  path: string;
  element?: JSX.Element;
  children?: any;
}

const Productions = lazy(() => import("./Productions/Productions"));
const SalesReport = lazy(() => import("./SalesReport/SalesReport"));
const Orders = lazy(() => import("./Orders/Orders"));

const CentralKitchenRouters: CentralKitchenRouter[] = [
  {
    index: true,
    path: "",
    element: <Productions />,
  },
  {
    path: "production",
    element: <Productions />,
  },
  {
    path: "invoices",
    element: <Invoices />,
  },
  {
    path: "orders",
    element: <Orders />,
  },
  {
    path: "sales-report",
    element: <SalesReport />,
  },
];

export default CentralKitchenRouters;
