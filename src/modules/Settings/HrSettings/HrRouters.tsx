import { lazy } from "react";

interface PosSettingsRouter {
  index?: boolean;
  path: string;
  element?: JSX.Element;
  children?: any;
}

const Branches = lazy(() => import("./Branches/Branches"));
const Onboarding = lazy(() => import("./Onboarding/Onboarding"));
const Departments = lazy(() => import("./Departments/Departments"));
const Positions = lazy(() => import("./Positions/Positions"));
const Stations = lazy(() => import("./Stations/Stations"));
const Roles = lazy(() => import("./Roles/Roles"));
const Labour = lazy(() => import("./Labour/Labour")); // Labour

const HrSettingsRouters: PosSettingsRouter[] = [
  {
    index: true,
    path: "branches",
    element: <Branches />,
  },
  {
    index: true,
    path: "labour",
    element: <Labour />,

  },
  {
    index: true,
    path: "onboarding",
    element: <Onboarding />,

  },
  {
    index: true,
    path: "departments",
    element: <Departments />,

  },
  {
    index: true,
    path: "positions",
    element: <Positions />,
  },
  {
    index: true,
    path: "stations",
    element: <Stations />,
  },
  {
    index: true,
    path: "roles",
    element: <Roles />,
  },
];

export default HrSettingsRouters;
