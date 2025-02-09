import { lazy } from "react";

interface SchedullingRouter {
  index?: boolean;
  path: string;
  element?: JSX.Element;
  children?: any;
}
const People = lazy(() => import("./People/People"));
const Requests = lazy(() => import("./Requests/Requests"));
const Schedule = lazy(() => import("./Schedule/Schedule"));
const Payroll = lazy(() => import("./Payroll/Payroll"));

const SchedullingRouters: SchedullingRouter[] = [
  {
    index: true,
    path: `schedule`,
    element: <Schedule />,
  },
  {
    path: "people",
    element: <People />,
  },
  {
    path: "requests",
    element: <Requests />,
  },
  {
    path: "payroll",
    element: <Payroll />,
  },
];

export default SchedullingRouters;
