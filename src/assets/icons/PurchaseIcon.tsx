import { PropsIcon } from "@/types/global.type";
import * as React from "react";

const Purchase: React.FC<PropsIcon> = ({ color = "var(--gray-300)" }) => {
  return (
    <svg width="1rem" height="1rem" viewBox="0 0 20 20" fill="none">
      <path
        d="M1 1h1.796l2.39 11.156a1.796 1.796 0 001.796 1.419h8.785a1.796 1.796 0 001.751-1.41L19 5.49H3.757m3.486 12.53a.898.898 0 11-1.797 0 .898.898 0 011.797 0zm9.88 0a.898.898 0 11-1.797 0 .898.898 0 011.797 0z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const PurchaseIcon = React.memo(Purchase);
export default PurchaseIcon;
