import { PropsIcon } from "@/types/global.type";
import * as React from "react";
const ArrowLeftLine: React.FC<PropsIcon> = ({ color = "var(--gray-500)" }) => {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
      <path
        d="M11 13L5 7l6-6"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M1 13V1" stroke="#777" strokeLinecap="round" />
    </svg>
  );
};

const ArrowLeftLinetIcon = React.memo(ArrowLeftLine);
export default ArrowLeftLinetIcon;
