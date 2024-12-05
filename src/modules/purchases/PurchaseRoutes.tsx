import { lazy } from "react";

interface PurchasesRouter {
  index?: boolean;
  path: string;
  element?: JSX.Element;
  children?: any;
}
const PurchaseOrders = lazy(() => import("./PurchaseOrders/PurchaseOrders"));
const ReceiveOrders = lazy(() => import("./ReceiveOrders/ReceiveOrders"));
const PriceChanges = lazy(() => import("./PriceChanges/PriceChanges"));
const CreditNotes = lazy(() => import("./CreditNotes/CreditNotes"));
const Invoice = lazy(() => import("./Invoice/Invoice"));
const DashboardParchases = lazy(() => import("./DashboardParchases/DashboardParchases"));

const PurchasesRouters: PurchasesRouter[] = [
  {
    index: true,
    path: "",
    element: <PurchaseOrders />,
  },
  {
    path: "purchase-orders",
    element: <PurchaseOrders />,
  },
  {
    path: "receive-order",
    element: <ReceiveOrders />,
  },
  {
    path: "credit-notes",
    element: <CreditNotes />,
  },
  {
    path: "price-changes",
    element: <PriceChanges />,
  },
  {
    path: "invoice",
    element: <Invoice />,
  },
  {
    path: "purchases",
    element: <DashboardParchases />,
  },
];

export default PurchasesRouters;
