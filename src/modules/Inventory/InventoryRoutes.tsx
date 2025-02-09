import { lazy } from "react";

interface InventoryRouter {
  index?: boolean;
  path: string;
  element?: JSX.Element;
  children?: any;
}

const Items = lazy(() => import("./Items/Items"));
const Batches = lazy(() => import("./Batches/Batches"));
const Warehouse = lazy(() => import("./Warehouse/Warehouse"));
const CPU = lazy(() => import("./CPU/CPU"));
const StorageArea = lazy(() => import("./StorageArea/StorageArea"));
const Recipes = lazy(() => import("./Recipes/Recipes"));
const Suppliers = lazy(() => import("./Suppliers/Suppliers"));
const Category = lazy(() => import("./Category/Category"));
const InventoryRouters: InventoryRouter[] = [
  {
    index: true,
    path: "",
    element: <Items />,
  },
  {
    path: "items",
    element: <Items />,
  },
  {
    path: "batches",
    element: <Batches />,
  },
  {
    path: "storage-areas",
    element: <StorageArea />,
  },
  {
    path: "recipes",
    element: <Recipes />,
  },
  {
    path: "suppliers",
    element: <Suppliers />,
  },
  // {
  //   path: "warehouse",
  //   element: <Warehouse />,
  // },
  {
    path: "CPU",
    element: <CPU />,
  },
  {
    path: "category",
    element: <Category />,
  },
];

export default InventoryRouters;
