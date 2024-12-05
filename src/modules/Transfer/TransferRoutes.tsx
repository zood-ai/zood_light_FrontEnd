import { lazy } from "react";

interface TransferRouter {
    index?: boolean;
    path: string;
    element?: JSX.Element;
    children?: any;
}
const Transfer = lazy(() => import("./Transfer"));


const TransferRouters: TransferRouter[] = [
    {
        index: true,
        path: "",
        element: <Transfer />,
    },
    {
        path: "transfer",
        element: <Transfer />,
    },

];

export default TransferRouters;
