import { lazy } from "react";

interface InsightsRouter {
  index?: boolean;
  path: string;
  element?: JSX.Element;
  children?: any;
}

const Sales = lazy(() => import("./Sales/Sales"));

const Inventory = lazy(() => import("./Inventory/Inventory"));
const Flash = lazy(() => import("./Flash/Flash"));

const InsightsRouters: InsightsRouter[] = [
  {
    index: true,
    path: "/insights/sales",
    element: <Sales />,
  },

  {
    index: true,
    path: "/insights/inventory",
    element: <Inventory />,
  },
  {
    index: true,
    path: "/insights/flash",
    element: <Flash />,
  },
];

export default InsightsRouters;
