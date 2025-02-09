import { lazy } from "react";

interface MenuRouter {
  index?: boolean;
  path: string;
  element?: JSX.Element;
  children?: any;
}
const Categories = lazy(() => import("./Categories/Categories"));
const Modifiers = lazy(() => import("./Modifiers/Modifiers"));
const Products = lazy(() => import("./Products/Products"));

const MenuRouters: MenuRouter[] = [
  {
    index: true,
    path: "",
    element: <Categories />,
  },
  {
    path: "categories",
    element: <Categories />,
  },
  {
    path: "modifiers",
    element: <Modifiers />,
  },
  {
    path: "products",
    element: <Products />,
  },
];

export default MenuRouters;
