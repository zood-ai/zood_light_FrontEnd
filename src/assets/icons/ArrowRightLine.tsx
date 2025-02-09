import { PropsIcon } from "@/types/global.type";
import * as React from "react";
const ArrowRightLine: React.FC<PropsIcon> = ({ color = "var(--gray-500)" }) => {
  return (
    <svg
      width="12"
      height="14"
      viewBox="0 0 12 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 13L7 7L1 1"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11 13L11 1" stroke={color} strokeLinecap="round" />
    </svg>
  );
};

const ArrowRightLinetIcon = React.memo(ArrowRightLine);
export default ArrowRightLinetIcon;
