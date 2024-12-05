import { DEFAULT_INSIGHTS_DATE } from "@/constants/constants";
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
];

export default SchedullingRouters;
