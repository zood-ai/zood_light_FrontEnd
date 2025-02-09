import { PropsIcon } from "@/types/global.type";
import * as React from "react";

const Transfer: React.FC<PropsIcon> = ({ color = "var(--gray-300)" }) => {
  return (
    <svg width="1rem" height="1rem" viewBox="0 0 20 20" fill="none">
      <path
        d="M15 9l4-4m0 0l-4-4m4 4H7M5 19l-4-4m0 0l4-4m-4 4h12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const TransferIcon = React.memo(Transfer);
export default TransferIcon;
