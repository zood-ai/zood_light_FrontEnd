import { PropsIcon } from "@/types/global.type";
import * as React from "react";
const Inventory: React.FC<PropsIcon> = ({ color = "var(--gray-300)" }) => {
  return (
    <svg width="1rem" height="1rem" viewBox="0 0 18 22" fill="none">
      <path
        d="M11 1v6h6m-4 5H5m8 4H5m2-8H5m6.5-7H3a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V6.5L11.5 1z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const InventoryIcon = React.memo(Inventory);
export default InventoryIcon;
