import { PropsIcon } from "@/types/global.type";
import * as React from "react";

const ArrowReturn: React.FC<PropsIcon> = ({
  color = "var(--primary)",
  className = "",
  onClick,
  height = "32px",
  width = "32px",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      onClick={onClick}
      className={className}
    >
      <path
        d="M15 8H1m0 0l7 7M1 8l7-7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowReturn;
