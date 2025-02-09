import { lazy } from "react";

interface WastesRouter {
  index?: boolean;
  path: string;
  element?: JSX.Element;
  children?: any;
}
const Counts = lazy(() => import("./Counts/Counts"));
const Waste = lazy(() => import("./Waste/Waste"));
const Productions = lazy(() => import("./Productions/Productions"));

const WastesRouters: WastesRouter[] = [
  {
    index: true,
    path: "",
    element: <Counts />,
  },
  {
    path: "counts",
    element: <Counts />,
  },
  {
    path: "waste",
    element: <Waste />,
  },
  //   {
  //     path: "batch",
  //     element: <CreditNotes />,
  //   },
  //   {
  //     path: "waste",
  //     element: <ReceiveOrders />,
  //   },
  {
    path: "productions",
    element: <Productions />,
  },
];

export default WastesRouters;
