import { lazy } from "react";
import PosSettingsRouters from "./PosSettings/PosRouters";
import HrSettings from "./HrSettings/HrSetting";
import HrSettingsRouters from "./HrSettings/HrRouters";

interface SettingRouter {
  index?: boolean;
  path: string;
  element?: JSX.Element;
  children?: any;
}

const PosSettings = lazy(() => import("./PosSettings/PosSettings"));

const SettingsRouters: SettingRouter[] = [
  {
    path: "",
    children: [
      {
        path: "pos-settings",
        element: <PosSettings />,
        children: PosSettingsRouters,
      },
      {
        path: "hr-settings",
        element: <HrSettings />,
        children: HrSettingsRouters,
      },
    ],
  },
];

export default SettingsRouters;
