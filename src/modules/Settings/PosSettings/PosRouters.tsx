import { lazy } from "react";

interface PosSettingsRouter {
  index?: boolean;
  path: string;
  element?: JSX.Element;
  children?: any;
}

const Branches = lazy(() => import("./Branches/Branches"));
const Taxes = lazy(() => import("./Taxes/TaxesAndTaxGroups"));

const Reasons = lazy(() => import("./Reasons/Reasons"));
const PaymentMethods = lazy(() => import("./PaymentMethods/PaymentMethods"));
const Devices = lazy(() => import("./Devices/Devices"));
const GeneralSettings = lazy(
  () => import("./GeneralSetttings/GeneralSettings")
);
const ReceiptSettings = lazy(() => import("./ReceiptSettings/ReceiptSetting"));

const PosSettingsRouters: PosSettingsRouter[] = [
  {
    index: true,
    path: "branches",
    element: <Branches />,
  },
  {
    path: "devices",
    element: <Devices />,
  },
  {
    path: "taxes",
    element: <Taxes />,
  },
  {
    path: "payemnt-methods",
    element: <PaymentMethods />,
  },
  {
    path: "reasons",
    element: <Reasons />,
  },
  {
    path: "general-settings",
    element: <GeneralSettings />,
  },
  {
    path: "receipt-settings",
    element: <ReceiptSettings />,
  },
];

export default PosSettingsRouters;
